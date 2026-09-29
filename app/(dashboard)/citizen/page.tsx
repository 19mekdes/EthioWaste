import { Role } from '@prisma/client';
import { requireRole } from '@/lib/session';
import { getWasteReports } from '@/actions/reports';
import { getRecyclingCenters } from '@/actions/centers';
import { getRewardsLeaderboard, getUserTransactions } from '@/actions/rewards';
import { CitizenHub, CitizenHubSkeleton } from '@/components/citizen/CitizenHub';
import { Suspense } from 'react';

export const metadata = {
  title: 'Citizen Dashboard — EcoBin',
};

export default async function CitizenDashboardPage() {
  const user = await requireRole([Role.CITIZEN]);

  const [reportsRes, centersRes, leaderboardRes, txRes] = await Promise.all([
    getWasteReports(),
    getRecyclingCenters(),
    getRewardsLeaderboard(),
    getUserTransactions(),
  ]);

  return (
    <Suspense fallback={<CitizenHubSkeleton />}>
      <CitizenHub
        user={{
          id: user.id,
          name: user.name || 'Citizen',
          email: user.email || '',
          role: user.role,
          ecoPoints: user.ecoPoints,
          avatarUrl: user.avatarUrl || undefined,
        }}
        initialData={{
          reports: reportsRes.success ? reportsRes.reports : [],
          centers: centersRes.success ? centersRes.centers : [],
          leaderboard: leaderboardRes.success ? leaderboardRes.leaderboard : [],
          transactions: txRes.success ? txRes.transactions : [],
          points: txRes.success ? txRes.points : user.ecoPoints,
        }}
      />
    </Suspense>
  );
}
