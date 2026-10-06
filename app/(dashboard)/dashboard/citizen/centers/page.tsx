import { Role } from '@prisma/client';
import { requireRole } from '@/lib/session';
import { getRecyclingCenters } from '@/actions/centers';
import { RecyclingCenterMap } from '@/components/citizen/RecyclingCenterMap';

export const metadata = {
  title: 'Collection Points & Recycling Hubs — EcoBin',
};

export default async function CitizenCentersPage() {
  await requireRole([Role.CITIZEN]);

  const res = await getRecyclingCenters();
  const centers = res.success ? res.centers : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white">Collection Points & Recycling Hubs</h1>
        <p className="text-xs text-slate-400">
          Locate nearby recycling drop-off centers, accepted waste materials, and operating hours.
        </p>
      </div>

      <RecyclingCenterMap centers={centers} userLat={9.0200} userLng={38.7600} />
    </div>
  );
}
