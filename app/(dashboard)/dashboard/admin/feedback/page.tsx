import { Role } from '@prisma/client';
import { requireRole } from '@/lib/session';
import { getAdminFeedbackData } from '@/actions/admin';
import { AdminFeedbackPortal } from '@/components/admin/AdminFeedbackPortal';

export const metadata = {
  title: 'Citizen Feedback — EcoBin Admin',
};

export default async function AdminFeedbackPage() {
  await requireRole([Role.MUNICIPAL_ADMIN]);

  const res = await getAdminFeedbackData();
  const feedbackList = res.success ? res.feedback : [];
  const summary = res.success ? res.summary : { totalReviews: 0, avgRating: 0, ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } };

  return <AdminFeedbackPortal initialFeedback={feedbackList} summary={summary} />;
}
