import { Role } from '@prisma/client';
import { requireRole } from '@/lib/session';
import { getAdminUsers } from '@/actions/admin';
import { AdminUsersPortal } from '@/components/admin/AdminUsersPortal';

export const metadata = {
  title: 'User Management — EcoBin Admin',
};

export default async function AdminUsersPage() {
  await requireRole([Role.MUNICIPAL_ADMIN]);

  const res = await getAdminUsers();
  const users = res.success ? res.users : [];

  return <AdminUsersPortal initialUsers={users} />;
}
