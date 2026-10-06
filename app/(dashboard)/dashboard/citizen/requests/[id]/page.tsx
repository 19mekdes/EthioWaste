import { Role } from '@prisma/client';
import { notFound } from 'next/navigation';
import { requireRole } from '@/lib/session';
import { getCollectionRequestById } from '@/actions/collection-requests';
import { getFeedback } from '@/actions/feedback';
import { CollectionRequestTracking } from '@/components/citizen/CollectionRequestTracking';

export const metadata = {
  title: 'Request Tracking — EcoBin',
};

interface RequestDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function RequestDetailPage({ params }: RequestDetailPageProps) {
  const user = await requireRole([Role.CITIZEN]);
  const { id } = await params;

  const res = await getCollectionRequestById(id);
  if (!res.success || !res.request) {
    // Resource hiding / 404 security compliance
    notFound();
  }

  // Check if feedback already exists for this collection request
  const feedbackRes = await getFeedback();
  const feedbackList = feedbackRes.success ? feedbackRes.feedback : [];
  const existingFeedback = feedbackList.find((f: any) => f.collectionRequestId === id);

  return <CollectionRequestTracking request={res.request} feedbackGiven={existingFeedback} />;
}
