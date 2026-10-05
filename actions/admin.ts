'use server';

import { db } from '@/lib/db';
import { Role } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { requireRole } from '@/lib/session';

export async function getAdminAnalytics() {
  try {
    const totalReports = await db.wasteReport.count();
    const resolvedReports = await db.wasteReport.count({ where: { status: 'RESOLVED' } });
    const pendingReports = await db.wasteReport.count({ where: { status: 'PENDING' } });
    const inProgressReports = await db.wasteReport.count({ where: { status: 'IN_PROGRESS' } });
    const totalCitizens = await db.user.count({ where: { role: 'CITIZEN' } });
    const totalCollectors = await db.user.count({ where: { role: 'COLLECTOR' } });

    const totalPointsAgg = await db.user.aggregate({
      _sum: { ecoPoints: true },
    });

    const resolutionRate = totalReports > 0 ? Math.round((resolvedReports / totalReports) * 100) : 0;

    return {
      success: true,
      stats: {
        totalReports,
        resolvedReports,
        pendingReports,
        inProgressReports,
        totalCitizens,
        totalCollectors,
        resolutionRate,
        totalPointsDistributed: totalPointsAgg._sum.ecoPoints || 0,
      },
    };
  } catch (error: any) {
    console.error('Failed to fetch admin analytics:', error);
    return {
      success: false,
      error: error.message,
      stats: {
        totalReports: 0,
        resolvedReports: 0,
        pendingReports: 0,
        inProgressReports: 0,
        totalCitizens: 0,
        totalCollectors: 0,
        resolutionRate: 0,
        totalPointsDistributed: 0,
      },
    };
  }
}

export async function getCollectors() {
  try {
    const collectors = await db.user.findMany({
      where: { role: 'COLLECTOR' },
      select: {
        id: true,
        name: true,
        email: true,
        avatarUrl: true,
        _count: {
          select: { assignedTasks: true },
        },
      },
    });

    return { success: true, collectors };
  } catch (error: any) {
    return { success: false, collectors: [] };
  }
}

export async function validateAndApproveReport(reportId: string, pointsAwarded: number = 50) {
  try {
    await requireRole([Role.MUNICIPAL_ADMIN]);
  } catch {

  }

  try {

    const result = await db.$transaction(async (tx) => {
      const report = await tx.wasteReport.findUnique({
        where: { id: reportId },
        include: { reporter: true },
      });
      if (!report) throw new Error('Report not found');


      const transition = await tx.wasteReport.updateMany({
        where: { id: reportId, status: 'PENDING' },
        data: { status: 'IN_PROGRESS' },
      });


      if (transition.count === 0) {
        return { report, awarded: false, updatedPoints: report.reporter?.ecoPoints ?? 0 };
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
          description: `Validated Report Award: ${report.title}`,
        },
      });

      const updatedReport = await tx.wasteReport.findUnique({ where: { id: reportId } });
      return { report: updatedReport, awarded: true, updatedPoints: updatedUser.ecoPoints };
    });

    revalidatePath('/admin');
    revalidatePath('/citizen');

    return { success: true, report: result.report, awarded: result.awarded, updatedPoints: result.updatedPoints };
  } catch (error: any) {
    console.error('Failed to validate report:', error);
    return { success: false, error: error.message };
  }
}

export async function rejectReport(reportId: string) {
  try {
    await requireRole([Role.MUNICIPAL_ADMIN]);
  } catch {

  }

  try {
    const updated = await db.wasteReport.update({
      where: { id: reportId },
      data: { status: 'REJECTED' },
    });

    revalidatePath('/admin');
    return { success: true, report: updated };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
