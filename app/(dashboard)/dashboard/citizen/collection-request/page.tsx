import { Role } from '@prisma/client';
import { requireRole } from '@/lib/session';
import { CollectionRequestForm } from '@/components/citizen/CollectionRequestForm';

export const metadata = {
  title: 'Request Waste Collection — EcoBin',
};

export default async function WasteCollectionRequestPage() {
  await requireRole([Role.CITIZEN]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white">Request Waste Collection</h1>
        <p className="text-xs text-slate-400">
          Book door-to-door waste collection. Once approved, a licensed municipal collector will be dispatched.
        </p>
      </div>

      <CollectionRequestForm />
    </div>
  );
}
