import { Role } from '@prisma/client';
import { requireRole } from '@/lib/session';
import { getAdminWasteReports, getCollectors } from '@/actions/admin';
import { AdminWasteReportsPortal } from '@/components/admin/AdminWasteReportsPortal';

export const metadata = {
  title: 'Waste Reports Management — EcoBin Admin',
};

export default async function AdminWasteReportsPage() {
  await requireRole([Role.MUNICIPAL_ADMIN]);

  const [reportsRes, collectorsRes] = await Promise.all([
    getAdminWasteReports(),
    getCollectors(),
  ]);

  const reports = reportsRes.success ? reportsRes.reports : [];
  const collectors = collectorsRes.success ? collectorsRes.collectors : [];

  return <AdminWasteReportsPortal initialReports={reports} collectors={collectors} />;
}
