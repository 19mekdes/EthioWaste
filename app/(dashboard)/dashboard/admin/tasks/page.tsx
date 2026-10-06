import { Role } from '@prisma/client';
import { requireRole } from '@/lib/session';
import { getAdminCollectionTasks } from '@/actions/admin';
import { AdminCollectionTasksPortal } from '@/components/admin/AdminCollectionTasksPortal';

export const metadata = {
  title: 'Collection Tasks — EcoBin Admin',
};

export default async function AdminCollectionTasksPage() {
  await requireRole([Role.MUNICIPAL_ADMIN]);

  const res = await getAdminCollectionTasks();
  const tasks = res.success ? res.tasks : [];

  return <AdminCollectionTasksPortal initialTasks={tasks} />;
}
