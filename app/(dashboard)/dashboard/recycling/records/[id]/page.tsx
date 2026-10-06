import { Role } from '@prisma/client';
import { requireRole } from '@/lib/session';
import { getRecyclingRecordById } from '@/actions/recycling';
import { RecyclingRecordDetail } from '@/components/recycling/RecyclingRecordDetail';
import { notFound } from 'next/navigation';

export const metadata = {
  title: 'Processing Record — Recycling Portal',
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function RecyclingRecordDetailPage({ params }: PageProps) {
  await requireRole([Role.RECYCLING_ORGANIZATION]);
  const { id } = await params;

  const { success, record } = await getRecyclingRecordById(id);

  if (!success || !record) {
    notFound();
  }

  return <RecyclingRecordDetail record={record} />;
}
