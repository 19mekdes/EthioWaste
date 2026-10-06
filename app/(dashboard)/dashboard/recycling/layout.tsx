import { Role } from '@prisma/client';
import { requireRole } from '@/lib/session';
import { RecyclingSidebar } from '@/components/recycling/RecyclingSidebar';
import { getUnreadNotificationCount } from '@/actions/notifications';

export default async function RecyclingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireRole([Role.RECYCLING_ORGANIZATION]);

  const { count } = await getUnreadNotificationCount();

  return (
    <div className="flex flex-col md:flex-row gap-6 p-4 md:p-6 min-h-[calc(100vh-4rem)]">
      <RecyclingSidebar unreadNotificationsCount={count || 0} />
      <main className="flex-1 min-w-0">{children}</main>
    </div>
  );
}
