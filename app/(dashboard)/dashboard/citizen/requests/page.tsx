import { Role } from '@prisma/client';
import { requireRole } from '@/lib/session';
import { getCollectionRequests } from '@/actions/collection-requests';
import { MyCollectionRequestsList } from '@/components/citizen/MyCollectionRequestsList';

export const metadata = {
  title: 'My Collection Requests — EcoBin',
};

export default async function MyCollectionRequestsPage() {
  await requireRole([Role.CITIZEN]);

  const res = await getCollectionRequests();
  const requests = res.success ? res.requests : [];

  return <MyCollectionRequestsList initialRequests={requests} />;
}
