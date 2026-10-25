
import React, { useEffect, useState } from 'react';
import { RecyclingLayout } from '../../layouts/RecyclingLayout';
import { recyclingService } from '../../services/recyclingService';
import { RecyclingRecord } from '../../types';
import { Recycle, Scale, Plus, AlertCircle } from 'lucide-react';

export const RecyclingMaterialsPage: React.FC = () => {
  const [records, setRecords] = useState<RecyclingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await recyclingService.getMyRecords();
        setRecords(data);
      } catch (err: any) {
        setError(
          err.response?.data?.message ||
          err.response?.data?.error ||
          err.message ||
          'Failed to load material totals.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, []);

  const materialCategories = [
    'PLASTIC',
    'GLASS',
    'METAL',
    'PAPER',
    'CARDBOARD',
    'ELECTRONIC',
    'ORGANIC',
  ];

  const getMaterialTotal = (type: string) => {
    return records
      .filter((r) => {
        const mat = r.materialType || r.material;
        return mat === type || (type === 'PAPER' && mat === 'PAPER_CARD');
      })
      .reduce((sum, r) => sum + (r.quantityKg ?? r.quantity ?? 0), 0);
  };

  return (
    <RecyclingLayout title="Material Inventory & Breakdown">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="border-b border-slate-200 pb-5">
          <h2 className="text-xl font-bold text-slate-800">
            Facility Material Processing Totals
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Cumulative quantities recorded for each waste material.
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-emerald-600" />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
            {materialCategories.map((mat) => {
              const totalKg = getMaterialTotal(mat);

              const count = records.filter((r) => {
                const matType = r.materialType || r.material;
                return (
                  matType === mat ||
                  (mat === 'PAPER' && matType === 'PAPER_CARD')
                );
              }).length;

              return (
                <section
                  key={mat}
                  className="border-b border-slate-200 py-6"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-emerald-50 p-3 text-emerald-700">
                        <Recycle className="h-5 w-5" />
                      </div>

                      <h3 className="font-semibold text-slate-700">
                        {mat.replace('_', ' ')}
                      </h3>
                    </div>

                    <span className="text-xs text-slate-500">
                      {count} {count === 1 ? 'shipment' : 'shipments'}
                    </span>
                  </div>

                  <div className="mt-5">
                    <p className="text-sm text-slate-500">
                      Total processed weight
                    </p>

                    <p className="mt-1 text-3xl font-bold tracking-tight text-slate-800">
                      {totalKg.toLocaleString()}{' '}
                      <span className="text-base font-medium text-slate-500">
                        kg
                      </span>
                    </p>
                  </div>

                  <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
                    <Scale className="h-4 w-4 text-emerald-700" />
                    <span>
                      {(totalKg / 1000).toFixed(2)} metric tons
                    </span>
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </div>
    </RecyclingLayout>
  );
};
