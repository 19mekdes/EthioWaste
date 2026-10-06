import { Role } from '@prisma/client';
import { requireRole } from '@/lib/session';
import { getRecyclingHistory } from '@/actions/recycling';
import { RecyclingHistory } from '@/components/recycling/RecyclingHistory';

export const metadata = {
  title: 'Processing History — Recycling Portal',
};

export default async function RecyclingHistoryPage() {
  await requireRole([Role.RECYCLING_ORGANIZATION]);

  const { records } = await getRecyclingHistory();

  return <RecyclingHistory initialRecords={records || []} />;
}
