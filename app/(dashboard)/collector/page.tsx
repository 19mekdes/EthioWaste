
import { Role } from '@prisma/client';
import { Suspense } from 'react';
import { requireRole } from '@/lib/session';
import { getWasteReports } from '@/actions/reports';
import { CollectorDashboard, CollectorDashboardSkeleton } from '@/components/collector/CollectorDashboard';

export const metadata = {
  title: 'Field Collector Route — EcoBin',
};

export default async function CollectorDashboardPage() {
  const user = await requireRole([Role.COLLECTOR]);

  const reportsRes = await getWasteReports();
  const tasks = reportsRes.success
    ? reportsRes.reports.filter((r: any) => !r.assignedToId || r.assignedToId === user.id)
    : [];

  return (
    <Suspense fallback={<CollectorDashboardSkeleton />}>
      <CollectorDashboard
        collectorName={user.name || 'Marcus Vance'}
        initialTasks={tasks}
      />
    </Suspense>
  );
}

