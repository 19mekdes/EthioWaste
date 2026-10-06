import { requireRole } from '@/lib/session';
import { Role } from '@prisma/client';
import { CitizenSidebar } from '@/components/citizen/CitizenSidebar';
import { getUnreadNotificationCount } from '@/actions/notifications';

export default async function CitizenDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireRole([Role.CITIZEN]);
  const countRes = await getUnreadNotificationCount();
  const unreadCount = countRes.success ? countRes.count : 0;

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <CitizenSidebar unreadNotificationsCount={unreadCount} />
      <main className="flex-1 min-w-0">{children}</main>
    </div>
  );
}
