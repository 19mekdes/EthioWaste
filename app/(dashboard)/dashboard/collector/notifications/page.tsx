import { Role } from '@prisma/client';
import { requireRole } from '@/lib/session';
import { getNotifications } from '@/actions/notifications';
import { CollectorNotificationsFeed } from '@/components/collector/CollectorNotificationsFeed';

export const metadata = {
  title: 'Notifications — Collector Portal',
};

export default async function CollectorNotificationsPage() {
  await requireRole([Role.COLLECTOR]);

  const { notifications, unreadCount } = await getNotifications();

  return (
    <CollectorNotificationsFeed
      notifications={notifications || []}
      unreadCount={unreadCount || 0}
    />
  );
}
