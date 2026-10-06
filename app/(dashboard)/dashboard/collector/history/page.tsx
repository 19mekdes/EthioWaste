import { Role } from '@prisma/client';
import { requireRole } from '@/lib/session';
import { getCollectorTaskHistory } from '@/actions/collector';
import { CollectorTaskHistory } from '@/components/collector/CollectorTaskHistory';

export const metadata = {
  title: 'Collection History — Collector Portal',
};

export default async function CollectorHistoryPage() {
  await requireRole([Role.COLLECTOR]);

  const { tasks } = await getCollectorTaskHistory();

  return <CollectorTaskHistory initialTasks={tasks || []} />;
}
