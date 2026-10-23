
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { RecyclingLayout } from '../../layouts/RecyclingLayout';
import { recyclingService } from '../../services/recyclingService';
import { RecyclingRecord } from '../../types';
import {
  Scale,
  Plus,
  CheckCircle2,
  AlertCircle,
  Calendar,
} from 'lucide-react';

export const RecyclingRecordsPage: React.FC = () => {
  const [records, setRecords] = useState<RecyclingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

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
      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        'Failed to fetch processing records.'
      );
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
      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        'Failed to log recycling record.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const labelClass =
    'mb-1.5 block text-sm font-medium text-slate-700';

  const inputClass =
    'w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100';

  return (
    <RecyclingLayout title="Shipment & Processing Logs">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="border-b border-slate-200 pb-5">
          <h2 className="text-xl font-bold text-slate-800">
            Shipment Records
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Register incoming materials and review previous intake records.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
          {/* New shipment form */}
          <section className="h-fit lg:col-span-1">
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-lg bg-emerald-50 p-2.5 text-emerald-700">
                <Plus className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-bold text-slate-800">
                  Log Material Shipment
                </h2>
                <p className="mt-0.5 text-xs text-slate-500">
                  Enter the shipment details below.
                </p>
              </div>
            </div>

            {error && (
              <div className="mb-4 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="mb-4 flex items-start gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                <span>Shipment record logged successfully!</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className={labelClass}>
                  Material Type *
                </label>
                <select
                  value={materialType}
                  onChange={(e) => setMaterialType(e.target.value)}
                  className={inputClass}
                >
                  <option value="PLASTIC">Plastic</option>
                  <option value="GLASS">Glass</option>
                  <option value="METAL">Metal / Scrap</option>
                  <option value="PAPER">Paper</option>
                  <option value="CARDBOARD">Cardboard</option>
                  <option value="ELECTRONIC">Electronic Waste</option>
                  <option value="ORGANIC">Organic Material</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>
                  Net Weight (Kilograms - kg) *
                </label>
                <input
                  type="number"
                  min="1"
                  step="0.5"
                  value={quantityKg}
                  onChange={(e) =>
                    setQuantityKg(Number(e.target.value))
                  }
                  className={inputClass}
                  required
                />
              </div>

              <div>
                <label className={labelClass}>
                  Source / Truck Supplier *
                </label>
                <input
                  type="text"
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  placeholder="e.g. Bole Sub-City Collector Fleet #3"
                  className={inputClass}
                  required
                />
              </div>

              <div>
                <label className={labelClass}>
                  Processing Notes / Batch Code
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  placeholder="Optional batch quality or sorting details..."
                  className={inputClass}
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting ? 'Saving...' : 'Record Material Intake'}
              </button>
            </form>
          </section>

          {/* Shipment history */}
          <section className="min-w-0 lg:col-span-2">
            <div className="mb-5 flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <h2 className="font-bold text-slate-800">
                  Intake History
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Previously registered shipments.
                </p>
              </div>
              <span className="text-sm text-slate-500">
                {records.length} {records.length === 1 ? 'record' : 'records'}
              </span>
            </div>

            {loading ? (
              <div className="flex justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-emerald-600" />
              </div>
            ) : records.length === 0 ? (
              <div className="py-10 text-center text-sm text-slate-500">
                No material intake records registered.
              </div>
            ) : (
              <div className="divide-y divide-slate-200">
                {records.map((r) => (
                  <article
                    key={r.id}
                    className="flex flex-col items-start justify-between gap-4 py-5 sm:flex-row sm:items-center"
                  >
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-800">
                          {r.materialType || r.material}
                        </span>

                        <span className="font-bold text-slate-800">
                          {r.quantityKg ?? r.quantity ?? 0} kg
                        </span>
                      </div>

                      <p className="mt-2 break-words text-sm text-slate-600">
                        Source: {r.source || 'Direct Facility Intake'}
                      </p>

                      <p className="mt-2 flex items-start gap-1.5 text-xs text-slate-500">
                        <Calendar className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                        <span>
                          Recorded on{' '}
                          {new Date(r.createdAt).toLocaleString()}
                        </span>
                      </p>
                    </div>

                    <Link
                      to={`/recycling/records/${r.id}`}
                      className="inline-flex shrink-0 items-center justify-center rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-800"
                    >
                      Audit View
                    </Link>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </RecyclingLayout>
  );
};
