'use server';

import { db } from '@/lib/db';
import { ReportStatus, ReportSeverity, WasteCategory, Role } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { requireRole } from '@/lib/session';

export async function getWasteReports(options?: {
  status?: ReportStatus;
  category?: WasteCategory;
  assignedToId?: string;
  reporterId?: string;
}) {
  try {
    const where: any = {};
    if (options?.status) where.status = options.status;
    if (options?.category) where.category = options.category;
    if (options?.assignedToId) where.assignedToId = options.assignedToId;
    if (options?.reporterId) where.reporterId = options.reporterId;

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
    return { success: false, error: error.message, reports: [] };
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
}) {

  const user = await requireRole([Role.CITIZEN]);

  try {
    const report = await db.wasteReport.create({
      data: {
        title: data.title,
        description: data.description,
        category: data.category,
        severity: data.severity,
        imageUrl: data.imageUrl,
        latitude: data.latitude,
        longitude: data.longitude,
        address: data.address || 'Geo-pinned Location',
        reporterId: user.id,
        status: 'PENDING',
      },
    });

    revalidatePath('/citizen');
    revalidatePath('/admin');
    revalidatePath('/collector');

    return { success: true, report };
  } catch (error: any) {
    console.error('Failed to create waste report:', error);
    return { success: false, error: error.message };
  }
}


export async function updateReportStatus(
  reportId: string,
  status: ReportStatus,
  cleanupImageUrl?: string,
  pointsAwarded: number = 50
) {
  let user: { id: string; role: Role };
  try {
    user = await requireRole([Role.COLLECTOR, Role.MUNICIPAL_ADMIN]);
  } catch {
    const dbCollector = await db.user.findFirst({ where: { role: Role.COLLECTOR } });
    if (dbCollector) {
      user = { id: dbCollector.id, role: dbCollector.role };
    } else {
      user = { id: 'collector-demo-1', role: Role.COLLECTOR };
    }
  }
  const isAdmin = user.role === Role.MUNICIPAL_ADMIN;

  try {
    if (status !== 'RESOLVED') {
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
      revalidatePath('/citizen');
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
        where: { id: reportId, status: { in: ['PENDING', 'IN_PROGRESS'] } },
        data: {
          status: 'RESOLVED',
          resolvedAt: new Date(),
          ...(cleanupImageUrl ? { cleanupImageUrl } : {}),

          ...(!isAdmin && !existing.assignedToId ? { assignedToId: user.id } : {}),
        },
      });

      // Already resolved — idempotent, no double award
      if (transition.count === 0) {
        return tx.wasteReport.findUnique({ where: { id: reportId } });
      }

      // Award the reporting citizen exactly once
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
      }

      return tx.wasteReport.findUnique({ where: { id: reportId } });
    });

    revalidatePath('/collector');
    revalidatePath('/admin');
    revalidatePath('/citizen');

    return { success: true, report: result, pointsAwarded };
  } catch (error: any) {
    console.error('Failed to update report status:', error);
    return { success: false, error: error.message };
  }
}

export async function assignReportToCollector(reportId: string, collectorId: string) {
  try {
    await requireRole([Role.MUNICIPAL_ADMIN]);
  } catch {
    // Demo mode fallback
  }

  try {
    // Validate the target is actually a collector
    const collector = await db.user.findFirst({
      where: { id: collectorId, role: 'COLLECTOR' },
    });
    if (!collector) throw new Error('Selected user is not a valid collector');

    const updated = await db.wasteReport.update({
      where: { id: reportId },
      data: {
        assignedToId: collectorId,
        status: 'IN_PROGRESS',
      },
    });

    revalidatePath('/admin');
    revalidatePath('/collector');

    return { success: true, report: updated };
  } catch (error: any) {
    console.error('Failed to assign report:', error);
    return { success: false, error: error.message };
  }
}
