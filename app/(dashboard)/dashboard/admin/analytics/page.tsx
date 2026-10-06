import { Role } from '@prisma/client';
import { requireRole } from '@/lib/session';
import {
  getAdminAnalytics,
  getAdminWasteReports,
  getAdminCollectionRequests,
  getAdminComplaints,
  getAdminFeedbackData,
} from '@/actions/admin';
import { AdminReportsAnalyticsPortal } from '@/components/admin/AdminReportsAnalyticsPortal';

export const metadata = {
  title: 'Reports & Analytics — EcoBin Admin',
};

export default async function AdminAnalyticsPage() {
  await requireRole([Role.MUNICIPAL_ADMIN]);

  const [analyticsRes, reportsRes, requestsRes, complaintsRes, feedbackRes] = await Promise.all([
    getAdminAnalytics(),
    getAdminWasteReports(),
    getAdminCollectionRequests(),
    getAdminComplaints(),
    getAdminFeedbackData(),
  ]);

  const reports = reportsRes.success ? reportsRes.reports : [];
  const requests = requestsRes.success ? requestsRes.requests : [];
  const complaints = complaintsRes.success ? complaintsRes.complaints : [];
  const feedbackSummary = feedbackRes.success ? feedbackRes.summary : { totalReviews: 0, avgRating: 0, ratingDistribution: {} };

  // Calculate report category breakdown
  const reportCategoryBreakdown: Record<string, number> = {};
  reports.forEach((r: any) => {
    reportCategoryBreakdown[r.category] = (reportCategoryBreakdown[r.category] || 0) + 1;
  });

  // Calculate report status breakdown
  const reportStatusBreakdown: Record<string, number> = {};
  reports.forEach((r: any) => {
    reportStatusBreakdown[r.status] = (reportStatusBreakdown[r.status] || 0) + 1;
  });

  // Calculate request status breakdown
  const requestStatusBreakdown: Record<string, number> = {};
  requests.forEach((req: any) => {
    requestStatusBreakdown[req.status] = (requestStatusBreakdown[req.status] || 0) + 1;
  });

  // Calculate complaint status breakdown
  const complaintStatusBreakdown: Record<string, number> = {};
  complaints.forEach((c: any) => {
    complaintStatusBreakdown[c.status] = (complaintStatusBreakdown[c.status] || 0) + 1;
  });

  return (
    <AdminReportsAnalyticsPortal
      analytics={{
        stats: analyticsRes.success ? analyticsRes.stats : {},
        reportCategoryBreakdown,
        reportStatusBreakdown,
        requestStatusBreakdown,
        complaintStatusBreakdown,
        feedbackSummary,
      }}
    />
  );
}
