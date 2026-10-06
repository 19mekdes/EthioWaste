import { requireRole } from '@/lib/session';
import { Role } from '@prisma/client';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireRole([Role.MUNICIPAL_ADMIN]);

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <AdminSidebar />
      <main className="flex-1 min-w-0">{children}</main>
    </div>
  );
}
