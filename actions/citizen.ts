'use server';

import { db } from '@/lib/db';
import { CollectionRequestStatus, ReportStatus, Role } from '@prisma/client';
import { requireRole } from '@/lib/session';

export async function getCitizenDashboardStats() {
  const user = await requireRole([Role.CITIZEN]);

  try {
    const userId = user.id;

    const [
      totalReports,
      pendingReports,
      activeCollectionRequests,
      completedCollectionRequests,
      completedWasteReports,
      recentNotifications,
      recentReports,
      recentRequests,
      unreadNotificationsCount,
    ] = await Promise.all([
      db.wasteReport.count({
        where: { reporterId: userId },
      }),
      db.wasteReport.count({
        where: { reporterId: userId, status: ReportStatus.PENDING },
      }),
      db.collectionRequest.count({
        where: {
          citizenId: userId,
          status: {
            in: [
              CollectionRequestStatus.PENDING,
              CollectionRequestStatus.APPROVED,
              CollectionRequestStatus.ASSIGNED,
              CollectionRequestStatus.IN_PROGRESS,
            ],
          },
        },
      }),
      db.collectionRequest.count({
        where: { citizenId: userId, status: CollectionRequestStatus.COMPLETED },
      }),
      db.wasteReport.count({
        where: { reporterId: userId, status: ReportStatus.COMPLETED },
      }),
      db.notification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
      db.wasteReport.findMany({
        where: { reporterId: userId },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
      db.collectionRequest.findMany({
        where: { citizenId: userId },
        include: {
          assignedCollector: {
            select: { id: true, name: true, phone: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
      db.notification.count({
        where: { userId, isRead: false },
      }),
    ]);

    const totalCompleted = completedCollectionRequests + completedWasteReports;

    return {
      success: true,
      stats: {
        totalReports,
        pendingReports,
        activeCollectionRequests,
        completedCollections: totalCompleted,
        unreadNotificationsCount,
      },
      recentNotifications,
      recentReports,
      recentRequests,
    };
  } catch (error: any) {
    console.error('Failed to load citizen dashboard stats:', error);
    return {
      success: false,
      error: error.message || 'Failed to load dashboard data',
      stats: {
        totalReports: 0,
        pendingReports: 0,
        activeCollectionRequests: 0,
        completedCollections: 0,
        unreadNotificationsCount: 0,
      },
      recentNotifications: [],
      recentReports: [],
      recentRequests: [],
    };
  }
}
