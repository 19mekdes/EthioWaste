import { Role } from '@prisma/client';
import { requireRole } from '@/lib/session';
import { getRecyclingDashboardStats } from '@/actions/recycling';
import { RecyclingOverview } from '@/components/recycling/RecyclingOverview';

export const metadata = {
  title: 'Recycling Organization Portal — EcoBin',
};

export default async function RecyclingDashboardPage() {
  const user = await requireRole([Role.RECYCLING_ORGANIZATION]);

  const { stats, recentRecords, org } = await getRecyclingDashboardStats();

  return (
    <RecyclingOverview
      user={{
        id: user.id,
        name: user.name || 'Recycling Organization',
        email: user.email || '',
        role: user.role,
      }}
      stats={stats}
      recentRecords={recentRecords || []}
      org={org}
    />
  );
}
