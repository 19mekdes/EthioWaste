import { Role } from '@prisma/client';
import { requireRole } from '@/lib/session';
import { getAdminRecyclingOrgs } from '@/actions/admin';
import { AdminRecyclingOrgsPortal } from '@/components/admin/AdminRecyclingOrgsPortal';

export const metadata = {
  title: 'Recycling Organizations — EcoBin Admin',
};

export default async function AdminRecyclingOrgsPage() {
  await requireRole([Role.MUNICIPAL_ADMIN]);

  const res = await getAdminRecyclingOrgs();
  const orgs = res.success ? res.orgs : [];

  return <AdminRecyclingOrgsPortal initialOrgs={orgs} />;
}
