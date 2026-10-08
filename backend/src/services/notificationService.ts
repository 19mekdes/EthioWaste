import { db } from '../db.js';
import { NotificationType } from '@prisma/client';

export async function getUserNotifications(userId: string) {
  const notifications = await db.notification.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });

  const unreadCount = notifications.filter((n: any) => !n.isRead).length;

  return { notifications, unreadCount };
}

export async function markNotificationAsRead(id: string, userId: string) {
  const notification = await db.notification.findUnique({
    where: { id },
  });

  if (!notification) throw new Error('Notification not found');
  if (notification.userId !== userId) throw new Error('Unauthorized');

  const updated = await db.notification.update({
    where: { id },
    data: { isRead: true },
  });

  return updated;
}

export async function markAllNotificationsAsRead(userId: string) {
  await db.notification.updateMany({
    where: { userId, isRead: false },
    data: { isRead: true },
  });

  return { success: true };
}

export async function createNotification(
  userId: string,
  title: string,
  message: string,
  type: NotificationType = 'INFO'
) {
  const notification = await db.notification.create({
    data: {
      userId,
      title,
      message,
      type,
    },
  });

  return notification;
}
