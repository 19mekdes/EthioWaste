'use server';

import { db } from '@/lib/db';
import {
  Role,
  ReportStatus,
  CollectionRequestStatus,
  ComplaintStatus,
  WasteCategory,
  ReportSeverity,
  CollectionTaskStatus,
} from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { requireRole } from '@/lib/session';
import { createUserNotification } from '@/actions/notifications';
import {
  isValidReportTransition,
  isValidRequestTransition,
  isValidComplaintTransition,
} from '@/lib/status-transitions';

// ==========================================
// 1. KPI & DASHBOARD ANALYTICS
// ==========================================

export async function getAdminAnalytics() {
  try {
    await requireRole([Role.MUNICIPAL_ADMIN]);

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
    
    // Formula: Recycling Rate (%) = (Total Recycled Quantity / Total Collected Quantity) * 100
    const totalCollectedQuantity = allRecyclingQuantityAgg._sum.quantity || 0;
    const totalRecycledQuantity = recycledQuantityAgg._sum.quantity || 0;
    const recyclingRate = totalCollectedQuantity > 0
      ? Math.min(100, Math.round((totalRecycledQuantity / totalCollectedQuantity) * 100))
      : 0;

    return {
      success: true,
      stats: {
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
      },
    };
  } catch (error: any) {
    console.error('Failed to fetch admin analytics:', error);
    return {
      success: false,
      error: error.message || 'Unauthorized access to admin analytics.',
      stats: {
        totalCitizens: 0,
        totalCollectors: 0,
        totalRecyclingOrgs: 0,
        totalRecyclingCenters: 0,
        totalReports: 0,
        resolvedReports: 0,
        pendingReports: 0,
        inProgressReports: 0,
        rejectedReports: 0,
        totalRequests: 0,
        pendingRequests: 0,
        approvedRequests: 0,
        assignedRequests: 0,
        activeCollections: 0,
        completedCollections: 0,
        rejectedRequests: 0,
        openComplaints: 0,
        inReviewComplaints: 0,
        resolvedComplaints: 0,
        resolutionRate: 0,
        totalPointsDistributed: 0,
      },
    };
  }
}

// ==========================================
// 2. WASTE REPORT MANAGEMENT
// ==========================================

export async function getAdminWasteReports(options?: {
  status?: ReportStatus;
  category?: WasteCategory;
  severity?: ReportSeverity;
  searchQuery?: string;
}) {
  try {
    await requireRole([Role.MUNICIPAL_ADMIN]);

    const where: any = {};
    if (options?.status) where.status = options.status;
    if (options?.category) where.category = options.category;
    if (options?.severity) where.severity = options.severity;
    if (options?.searchQuery?.trim()) {
      const q = options.searchQuery.trim().toLowerCase();
      where.OR = [
        { title: { contains: q } },
        { description: { contains: q } },
        { address: { contains: q } },
        { id: { contains: q } },
      ];
    }

    const reports = await db.wasteReport.findMany({
      where,
      include: {
        reporter: { select: { id: true, name: true, email: true, avatarUrl: true, phone: true } },
        assignedTo: { select: { id: true, name: true, email: true, avatarUrl: true, phone: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return { success: true, reports };
  } catch (error: any) {
    console.error('Failed to fetch admin waste reports:', error);
    return { success: false, error: error.message || 'Unauthorized', reports: [] };
  }
}

export async function validateAndApproveReport(reportId: string, pointsAwarded: number = 50) {
  try {
    await requireRole([Role.MUNICIPAL_ADMIN]);

    const report = await db.wasteReport.findUnique({
      where: { id: reportId },
      select: { id: true, status: true, title: true, reporterId: true },
    });
    if (!report) return { success: false, error: 'Report not found' };

    if (!isValidReportTransition(report.status, ReportStatus.VERIFIED)) {
      return {
        success: false,
        error: `Cannot transition report status from ${report.status} to VERIFIED.`,
      };
    }

    const result = await db.$transaction(async (tx) => {
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

    revalidatePath('/dashboard/admin');
    revalidatePath('/dashboard/admin/reports');
    revalidatePath('/dashboard/citizen');
    revalidatePath('/dashboard/citizen/reports');

    return { success: true, report: result.report, awarded: true, updatedPoints: result.updatedPoints };
  } catch (error: any) {
    console.error('Failed to validate report:', error);
    return { success: false, error: error.message || 'Failed to validate report.' };
  }
}

export async function rejectReport(reportId: string, reason?: string) {
  try {
    await requireRole([Role.MUNICIPAL_ADMIN]);

    const report = await db.wasteReport.findUnique({
      where: { id: reportId },
      select: { id: true, status: true, title: true, reporterId: true },
    });
    if (!report) return { success: false, error: 'Report not found' };

    if (!isValidReportTransition(report.status, ReportStatus.REJECTED)) {
      return {
        success: false,
        error: `Cannot reject report in status ${report.status}.`,
      };
    }

    const updated = await db.wasteReport.update({
      where: { id: reportId },
      data: { status: ReportStatus.REJECTED },
    });

    await createUserNotification(
      report.reporterId,
      'Waste Report Rejected',
      `Your waste report "${report.title}" was rejected by Municipal Administration.${reason ? ` Reason: ${reason}` : ''}`,
      'WARNING'
    );

    revalidatePath('/dashboard/admin');
    revalidatePath('/dashboard/admin/reports');
    revalidatePath('/dashboard/citizen');

    return { success: true, report: updated };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to reject report.' };
  }
}

// ==========================================
// 3. COLLECTION REQUEST MANAGEMENT
// ==========================================

export async function getAdminCollectionRequests(options?: {
  status?: CollectionRequestStatus;
  priority?: ReportSeverity;
  wasteType?: WasteCategory;
  searchQuery?: string;
}) {
  try {
    await requireRole([Role.MUNICIPAL_ADMIN]);

    const where: any = {};
    if (options?.status) where.status = options.status;
    if (options?.priority) where.priority = options.priority;
    if (options?.wasteType) where.wasteType = options.wasteType;
    if (options?.searchQuery?.trim()) {
      const q = options.searchQuery.trim().toLowerCase();
      where.OR = [
        { address: { contains: q } },
        { description: { contains: q } },
        { id: { contains: q } },
      ];
    }

    const requests = await db.collectionRequest.findMany({
      where,
      include: {
        citizen: { select: { id: true, name: true, email: true, phone: true, avatarUrl: true } },
        assignedCollector: { select: { id: true, name: true, email: true, phone: true, avatarUrl: true } },
        collectionTask: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return { success: true, requests };
  } catch (error: any) {
    console.error('Failed to fetch admin collection requests:', error);
    return { success: false, error: error.message || 'Unauthorized', requests: [] };
  }
}

export async function approveCollectionRequest(requestId: string) {
  try {
    await requireRole([Role.MUNICIPAL_ADMIN]);

    const req = await db.collectionRequest.findUnique({
      where: { id: requestId },
      select: { id: true, status: true, citizenId: true, wasteType: true, address: true },
    });
    if (!req) return { success: false, error: 'Collection request not found' };

    if (!isValidRequestTransition(req.status, CollectionRequestStatus.APPROVED)) {
      return {
        success: false,
        error: `Cannot transition request status from ${req.status} to APPROVED.`,
      };
    }

    const updated = await db.collectionRequest.update({
      where: { id: requestId },
      data: { status: CollectionRequestStatus.APPROVED },
    });

    await createUserNotification(
      req.citizenId,
      'Collection Request Approved',
      `Your waste collection request for ${req.wasteType} at ${req.address} has been approved. Dispatch is assigning a collector.`,
      'SUCCESS'
    );

    revalidatePath('/dashboard/admin');
    revalidatePath('/dashboard/admin/requests');
    revalidatePath('/dashboard/citizen');
    revalidatePath(`/dashboard/citizen/requests/${requestId}`);

    return { success: true, request: updated };
  } catch (error: any) {
    console.error('Failed to approve collection request:', error);
    return { success: false, error: error.message || 'Failed to approve request' };
  }
}

export async function rejectCollectionRequest(requestId: string, reason?: string) {
  try {
    await requireRole([Role.MUNICIPAL_ADMIN]);

    const req = await db.collectionRequest.findUnique({
      where: { id: requestId },
      select: { id: true, status: true, citizenId: true, wasteType: true },
    });
    if (!req) return { success: false, error: 'Collection request not found' };

    if (!isValidRequestTransition(req.status, CollectionRequestStatus.REJECTED)) {
      return {
        success: false,
        error: `Cannot reject collection request in status ${req.status}.`,
      };
    }

    const updated = await db.collectionRequest.update({
      where: { id: requestId },
      data: { status: CollectionRequestStatus.REJECTED },
    });

    await createUserNotification(
      req.citizenId,
      'Collection Request Rejected',
      `Your waste collection request for ${req.wasteType} was rejected.${reason ? ` Reason: ${reason}` : ''}`,
      'WARNING'
    );

    revalidatePath('/dashboard/admin');
    revalidatePath('/dashboard/admin/requests');
    revalidatePath('/dashboard/citizen');
    revalidatePath(`/dashboard/citizen/requests/${requestId}`);

    return { success: true, request: updated };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to reject request' };
  }
}

// ==========================================
// 4. COLLECTOR ASSIGNMENT & DISPATCH SYSTEM
// ==========================================

export async function assignCollectorToRequest(requestId: string, collectorId: string) {
  try {
    await requireRole([Role.MUNICIPAL_ADMIN]);

    // 1. Verify Request
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

    if (!request) return { success: false, error: 'Collection request not found.' };

    if (!['APPROVED', 'ASSIGNED'].includes(request.status)) {
      return {
        success: false,
        error: `Collector assignment is only allowed after a request has been APPROVED. Current status is ${request.status}.`,
      };
    }

    // 2. Verify Collector
    const collector = await db.user.findFirst({
      where: { id: collectorId, role: Role.COLLECTOR },
      select: { id: true, name: true, email: true },
    });

    if (!collector) return { success: false, error: 'Selected user is not a valid collector.' };

    // 3. Execute Transaction for Assignment & Task Creation
    const result = await db.$transaction(async (tx) => {
      // Update CollectionRequest status
      const updatedReq = await tx.collectionRequest.update({
        where: { id: requestId },
        data: {
          assignedCollectorId: collector.id,
          status: CollectionRequestStatus.ASSIGNED,
        },
      });

      // Create or Update CollectionTask
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

      // Update CollectionRequest with taskId
      await tx.collectionRequest.update({
        where: { id: requestId },
        data: { collectionTaskId: task.id },
      });

      // Notify Citizen
      await tx.notification.create({
        data: {
          userId: request.citizenId,
          title: 'Collector Assigned!',
          message: `Collector ${collector.name} has been assigned to your ${request.wasteType} collection request.`,
          type: 'INFO',
        },
      });

      // Notify Collector
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

    revalidatePath('/dashboard/admin');
    revalidatePath('/dashboard/admin/requests');
    revalidatePath('/dashboard/admin/tasks');
    revalidatePath('/dashboard/admin/collectors');
    revalidatePath(`/dashboard/citizen/requests/${requestId}`);

    return { success: true, request: result.updatedReq, task: result.task };
  } catch (error: any) {
    console.error('Failed to assign collector:', error);
    return { success: false, error: error.message || 'Failed to assign collector to request.' };
  }
}

export async function getAdminCollectionTasks() {
  try {
    await requireRole([Role.MUNICIPAL_ADMIN]);

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

    return { success: true, tasks };
  } catch (error: any) {
    console.error('Failed to fetch admin collection tasks:', error);
    return { success: false, error: error.message || 'Unauthorized', tasks: [] };
  }
}

// ==========================================
// 5. COLLECTOR & USER MANAGEMENT
// ==========================================

export async function getCollectors() {
  try {
    await requireRole([Role.MUNICIPAL_ADMIN]);

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
          select: {
            assignedTasks: true,
            assignedReqCollectors: true,
          },
        },
        assignedTasks: {
          select: { id: true, status: true },
        },
      },
      orderBy: { name: 'asc' },
    });

    const enriched = collectors.map((c) => {
      const activeTasksCount = c.assignedTasks.filter(
        (t) => t.status === 'ASSIGNED' || t.status === 'IN_PROGRESS'
      ).length;
      const completedTasksCount = c.assignedTasks.filter((t) => t.status === 'COMPLETED').length;
      return {
        id: c.id,
        name: c.name,
        email: c.email,
        phone: c.phone,
        avatarUrl: c.avatarUrl,
        createdAt: c.createdAt,
        totalAssigned: c._count.assignedTasks + c._count.assignedReqCollectors,
        activeTasks: activeTasksCount,
        completedTasks: completedTasksCount,
      };
    });

    return { success: true, collectors: enriched };
  } catch (error: any) {
    return { success: false, error: error.message || 'Unauthorized access.', collectors: [] };
  }
}

export async function getAdminUsers(options?: { role?: Role; searchQuery?: string }) {
  try {
    await requireRole([Role.MUNICIPAL_ADMIN]);

    const where: any = {};
    if (options?.role) where.role = options.role;
    if (options?.searchQuery?.trim()) {
      const q = options.searchQuery.trim().toLowerCase();
      where.OR = [
        { name: { contains: q } },
        { email: { contains: q } },
        { phone: { contains: q } },
      ];
    }

    const users = await db.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        ecoPoints: true,
        phone: true,
        address: true,
        avatarUrl: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            reports: true,
            collectionRequests: true,
            assignedTasks: true,
            complaints: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return { success: true, users };
  } catch (error: any) {
    console.error('Failed to fetch admin users:', error);
    return { success: false, error: error.message || 'Unauthorized', users: [] };
  }
}

// ==========================================
// 6. RECYCLING ORGANIZATIONS & CENTERS
// ==========================================

export async function getAdminRecyclingOrgs() {
  try {
    await requireRole([Role.MUNICIPAL_ADMIN]);

    const orgs = await db.recyclingOrganization.findMany({
      include: {
        user: { select: { id: true, name: true, email: true, phone: true } },
        recyclingRecords: { select: { id: true, quantity: true, material: true, status: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return { success: true, orgs };
  } catch (error: any) {
    console.error('Failed to fetch recycling orgs:', error);
    return { success: false, error: error.message || 'Unauthorized', orgs: [] };
  }
}

export async function getAdminRecyclingCenters() {
  try {
    await requireRole([Role.MUNICIPAL_ADMIN]);

    const centers = await db.recyclingCenter.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return { success: true, centers };
  } catch (error: any) {
    console.error('Failed to fetch recycling centers:', error);
    return { success: false, error: error.message || 'Unauthorized', centers: [] };
  }
}

export async function createRecyclingCenterAdmin(data: {
  name: string;
  description?: string;
  address: string;
  city?: string;
  latitude: number;
  longitude: number;
  acceptedMaterials: string;
  contactPhone?: string;
  operatingHours?: string;
}) {
  try {
    await requireRole([Role.MUNICIPAL_ADMIN]);

    if (!data.name || !data.address || !data.acceptedMaterials) {
      return { success: false, error: 'Name, address, and accepted materials are required.' };
    }

    const center = await db.recyclingCenter.create({
      data: {
        name: data.name.trim(),
        description: data.description?.trim() || null,
        address: data.address.trim(),
        city: data.city?.trim() || 'Addis Ababa',
        latitude: data.latitude,
        longitude: data.longitude,
        acceptedMaterials: data.acceptedMaterials.trim(),
        contactPhone: data.contactPhone?.trim() || null,
        operatingHours: data.operatingHours?.trim() || '8:00 AM - 6:00 PM',
        status: 'ACTIVE',
      },
    });

    revalidatePath('/dashboard/admin/centers');
    revalidatePath('/dashboard/citizen/centers');

    return { success: true, center };
  } catch (error: any) {
    console.error('Failed to create recycling center:', error);
    return { success: false, error: error.message || 'Failed to create center' };
  }
}

export async function updateRecyclingCenterAdmin(
  id: string,
  data: {
    name?: string;
    description?: string;
    address?: string;
    city?: string;
    latitude?: number;
    longitude?: number;
    acceptedMaterials?: string;
    contactPhone?: string;
    operatingHours?: string;
    status?: string;
  }
) {
  try {
    await requireRole([Role.MUNICIPAL_ADMIN]);

    const updated = await db.recyclingCenter.update({
      where: { id },
      data,
    });

    revalidatePath('/dashboard/admin/centers');
    revalidatePath('/dashboard/citizen/centers');

    return { success: true, center: updated };
  } catch (error: any) {
    console.error('Failed to update recycling center:', error);
    return { success: false, error: error.message || 'Failed to update center' };
  }
}

export async function deleteRecyclingCenterAdmin(id: string) {
  try {
    await requireRole([Role.MUNICIPAL_ADMIN]);

    await db.recyclingCenter.delete({
      where: { id },
    });

    revalidatePath('/dashboard/admin/centers');
    revalidatePath('/dashboard/citizen/centers');

    return { success: true };
  } catch (error: any) {
    console.error('Failed to delete recycling center:', error);
    return { success: false, error: error.message || 'Failed to delete center' };
  }
}

// ==========================================
// 7. COMPLAINTS & FEEDBACK MANAGEMENT
// ==========================================

export async function getAdminComplaints(options?: { status?: ComplaintStatus; searchQuery?: string }) {
  try {
    await requireRole([Role.MUNICIPAL_ADMIN]);

    const where: any = {};
    if (options?.status) where.status = options.status;
    if (options?.searchQuery?.trim()) {
      const q = options.searchQuery.trim().toLowerCase();
      where.OR = [
        { category: { contains: q } },
        { description: { contains: q } },
        { id: { contains: q } },
      ];
    }

    const complaints = await db.complaint.findMany({
      where,
      include: {
        citizen: { select: { id: true, name: true, email: true, phone: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return { success: true, complaints };
  } catch (error: any) {
    console.error('Failed to fetch admin complaints:', error);
    return { success: false, error: error.message || 'Unauthorized', complaints: [] };
  }
}

export async function updateComplaintAdmin(
  id: string,
  status: ComplaintStatus,
  adminResponse?: string
) {
  try {
    await requireRole([Role.MUNICIPAL_ADMIN]);

    const complaint = await db.complaint.findUnique({
      where: { id },
      select: { id: true, status: true, citizenId: true, category: true },
    });

    if (!complaint) return { success: false, error: 'Complaint not found' };

    if (!isValidComplaintTransition(complaint.status, status)) {
      return {
        success: false,
        error: `Cannot transition complaint from ${complaint.status} to ${status}.`,
      };
    }

    const updated = await db.complaint.update({
      where: { id },
      data: {
        status,
        ...(adminResponse?.trim() ? { adminResponse: adminResponse.trim() } : {}),
      },
    });

    // Notify citizen
    await createUserNotification(
      complaint.citizenId,
      'Complaint Status Updated',
      `Your complaint regarding "${complaint.category}" has been updated to status: ${status}.${adminResponse ? ` Admin Response: "${adminResponse.trim()}"` : ''}`,
      status === 'RESOLVED' ? 'SUCCESS' : 'INFO'
    );

    revalidatePath('/dashboard/admin/complaints');
    revalidatePath('/dashboard/citizen/complaints');

    return { success: true, complaint: updated };
  } catch (error: any) {
    console.error('Failed to update complaint:', error);
    return { success: false, error: error.message || 'Failed to update complaint' };
  }
}

export async function getAdminFeedbackData() {
  try {
    await requireRole([Role.MUNICIPAL_ADMIN]);

    const feedbackList = await db.feedback.findMany({
      include: {
        citizen: { select: { id: true, name: true, email: true, avatarUrl: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    const totalReviews = feedbackList.length;
    const avgRating =
      totalReviews > 0
        ? Math.round((feedbackList.reduce((acc, curr) => acc + curr.rating, 0) / totalReviews) * 10) / 10
        : 0;

    const ratingDistribution = {
      5: feedbackList.filter((f) => f.rating === 5).length,
      4: feedbackList.filter((f) => f.rating === 4).length,
      3: feedbackList.filter((f) => f.rating === 3).length,
      2: feedbackList.filter((f) => f.rating === 2).length,
      1: feedbackList.filter((f) => f.rating === 1).length,
    };

    return {
      success: true,
      feedback: feedbackList,
      summary: {
        totalReviews,
        avgRating,
        ratingDistribution,
      },
    };
  } catch (error: any) {
    console.error('Failed to fetch admin feedback data:', error);
    return {
      success: false,
      error: error.message || 'Unauthorized',
      feedback: [],
      summary: { totalReviews: 0, avgRating: 0, ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } },
    };
  }
}
