import { Role } from '@prisma/client';
import { Suspense } from 'react';
import { requireRole } from '@/lib/session';
import { getAdminAnalytics, getCollectors } from '@/actions/admin';
import { getWasteReports } from '@/actions/reports';
import { AdminDashboard, AdminDashboardSkeleton } from '@/components/admin/AdminDashboard';

export const metadata = {
  title: 'Municipal Admin — EcoBin',
};

export default async function AdminDashboardPage() {
  const user = await requireRole([Role.MUNICIPAL_ADMIN]);

  const [analyticsRes, reportsRes, collectorsRes] = await Promise.all([
    getAdminAnalytics(),
    getWasteReports(),
    getCollectors(),
  ]);

  return (
    <Suspense fallback={<AdminDashboardSkeleton />}>
      <AdminDashboard
        adminName={user.name || 'Admin'}
        initialData={{
          stats: analyticsRes.success ? analyticsRes.stats : {
            totalReports: 0,
            resolvedReports: 0,
            pendingReports: 0,
            inProgressReports: 0,
            totalCitizens: 0,
            totalCollectors: 0,
            resolutionRate: 0,
            totalPointsDistributed: 0,
          },
          reports: reportsRes.success ? reportsRes.reports : [],
          collectors: collectorsRes.success ? collectorsRes.collectors : [],
        }}
      />
    </Suspense>
  );
}
