import { db } from '../db.js';
import {
  Role,
  ReportStatus,
  CollectionRequestStatus,
  ComplaintStatus,
  WasteCategory,
  ReportSeverity,
  CollectionTaskStatus,
} from '@prisma/client';
import { createNotification } from './notificationService.js';
import {
  isValidReportTransition,
  isValidRequestTransition,
} from '../utils/statusTransitions.js';

export async function getAdminAnalytics() {
  const [
    totalCitizens,
    totalCollectors,
    totalRecyclingOrgs,
    totalRecyclingCenters,
    totalReports,
    resolvedReports,
    pendingReports,
    inProgressReports,
    rejectedReports,
    totalRequests,
    pendingRequests,
    approvedRequests,
    assignedRequests,
    inProgressRequests,
    completedRequests,
    rejectedRequests,
    openComplaints,
    inReviewComplaints,
    resolvedComplaints,
    totalPointsAgg,
    totalRecyclingRecords,
    pendingRecycling,
    processingRecycling,
    completedRecycling,
    allRecyclingQuantityAgg,
    recycledQuantityAgg,
  ] = await Promise.all([
    db.user.count({ where: { role: Role.CITIZEN } }),
    db.user.count({ where: { role: Role.COLLECTOR } }),
    db.user.count({ where: { role: Role.RECYCLING_ORGANIZATION } }),
    db.recyclingCenter.count(),
    db.wasteReport.count(),
    db.wasteReport.count({ where: { status: ReportStatus.COMPLETED } }),
    db.wasteReport.count({ where: { status: ReportStatus.PENDING } }),
    db.wasteReport.count({ where: { status: ReportStatus.IN_PROGRESS } }),
    db.wasteReport.count({ where: { status: ReportStatus.REJECTED } }),
    db.collectionRequest.count(),
    db.collectionRequest.count({ where: { status: CollectionRequestStatus.PENDING } }),
    db.collectionRequest.count({ where: { status: CollectionRequestStatus.APPROVED } }),
    db.collectionRequest.count({ where: { status: CollectionRequestStatus.ASSIGNED } }),
    db.collectionRequest.count({ where: { status: CollectionRequestStatus.IN_PROGRESS } }),
    db.collectionRequest.count({ where: { status: CollectionRequestStatus.COMPLETED } }),
    db.collectionRequest.count({ where: { status: CollectionRequestStatus.REJECTED } }),
    db.complaint.count({ where: { status: ComplaintStatus.OPEN } }),
    db.complaint.count({ where: { status: ComplaintStatus.IN_REVIEW } }),
    db.complaint.count({ where: { status: ComplaintStatus.RESOLVED } }),
    db.user.aggregate({ _sum: { ecoPoints: true } }),
    db.recyclingRecord.count(),
    db.recyclingRecord.count({ where: { status: 'PENDING' } }),
    db.recyclingRecord.count({ where: { status: 'PROCESSING' } }),
    db.recyclingRecord.count({ where: { status: 'RECYCLED' } }),
    db.recyclingRecord.aggregate({ _sum: { quantity: true } }),
    db.recyclingRecord.aggregate({ where: { status: 'RECYCLED' }, _sum: { quantity: true } }),
  ]);

  const activeCollections = inProgressRequests + inProgressReports;
  const totalCompletedCollections = completedRequests + resolvedReports;
  const resolutionRate = totalReports > 0 ? Math.round((resolvedReports / totalReports) * 100) : 0;

  const totalCollectedQuantity = allRecyclingQuantityAgg._sum.quantity || 0;
  const totalRecycledQuantity = recycledQuantityAgg._sum.quantity || 0;
  const recyclingRate = totalCollectedQuantity > 0
    ? Math.min(100, Math.round((totalRecycledQuantity / totalCollectedQuantity) * 100))
    : 0;

  return {
    totalCitizens,
    totalCollectors,
    totalRecyclingOrgs,
    totalRecyclingCenters,
    totalReports,
    resolvedReports,
    pendingReports,
    inProgressReports,
    rejectedReports,
    totalRequests,
    pendingRequests,
    approvedRequests,
    assignedRequests,
    activeCollections,
    completedCollections: totalCompletedCollections,
    rejectedRequests,
    openComplaints,
    inReviewComplaints,
    resolvedComplaints,
    resolutionRate,
    totalPointsDistributed: totalPointsAgg._sum.ecoPoints || 0,
    totalRecyclingRecords,
    pendingRecycling,
    processingRecycling,
    completedRecycling,
    totalRecycledQuantity,
    recyclingRate,
  };
}

export async function validateAndApproveReport(reportId: string, pointsAwarded: number = 50) {
  const report = await db.wasteReport.findUnique({
    where: { id: reportId },
    select: { id: true, status: true, title: true, reporterId: true },
  });
  if (!report) throw new Error('Report not found');

  if (!isValidReportTransition(report.status, ReportStatus.VERIFIED)) {
    throw new Error(`Cannot transition report status from ${report.status} to VERIFIED.`);
  }

  const result = await db.$transaction(async (tx: any) => {
    const transition = await tx.wasteReport.updateMany({
      where: { id: reportId, status: report.status },
      data: { status: ReportStatus.VERIFIED },
    });

    if (transition.count === 0) {
      throw new Error('State conflict while verifying report.');
    }

    const updatedUser = await tx.user.update({
      where: { id: report.reporterId },
      data: { ecoPoints: { increment: pointsAwarded } },
    });

    await tx.rewardTransaction.create({
      data: {
        userId: report.reporterId,
        amount: pointsAwarded,
        type: 'EARNED',
        description: `Validated Waste Report Award: ${report.title}`,
      },
    });

    await tx.notification.create({
      data: {
        userId: report.reporterId,
        title: 'Waste Report Verified!',
        message: `Your waste report "${report.title}" has been verified by Municipal Administration. You earned +${pointsAwarded} Eco-Points!`,
        type: 'SUCCESS',
      },
    });

    const updatedReport = await tx.wasteReport.findUnique({
      where: { id: reportId },
      include: {
        reporter: { select: { id: true, name: true, email: true, avatarUrl: true } },
        assignedTo: { select: { id: true, name: true, email: true, avatarUrl: true } },
      },
    });

    return { report: updatedReport, updatedPoints: updatedUser.ecoPoints };
  });

  return result;
}

export async function rejectReport(reportId: string, reason?: string) {
  const report = await db.wasteReport.findUnique({
    where: { id: reportId },
    select: { id: true, status: true, title: true, reporterId: true },
  });
  if (!report) throw new Error('Report not found');

  if (!isValidReportTransition(report.status, ReportStatus.REJECTED)) {
    throw new Error(`Cannot reject report in status ${report.status}.`);
  }

  const updated = await db.wasteReport.update({
    where: { id: reportId },
    data: { status: ReportStatus.REJECTED },
  });

  await createNotification(
    report.reporterId,
    'Waste Report Rejected',
    `Your waste report "${report.title}" was rejected by Municipal Administration.${reason ? ` Reason: ${reason}` : ''}`,
    'WARNING'
  );

  return updated;
}

export async function approveCollectionRequest(requestId: string) {
  const req = await db.collectionRequest.findUnique({
    where: { id: requestId },
    select: { id: true, status: true, citizenId: true, wasteType: true, address: true },
  });
  if (!req) throw new Error('Collection request not found');

  if (!isValidRequestTransition(req.status, CollectionRequestStatus.APPROVED)) {
    throw new Error(`Cannot transition request status from ${req.status} to APPROVED.`);
  }

  const updated = await db.collectionRequest.update({
    where: { id: requestId },
    data: { status: CollectionRequestStatus.APPROVED },
  });

  await createNotification(
    req.citizenId,
    'Collection Request Approved',
    `Your waste collection request for ${req.wasteType} at ${req.address} has been approved. Dispatch is assigning a collector.`,
    'SUCCESS'
  );

  return updated;
}

export async function rejectCollectionRequest(requestId: string, reason?: string) {
  const req = await db.collectionRequest.findUnique({
    where: { id: requestId },
    select: { id: true, status: true, citizenId: true, wasteType: true },
  });
  if (!req) throw new Error('Collection request not found');

  if (!isValidRequestTransition(req.status, CollectionRequestStatus.REJECTED)) {
    throw new Error(`Cannot reject collection request in status ${req.status}.`);
  }

  const updated = await db.collectionRequest.update({
    where: { id: requestId },
    data: { status: CollectionRequestStatus.REJECTED },
  });

  await createNotification(
    req.citizenId,
    'Collection Request Rejected',
    `Your waste collection request for ${req.wasteType} was rejected.${reason ? ` Reason: ${reason}` : ''}`,
    'WARNING'
  );

  return updated;
}

export async function assignCollectorToRequest(requestId: string, collectorId: string) {
  const request = await db.collectionRequest.findUnique({
    where: { id: requestId },
    select: {
      id: true,
      status: true,
      citizenId: true,
      address: true,
      latitude: true,
      longitude: true,
      preferredDate: true,
      wasteType: true,
    },
  });

  if (!request) throw new Error('Collection request not found.');

  if (!['APPROVED', 'ASSIGNED'].includes(request.status)) {
    throw new Error(`Collector assignment is only allowed after a request has been APPROVED. Current status is ${request.status}.`);
  }

  const collector = await db.user.findFirst({
    where: { id: collectorId, role: Role.COLLECTOR },
    select: { id: true, name: true, email: true },
  });

  if (!collector) throw new Error('Selected user is not a valid collector.');

  const result = await db.$transaction(async (tx: any) => {
    const updatedReq = await tx.collectionRequest.update({
      where: { id: requestId },
      data: {
        assignedCollectorId: collector.id,
        status: CollectionRequestStatus.ASSIGNED,
      },
    });

    const task = await tx.collectionTask.upsert({
      where: { requestId },
      create: {
        requestId,
        collectorId: collector.id,
        address: request.address,
        latitude: request.latitude,
        longitude: request.longitude,
        scheduledDate: request.preferredDate,
        status: CollectionTaskStatus.ASSIGNED,
      },
      update: {
        collectorId: collector.id,
        address: request.address,
        latitude: request.latitude,
        longitude: request.longitude,
        scheduledDate: request.preferredDate,
        status: CollectionTaskStatus.ASSIGNED,
      },
    });

    await tx.collectionRequest.update({
      where: { id: requestId },
      data: { collectionTaskId: task.id },
    });

    await tx.notification.create({
      data: {
        userId: request.citizenId,
        title: 'Collector Assigned!',
        message: `Collector ${collector.name} has been assigned to your ${request.wasteType} collection request.`,
        type: 'INFO',
      },
    });

    await tx.notification.create({
      data: {
        userId: collector.id,
        title: 'New Collection Task Assigned',
        message: `You have been assigned a new pickup task at ${request.address}. Scheduled: ${new Date(request.preferredDate).toLocaleDateString()}`,
        type: 'TASK',
      },
    });

    return { updatedReq, task };
  });

  return result;
}

export async function assignCollectorToReport(reportId: string, collectorId: string) {
  const collector = await db.user.findFirst({
    where: { id: collectorId, role: Role.COLLECTOR },
  });
  if (!collector) throw new Error('Selected user is not a valid collector');

  const updated = await db.wasteReport.update({
    where: { id: reportId },
    data: {
      assignedToId: collectorId,
      status: ReportStatus.ASSIGNED,
    },
  });

  return updated;
}

export async function getAdminTasks() {
  const tasks = await db.collectionTask.findMany({
    include: {
      collector: { select: { id: true, name: true, email: true, phone: true, avatarUrl: true } },
      request: {
        include: {
          citizen: { select: { id: true, name: true, phone: true, email: true } },
        },
      },
      report: {
        include: {
          reporter: { select: { id: true, name: true, phone: true, email: true } },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return tasks;
}

export async function getAllUsers(role?: Role) {
  const users = await db.user.findMany({
    where: role ? { role } : undefined,
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      ecoPoints: true,
      avatarUrl: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return users;
}

export async function updateUserRole(userId: string, newRole: Role) {
  const updated = await db.user.update({
    where: { id: userId },
    data: { role: newRole },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });

  return updated;
}

export async function getCollectors() {
  const collectors = await db.user.findMany({
    where: { role: Role.COLLECTOR },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      avatarUrl: true,
      createdAt: true,
      _count: {
        select: { assignedTasks: true },
      },
    },
    orderBy: { name: 'asc' },
  });

  return collectors;
}

export async function getRecyclingOrganizations() {
  const orgs = await db.recyclingOrganization.findMany({
    include: {
      user: { select: { id: true, name: true, email: true, phone: true } },
      _count: { select: { recyclingRecords: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return orgs;
}
