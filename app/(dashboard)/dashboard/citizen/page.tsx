import { Role } from '@prisma/client';
import { requireRole } from '@/lib/session';
import { getCitizenDashboardStats } from '@/actions/citizen';
import { CitizenOverview } from '@/components/citizen/CitizenOverview';

export const metadata = {
  title: 'Citizen Overview — EcoBin',
};

export default async function CitizenDashboardOverviewPage() {
  const user = await requireRole([Role.CITIZEN]);

  const { stats, recentNotifications, recentReports, recentRequests } =
    await getCitizenDashboardStats();

  return (
    <CitizenOverview
      user={{
        id: user.id,
        name: user.name || 'Citizen',
        email: user.email || '',
        role: user.role,
        ecoPoints: user.ecoPoints,
        avatarUrl: user.avatarUrl || undefined,
      }}
      stats={stats}
      recentNotifications={recentNotifications}
      recentReports={recentReports}
      recentRequests={recentRequests}
    />
  );
}
