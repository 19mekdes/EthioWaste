import { Role } from '@prisma/client';
import { requireRole } from '@/lib/session';
import { getAdminAnalytics, getCollectors, getAdminWasteReports } from '@/actions/admin';
import { AdminDashboard } from '@/components/admin/AdminDashboard';

export const metadata = {
  title: 'Municipal Control Dashboard — EcoBin',
};

export default async function AdminDashboardOverviewPage() {
  const user = await requireRole([Role.MUNICIPAL_ADMIN]);

  const [analyticsRes, reportsRes, collectorsRes] = await Promise.all([
    getAdminAnalytics(),
    getAdminWasteReports(),
    getCollectors(),
  ]);

  return (
    <AdminDashboard
      adminName={user.name || 'Admin'}
      initialData={{
        stats: analyticsRes.success ? analyticsRes.stats : {
          totalCitizens: 0,
          totalCollectors: 0,
          totalRecyclingOrgs: 0,
          totalRecyclingCenters: 0,
          totalReports: 0,
          resolvedReports: 0,
          pendingReports: 0,
          inProgressReports: 0,
          rejectedReports: 0,
          totalRequests: 0,
          pendingRequests: 0,
          approvedRequests: 0,
          assignedRequests: 0,
          activeCollections: 0,
          completedCollections: 0,
          rejectedRequests: 0,
          openComplaints: 0,
          inReviewComplaints: 0,
          resolvedComplaints: 0,
          resolutionRate: 0,
          totalPointsDistributed: 0,
        },
        reports: reportsRes.success ? reportsRes.reports : [],
        collectors: collectorsRes.success ? collectorsRes.collectors : [],
      }}
    />
  );
}
