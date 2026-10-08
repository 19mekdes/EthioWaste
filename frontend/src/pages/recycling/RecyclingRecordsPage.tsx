import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { RecyclingLayout } from '../../layouts/RecyclingLayout';
import { recyclingService } from '../../services/recyclingService';
import { RecyclingRecord } from '../../types';
import { Scale, Plus, CheckCircle2, AlertCircle, Calendar } from 'lucide-react';

export const RecyclingRecordsPage: React.FC = () => {
  const [records, setRecords] = useState<RecyclingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Form State
  const [materialType, setMaterialType] = useState('PLASTIC');
  const [quantityKg, setQuantityKg] = useState<number>(100);
  const [source, setSource] = useState('Municipal Collector Dispatch');
  const [notes, setNotes] = useState('');

  const fetchRecords = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await recyclingService.getMyRecords();
      setRecords(data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch processing records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (quantityKg <= 0) {
      setError('Please provide a valid material weight in kilograms.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      await recyclingService.createRecord({
        materialType,
        quantityKg: Number(quantityKg),
        source,
        notes,
      });

      setSuccess(true);
      setNotes('');
      setQuantityKg(100);
      fetchRecords();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to log recycling record.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <RecyclingLayout title="Shipment & Processing Logs">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* New Record Logging Form */}
          <div className="lg:col-span-1 bg-slate-800/80 border border-slate-700/60 rounded-2xl p-6 shadow-xl h-fit">
            <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
              <Plus className="w-5 h-5 text-purple-400" /> Log Material Shipment
            </h2>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>Shipment record logged successfully!</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Material Type *
                </label>
                <select
                  value={materialType}
                  onChange={(e) => setMaterialType(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="PLASTIC">Plastic</option>
                  <option value="GLASS">Glass</option>
                  <option value="METAL">Metal / Scrap</option>
                  <option value="PAPER_CARD">Paper & Cardboard</option>
                  <option value="ELECTRONIC">Electronic Waste</option>
                  <option value="ORGANIC">Organic Material</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Net Weight (Kilograms - kg) *
                </label>
                <input
                  type="number"
                  min="1"
                  step="0.5"
                  value={quantityKg}
                  onChange={(e) => setQuantityKg(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Source / Truck Supplier *
                </label>
                <input
                  type="text"
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  placeholder="e.g. Bole Sub-City Collector Fleet #3"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Processing Notes / Batch Code
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  placeholder="Optional batch quality or sorting details..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded-xl bg-purple-500 hover:bg-purple-400 disabled:opacity-50 text-slate-950 font-bold shadow-lg shadow-purple-500/20 transition flex items-center justify-center gap-2 text-sm"
              >
                {submitting ? 'Saving...' : 'Record Material Intake'}
              </button>
            </form>
          </div>

          {/* Record History Table */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-lg font-bold text-white">Intake History</h2>

            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500" />
              </div>
            ) : records.length === 0 ? (
              <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-8 text-center text-slate-400 text-sm">
                No material intake records registered.
              </div>
            ) : (
              <div className="space-y-3">
                {records.map((r) => (
                  <div
                    key={r.id}
                    className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-5 shadow-md flex items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-purple-500/10 text-purple-400 border border-purple-500/30">
                          {r.materialType}
                        </span>
                        <span className="font-bold text-white text-base">{r.quantityKg} kg</span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">
                        Source: {r.source || 'N/A'}
                      </p>
                      <span className="text-[11px] text-slate-500 flex items-center gap-1 mt-1">
                        <Calendar className="w-3 h-3 text-slate-500" /> Recorded on {new Date(r.createdAt).toLocaleString()}
                      </span>
                    </div>

                    <Link
                      to={`/recycling/records/${r.id}`}
                      className="px-4 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-semibold transition"
                    >
                      Audit View
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </RecyclingLayout>
  );
};
