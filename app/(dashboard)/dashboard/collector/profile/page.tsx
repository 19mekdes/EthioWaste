import { Role } from '@prisma/client';
import { requireRole } from '@/lib/session';
import { getCollectorProfileData } from '@/actions/collector';
import { CollectorProfile } from '@/components/collector/CollectorProfile';

export const metadata = {
  title: 'Collector Profile — EcoBin',
};

export default async function CollectorProfilePage() {
  await requireRole([Role.COLLECTOR]);

  const { collector } = await getCollectorProfileData();

  return <CollectorProfile collector={collector} />;
}
