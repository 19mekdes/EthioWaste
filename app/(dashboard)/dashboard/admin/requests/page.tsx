import { Role } from '@prisma/client';
import { requireRole } from '@/lib/session';
import { getAdminCollectionRequests, getCollectors } from '@/actions/admin';
import { AdminCollectionRequestsPortal } from '@/components/admin/AdminCollectionRequestsPortal';

export const metadata = {
  title: 'Collection Requests & Dispatch — EcoBin Admin',
};

export default async function AdminCollectionRequestsPage() {
  await requireRole([Role.MUNICIPAL_ADMIN]);

  const [requestsRes, collectorsRes] = await Promise.all([
    getAdminCollectionRequests(),
    getCollectors(),
  ]);

  const requests = requestsRes.success ? requestsRes.requests : [];
  const collectors = collectorsRes.success ? collectorsRes.collectors : [];

  return <AdminCollectionRequestsPortal initialRequests={requests} collectors={collectors} />;
}
