import { db } from '../db.js';
import { CollectionRequestStatus, ReportStatus } from '@prisma/client';

export async function getCitizenDashboardStats(userId: string) {
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
}
