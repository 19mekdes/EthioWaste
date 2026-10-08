import { db } from '../db.js';
import { ReportStatus, ReportSeverity, WasteCategory, Role } from '@prisma/client';
import { createNotification } from './notificationService.js';
import { UserPayload } from '../types/index.js';

export async function getWasteReports(
  user: UserPayload,
  options?: {
    status?: ReportStatus;
    category?: WasteCategory;
    assignedToId?: string;
    reporterId?: string;
  }
) {
  const where: any = {};

  if (options?.status) where.status = options.status;
  if (options?.category) where.category = options.category;

  if (user.role === Role.CITIZEN) {
    where.reporterId = user.id;
  } else if (user.role === Role.COLLECTOR) {
    if (options?.assignedToId) {
      where.assignedToId = options.assignedToId;
    } else {
      where.OR = [{ assignedToId: user.id }, { assignedToId: null }];
    }
  } else if (user.role === Role.MUNICIPAL_ADMIN) {
    if (options?.assignedToId) where.assignedToId = options.assignedToId;
    if (options?.reporterId) where.reporterId = options.reporterId;
  }

  const reports = await db.wasteReport.findMany({
    where,
    include: {
      reporter: {
        select: { id: true, name: true, email: true, avatarUrl: true },
      },
      assignedTo: {
        select: { id: true, name: true, email: true, avatarUrl: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return reports;
}

export async function getWasteReportById(id: string, user: UserPayload) {
  const report = await db.wasteReport.findUnique({
    where: { id },
    include: {
      reporter: {
        select: { id: true, name: true, email: true, avatarUrl: true },
      },
      assignedTo: {
        select: { id: true, name: true, email: true, avatarUrl: true },
      },
    },
  });

  if (!report) {
    throw new Error('Report not found');
  }

  if (user.role === Role.CITIZEN && report.reporterId !== user.id) {
    throw new Error('Report not found');
  }

  return report;
}

export async function createWasteReport(
  user: UserPayload,
  data: {
    title: string;
    description: string;
    category: WasteCategory;
    severity: ReportSeverity;
    imageUrl: string;
    latitude: number;
    longitude: number;
    address?: string;
    isIllegalDumping?: boolean;
  }
) {
  if (!data.title || !data.title.trim()) {
    throw new Error('Title is required');
  }
  if (!data.description || !data.description.trim()) {
    throw new Error('Description is required');
  }

  const report = await db.wasteReport.create({
    data: {
      title: data.title.trim(),
      description: data.description.trim(),
      category: data.category || WasteCategory.MIXED,
      severity: data.severity || ReportSeverity.MEDIUM,
      imageUrl: data.imageUrl || 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=600&q=80',
      latitude: data.latitude ?? 8.9806,
      longitude: data.longitude ?? 38.7578,
      address: data.address?.trim() || 'Geo-pinned Location (Addis Ababa)',
      isIllegalDumping: !!data.isIllegalDumping,
      reporterId: user.id,
      status: ReportStatus.PENDING,
    },
  });

  const notificationTitle = data.isIllegalDumping ? 'Illegal Dumping Report Submitted' : 'Waste Report Submitted';
  const notificationMsg = `Your ${data.isIllegalDumping ? 'illegal dumping' : 'waste'} report "${data.title}" has been submitted successfully. Status: PENDING`;
  await createNotification(user.id, notificationTitle, notificationMsg, 'SUCCESS');

  return report;
}

export async function updateReportStatus(
  reportId: string,
  user: UserPayload,
  status: ReportStatus,
  cleanupImageUrl?: string,
  pointsAwarded: number = 50
) {
  const isAdmin = user.role === Role.MUNICIPAL_ADMIN;

  if (status !== 'COMPLETED') {
    const report = await db.wasteReport.findUnique({
      where: { id: reportId },
      select: { assignedToId: true, status: true },
    });
    if (!report) throw new Error('Report not found');

    if (report.status === 'REJECTED') {
      throw new Error('This report was rejected and cannot be reopened.');
    }

    if (!isAdmin && report.assignedToId && report.assignedToId !== user.id) {
      throw new Error('This task is assigned to another collector.');
    }

    const updated = await db.wasteReport.update({
      where: { id: reportId },
      data: {
        status,
        ...(!isAdmin && status === 'IN_PROGRESS' && !report.assignedToId
          ? { assignedToId: user.id }
          : {}),
      },
    });

    return updated;
  }

  const result = await db.$transaction(async (tx: any) => {
    const existing = await tx.wasteReport.findUnique({
      where: { id: reportId },
      select: { id: true, status: true, assignedToId: true, reporterId: true, title: true },
    });

    if (!existing) throw new Error('Report not found');

    if (existing.status === 'REJECTED') {
      throw new Error('This report was rejected and cannot be reopened.');
    }

    if (!isAdmin && existing.assignedToId && existing.assignedToId !== user.id) {
      throw new Error('This task is assigned to another collector.');
    }

    const transition = await tx.wasteReport.updateMany({
      where: { id: reportId, status: { in: ['PENDING', 'VERIFIED', 'ASSIGNED', 'IN_PROGRESS'] } },
      data: {
        status: 'COMPLETED',
        resolvedAt: new Date(),
        ...(cleanupImageUrl ? { cleanupImageUrl } : {}),
        ...(!isAdmin && !existing.assignedToId ? { assignedToId: user.id } : {}),
      },
    });

    if (transition.count === 0) {
      return tx.wasteReport.findUnique({ where: { id: reportId } });
    }

    if (existing.reporterId) {
      await tx.user.update({
        where: { id: existing.reporterId },
        data: { ecoPoints: { increment: pointsAwarded } },
      });
      await tx.rewardTransaction.create({
        data: {
          userId: existing.reporterId,
          amount: pointsAwarded,
          type: 'EARNED',
          description: `Cleanup Resolution Bonus: ${existing.title}`,
        },
      });

      await tx.notification.create({
        data: {
          userId: existing.reporterId,
          title: 'Waste Report Resolved!',
          message: `Your report "${existing.title}" has been resolved. You earned ${pointsAwarded} Eco-Points!`,
          type: 'SUCCESS',
        },
      });
    }

    return tx.wasteReport.findUnique({ where: { id: reportId } });
  });

  return result;
}
