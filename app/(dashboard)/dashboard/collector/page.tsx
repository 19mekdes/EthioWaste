import { Role } from '@prisma/client';
import { requireRole } from '@/lib/session';
import { getCollectorDashboardStats } from '@/actions/collector';
import { CollectorOverview } from '@/components/collector/CollectorOverview';

export const metadata = {
  title: 'Collector Operations — EcoBin',
};

export default async function CollectorDashboardPage() {
  const user = await requireRole([Role.COLLECTOR]);

  const { stats, todayTasks } = await getCollectorDashboardStats();

  return (
    <CollectorOverview
      user={{
        id: user.id,
        name: user.name || 'Collector',
        email: user.email || '',
        role: user.role,
        ecoPoints: user.ecoPoints,
        avatarUrl: user.avatarUrl || undefined,
      }}
      stats={stats}
      todayTasks={todayTasks}
    />
  );
}
