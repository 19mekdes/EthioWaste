'use server';

import { db } from '@/lib/db';
import { ReportStatus, ReportSeverity, WasteCategory, Role } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { requireRole, requireUser } from '@/lib/session';
import { createUserNotification } from '@/actions/notifications';

export async function getWasteReports(options?: {
  status?: ReportStatus;
  category?: WasteCategory;
  assignedToId?: string;
  reporterId?: string;
}) {
  try {
    const user = await requireUser();
    const where: any = {};

    if (options?.status) where.status = options.status;
    if (options?.category) where.category = options.category;

    // RBAC Scoping
    if (user.role === Role.CITIZEN) {
      where.reporterId = user.id; // Force ownership to session user
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

    return { success: true, reports };
  } catch (error: any) {
    console.error('Failed to fetch reports:', error);
    return { success: false, error: error.message || 'Unauthorized', reports: [] };
  }
}

export async function getWasteReportById(id: string) {
  try {
    const user = await requireUser();

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
      return { success: false, error: 'Report not found', report: null };
    }

    if (user.role === Role.CITIZEN && report.reporterId !== user.id) {
      return { success: false, error: 'Report not found', report: null };
    }

    return { success: true, report };
  } catch (error: any) {
    console.error('Failed to fetch report detail:', error);
    return { success: false, error: error.message || 'Error loading report details', report: null };
  }
}

export async function createWasteReport(data: {
  title: string;
  description: string;
  category: WasteCategory;
  severity: ReportSeverity;
  imageUrl: string;
  latitude: number;
  longitude: number;
  address?: string;
  isIllegalDumping?: boolean;
}) {
  const user = await requireRole([Role.CITIZEN]);

  try {
    if (!data.title || !data.title.trim()) {
      return { success: false, error: 'Title is required.' };
    }
    if (!data.description || !data.description.trim()) {
      return { success: false, error: 'Description is required.' };
    }

    const report = await db.wasteReport.create({
      data: {
        title: data.title.trim(),
        description: data.description.trim(),
        category: data.category || WasteCategory.MIXED,
        severity: data.severity || ReportSeverity.MEDIUM,
        imageUrl: data.imageUrl || 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=600&q=80',
        latitude: data.latitude ?? 9.0300,
        longitude: data.longitude ?? 38.7400,
        address: data.address?.trim() || 'Geo-pinned Location',
        isIllegalDumping: !!data.isIllegalDumping,
        reporterId: user.id, // Strictly derived from session
        status: 'PENDING',
      },
    });

    // Create Notification confirming submission
    const notificationTitle = data.isIllegalDumping ? 'Illegal Dumping Report Submitted' : 'Waste Report Submitted';
    const notificationMsg = `Your ${data.isIllegalDumping ? 'illegal dumping' : 'waste'} report "${data.title}" has been submitted successfully. Status: PENDING`;
    await createUserNotification(user.id, notificationTitle, notificationMsg, 'SUCCESS');

    revalidatePath('/dashboard/citizen');
    revalidatePath('/dashboard/citizen/reports');
    revalidatePath('/admin');
    revalidatePath('/collector');

    return { success: true, report };
  } catch (error: any) {
    console.error('Failed to create waste report:', error);
    return { success: false, error: error.message || 'Failed to create waste report' };
  }
}

export async function updateReportStatus(
  reportId: string,
  status: ReportStatus,
  cleanupImageUrl?: string,
  pointsAwarded: number = 50
) {
  const user = await requireRole([Role.COLLECTOR, Role.MUNICIPAL_ADMIN]);
  const isAdmin = user.role === Role.MUNICIPAL_ADMIN;

  try {
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

      revalidatePath('/collector');
      revalidatePath('/admin');
      revalidatePath('/dashboard/citizen');
      revalidatePath('/dashboard/citizen/reports');
      return { success: true, report: updated };
    }

    const result = await db.$transaction(async (tx) => {
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

        // Send notification to reporter
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

    revalidatePath('/collector');
    revalidatePath('/admin');
    revalidatePath('/dashboard/citizen');
    revalidatePath('/dashboard/citizen/reports');

    return { success: true, report: result, pointsAwarded };
  } catch (error: any) {
    console.error('Failed to update report status:', error);
    return { success: false, error: error.message || 'Failed to update report status' };
  }
}

export async function assignReportToCollector(reportId: string, collectorId: string) {
  await requireRole([Role.MUNICIPAL_ADMIN]);

  try {
    const collector = await db.user.findFirst({
      where: { id: collectorId, role: Role.COLLECTOR },
    });
    if (!collector) throw new Error('Selected user is not a valid collector');

    const updated = await db.wasteReport.update({
      where: { id: reportId },
      data: {
        assignedToId: collectorId,
        status: 'ASSIGNED',
      },
    });

    revalidatePath('/admin');
    revalidatePath('/collector');
    revalidatePath('/dashboard/citizen');
    revalidatePath('/dashboard/citizen/reports');

    return { success: true, report: updated };
  } catch (error: any) {
    console.error('Failed to assign report:', error);
    return { success: false, error: error.message || 'Failed to assign report' };
  }
}
