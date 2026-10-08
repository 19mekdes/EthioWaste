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
        setError(err.response?.data?.error || 'Failed to load material totals.');
      } finally {
        setLoading(false);
      }
    };
    fetchRecords();
  }, []);

  const materialCategories = ['PLASTIC', 'GLASS', 'METAL', 'PAPER_CARD', 'ELECTRONIC', 'ORGANIC'];

  const getMaterialTotal = (type: string) => {
    return records
      .filter(r => r.materialType === type)
      .reduce((sum, r) => sum + (r.quantityKg || 0), 0);
  };

  return (
    <RecyclingLayout title="Material Inventory & Breakdown">
      <div className="space-y-6 max-w-6xl mx-auto">
        <div>
          <h2 className="text-xl font-bold text-white">Facility Material Processing Totals</h2>
          <p className="text-sm text-slate-400">Categorized cumulative metrics for processed waste streams.</p>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {materialCategories.map((mat) => {
              const totalKg = getMaterialTotal(mat);
              const count = records.filter(r => r.materialType === mat).length;

              return (
                <div
                  key={mat}
                  className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-6 shadow-lg space-y-4 hover:border-purple-500/40 transition"
                >
                  <div className="flex items-center justify-between">
                    <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400">
                      <Recycle className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-semibold text-slate-400">{count} Shipments</span>
                  </div>

                  <div>
                    <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">
                      {mat.replace('_', ' ')}
                    </span>
                    <h3 className="text-3xl font-extrabold text-white mt-1">
                      {totalKg.toLocaleString()} <span className="text-lg font-medium text-slate-400">kg</span>
                    </h3>
                  </div>

                  <div className="pt-3 border-t border-slate-700/60 flex items-center justify-between text-xs text-slate-400">
                    <span>Equivalent Tons: {(totalKg / 1000).toFixed(2)} metric tons</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </RecyclingLayout>
  );
};
