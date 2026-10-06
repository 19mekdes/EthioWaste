import { Role, CollectionRequestStatus } from '@prisma/client';
import { requireRole } from '@/lib/session';
import { getFeedback } from '@/actions/feedback';
import { getCollectionRequests } from '@/actions/collection-requests';
import { CitizenFeedbackPortal } from '@/components/citizen/CitizenFeedbackPortal';

export const metadata = {
  title: 'Citizen Feedback — EcoBin',
};

export default async function CitizenFeedbackPage() {
  await requireRole([Role.CITIZEN]);

  const [feedbackRes, requestsRes] = await Promise.all([
    getFeedback(),
    getCollectionRequests({ status: CollectionRequestStatus.COMPLETED }),
  ]);

  const feedbackList = feedbackRes.success ? feedbackRes.feedback : [];
  const completedRequests = requestsRes.success ? requestsRes.requests : [];

  return (
    <CitizenFeedbackPortal
      initialFeedback={feedbackList}
      completedRequests={completedRequests}
    />
  );
}
