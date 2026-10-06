import { Role } from '@prisma/client';
import { requireRole } from '@/lib/session';
import { getAdminComplaints } from '@/actions/admin';
import { AdminComplaintsPortal } from '@/components/admin/AdminComplaintsPortal';

export const metadata = {
  title: 'Complaints Management — EcoBin Admin',
};

export default async function AdminComplaintsPage() {
  await requireRole([Role.MUNICIPAL_ADMIN]);

  const res = await getAdminComplaints();
  const complaints = res.success ? res.complaints : [];

  return <AdminComplaintsPortal initialComplaints={complaints} />;
}
