

import { Role } from '@prisma/client';
import { requireRole } from '@/lib/session';
import { getRecyclingCenters } from '@/actions/centers';
import { RecyclingCenterMap } from '@/components/citizen/RecyclingCenterMap';

export const metadata = {
  title: 'Recycling Centers — EcoBin',
};

export default async function CentersPage() {
  const user = await requireRole([Role.CITIZEN]);
  const res = await getRecyclingCenters();

  return (
    <div className="space-y-6">
      <RecyclingCenterMap
        centers={res.success ? res.centers : []}
        userLat={40.7580}
        userLng={-73.9855}
      />
    </div>
  );
}
