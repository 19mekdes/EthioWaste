import { Role } from '@prisma/client';
import { requireRole } from '@/lib/session';
import { getAdminRecyclingCenters } from '@/actions/admin';
import { AdminCentersPortal } from '@/components/admin/AdminCentersPortal';

export const metadata = {
  title: 'Recycling Centers Management — EcoBin Admin',
};

export default async function AdminCentersPage() {
  await requireRole([Role.MUNICIPAL_ADMIN]);

  const res = await getAdminRecyclingCenters();
  const centers = res.success ? res.centers : [];

  return <AdminCentersPortal initialCenters={centers} />;
}
