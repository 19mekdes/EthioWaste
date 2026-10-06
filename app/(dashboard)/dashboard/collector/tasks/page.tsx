import { Role } from '@prisma/client';
import { requireRole } from '@/lib/session';
import { getCollectorTasks } from '@/actions/collector';
import { MyCollectorTasksList } from '@/components/collector/MyCollectorTasksList';

export const metadata = {
  title: 'My Field Tasks — Collector Portal',
};

export default async function CollectorTasksPage() {
  await requireRole([Role.COLLECTOR]);

  const { tasks } = await getCollectorTasks();

  return <MyCollectorTasksList initialTasks={tasks || []} />;
}
