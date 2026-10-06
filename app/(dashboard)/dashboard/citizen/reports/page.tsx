import { Role } from '@prisma/client';
import { requireRole } from '@/lib/session';
import { getWasteReports } from '@/actions/reports';
import { MyWasteReportsList } from '@/components/citizen/MyWasteReportsList';

export const metadata = {
  title: 'My Waste Reports — EcoBin',
};

export default async function MyWasteReportsPage() {
  await requireRole([Role.CITIZEN]);

  const res = await getWasteReports();
  const reports = res.success ? res.reports : [];

  return <MyWasteReportsList initialReports={reports} />;
}
