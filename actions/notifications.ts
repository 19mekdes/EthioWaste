'use server';

import { db } from '@/lib/db';
import { NotificationType, Role } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { requireUser } from '@/lib/session';

export async function getNotifications() {
  try {
    const user = await requireUser();

    const notifications = await db.notification.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    });

    const unreadCount = notifications.filter((n) => !n.isRead).length;

    return { success: true, notifications, unreadCount };
  } catch (error: any) {
    console.error('Failed to fetch notifications:', error);
    return { success: false, error: error.message || 'Unauthorized', notifications: [], unreadCount: 0 };
  }
}

export async function markNotificationAsRead(id: string) {
  try {
    const user = await requireUser();

    const notification = await db.notification.findUnique({
      where: { id },
    });

    if (!notification) {
      return { success: false, error: 'Notification not found' };
    }

    if (notification.userId !== user.id) {
      return { success: false, error: 'Unauthorized to update this notification' };
    }

    const updated = await db.notification.update({
      where: { id },
      data: { isRead: true },
    });

    revalidatePath('/dashboard/citizen/notifications');
    revalidatePath('/dashboard/citizen');
    revalidatePath('/dashboard/collector/notifications');
    revalidatePath('/dashboard/collector');
    revalidatePath('/dashboard/recycling/notifications');
    revalidatePath('/dashboard/recycling');
    return { success: true, notification: updated };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to update notification' };
  }
}

export async function markAllNotificationsAsRead() {
  try {
    const user = await requireUser();

    await db.notification.updateMany({
      where: { userId: user.id, isRead: false },
      data: { isRead: true },
    });

    revalidatePath('/dashboard/citizen/notifications');
    revalidatePath('/dashboard/citizen');
    revalidatePath('/dashboard/collector/notifications');
    revalidatePath('/dashboard/collector');
    revalidatePath('/dashboard/recycling/notifications');
    revalidatePath('/dashboard/recycling');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to update notifications' };
  }
}

export async function getUnreadNotificationCount() {
  try {
    const user = await requireUser();

    const count = await db.notification.count({
      where: { userId: user.id, isRead: false },
    });

    return { success: true, count };
  } catch (error: any) {
    return { success: false, count: 0 };
  }
}

export async function createUserNotification(
  userId: string,
  title: string,
  message: string,
  type: NotificationType = 'INFO'
) {
  try {
    const notification = await db.notification.create({
      data: {
        userId,
        title,
        message,
        type,
      },
    });
    return { success: true, notification };
  } catch (error: any) {
    console.error('Failed to create notification:', error);
    return { success: false, error: error.message };
  }
}
