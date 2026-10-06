import { Role } from '@prisma/client';
import { requireRole } from '@/lib/session';
import { getCollectorTaskById } from '@/actions/collector';
import { CollectorTaskExecution } from '@/components/collector/CollectorTaskExecution';
import { notFound } from 'next/navigation';

export const metadata = {
  title: 'Task Execution — Collector Portal',
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function CollectorTaskDetailPage({ params }: PageProps) {
  await requireRole([Role.COLLECTOR]);
  const { id } = await params;

  const { success, task } = await getCollectorTaskById(id);

  if (!success || !task) {
    notFound();
  }

  return <CollectorTaskExecution task={task} />;
}
