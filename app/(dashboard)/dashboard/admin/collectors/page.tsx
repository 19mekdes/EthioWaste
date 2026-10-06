import { Role } from '@prisma/client';
import { requireRole } from '@/lib/session';
import { getCollectors } from '@/actions/admin';
import { AdminCollectorsPortal } from '@/components/admin/AdminCollectorsPortal';

export const metadata = {
  title: 'Collectors Roster — EcoBin Admin',
};

export default async function AdminCollectorsPage() {
  await requireRole([Role.MUNICIPAL_ADMIN]);

  const res = await getCollectors();
  const collectors = res.success ? res.collectors : [];

  return <AdminCollectorsPortal initialCollectors={collectors} />;
}
