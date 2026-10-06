import { Role } from '@prisma/client';
import { requireRole } from '@/lib/session';
import { getNotifications } from '@/actions/notifications';
import { RecyclingNotificationsFeed } from '@/components/recycling/RecyclingNotificationsFeed';

export const metadata = {
  title: 'Notifications — Recycling Portal',
};

export default async function RecyclingNotificationsPage() {
  await requireRole([Role.RECYCLING_ORGANIZATION]);

  const { notifications, unreadCount } = await getNotifications();

  return (
    <RecyclingNotificationsFeed
      notifications={notifications || []}
      unreadCount={unreadCount || 0}
    />
  );
}
