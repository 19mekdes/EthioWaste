import { Role } from '@prisma/client';
import { requireRole } from '@/lib/session';
import { getRecyclingOrgProfileData } from '@/actions/recycling';
import { RecyclingProfile } from '@/components/recycling/RecyclingProfile';

export const metadata = {
  title: 'Facility Profile — Recycling Portal',
};

export default async function RecyclingProfilePage() {
  await requireRole([Role.RECYCLING_ORGANIZATION]);

  const { profile } = await getRecyclingOrgProfileData();

  return <RecyclingProfile profile={profile} />;
}
