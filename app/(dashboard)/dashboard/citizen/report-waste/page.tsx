import { Role } from '@prisma/client';
import { requireRole } from '@/lib/session';
import { ReportWasteForm } from '@/components/citizen/ReportWasteForm';

export const metadata = {
  title: 'Report Waste / Illegal Dumping — EcoBin',
};

export default async function ReportWastePage() {
  await requireRole([Role.CITIZEN]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white">Report Waste or Illegal Dumping</h1>
        <p className="text-xs text-slate-400">
          Help municipality cleanup crews pinpoint waste issues. Earn Eco-Points upon admin validation.
        </p>
      </div>

      <ReportWasteForm />
    </div>
  );
}
