import { Role } from '@prisma/client';
import { requireRole } from '@/lib/session';
import { getRecyclingRecords } from '@/actions/recycling';
import { RecyclingRecordsList } from '@/components/recycling/RecyclingRecordsList';

export const metadata = {
  title: 'Recycling Records — Facility Portal',
};

export default async function RecyclingRecordsPage() {
  await requireRole([Role.RECYCLING_ORGANIZATION]);

  const { records } = await getRecyclingRecords();

  return <RecyclingRecordsList initialRecords={records || []} />;
}
