import { Role } from '@prisma/client';
import { requireRole } from '@/lib/session';
import { getComplaints } from '@/actions/complaints';
import { getCollectionRequests } from '@/actions/collection-requests';
import { CitizenComplaintsPortal } from '@/components/citizen/CitizenComplaintsPortal';

export const metadata = {
  title: 'Citizen Complaints — EcoBin',
};

export default async function CitizenComplaintsPage() {
  await requireRole([Role.CITIZEN]);

  const [complaintsRes, requestsRes] = await Promise.all([
    getComplaints(),
    getCollectionRequests(),
  ]);

  const complaints = complaintsRes.success ? complaintsRes.complaints : [];
  const requests = requestsRes.success ? requestsRes.requests : [];

  return (
    <CitizenComplaintsPortal
      initialComplaints={complaints}
      myRequests={requests}
    />
  );
}
