import { Role } from '@prisma/client';
import { requireRole } from '@/lib/session';
import { getNotifications } from '@/actions/notifications';
import { CitizenNotificationsFeed } from '@/components/citizen/CitizenNotificationsFeed';

export const metadata = {
  title: 'Notifications Feed — EcoBin',
};

export default async function CitizenNotificationsPage() {
  await requireRole([Role.CITIZEN]);

  const res = await getNotifications();
  const notifications = res.success ? res.notifications : [];
  const unreadCount = res.success ? res.unreadCount : 0;

  return (
    <CitizenNotificationsFeed
      initialNotifications={notifications}
      initialUnreadCount={unreadCount}
    />
  );
}
