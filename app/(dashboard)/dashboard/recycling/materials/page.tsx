import { Role } from '@prisma/client';
import { requireRole } from '@/lib/session';
import { getAvailableRecyclableMaterials } from '@/actions/recycling';
import { AvailableMaterialsList } from '@/components/recycling/AvailableMaterialsList';

export const metadata = {
  title: 'Available Materials — Recycling Portal',
};

export default async function RecyclingMaterialsPage() {
  await requireRole([Role.RECYCLING_ORGANIZATION]);

  const { tasks } = await getAvailableRecyclableMaterials();

  return <AvailableMaterialsList tasks={tasks || []} />;
}
