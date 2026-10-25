
import React, { useEffect, useState } from 'react';
import { AdminLayout } from '../../layouts/AdminLayout';
import { complaintService } from '../../services/complaintService';
import { Complaint } from '../../types';
import {
  AlertTriangle,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  X,
} from 'lucide-react';

export const AdminComplaintsPage: React.FC = () => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [updating, setUpdating] = useState(false);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await complaintService.getAllComplaints();
      setComplaints(data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load citizen complaints.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleResolve = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedComplaint) return;

    try {
      setUpdating(true);
      await complaintService.resolveComplaint(
        selectedComplaint.id,
        'RESOLVED',
        adminNotes
      );
      setSelectedComplaint(null);
      setAdminNotes('');
      fetchComplaints();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to resolve complaint.');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <AdminLayout title="Municipal Complaints Management">
      <div className="mx-auto max-w-7xl space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800">
            Citizen Complaints &amp; Service Issues
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Review reported service bottlenecks and respond to citizen inquiries.
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-emerald-600" />
          </div>
        ) : complaints.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-12">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
              <MessageSquare className="h-6 w-6" />
            </div>
            <p className="font-semibold text-slate-800">No complaints recorded.</p>
            <p className="mt-1 text-sm text-slate-500">
              Citizen complaints will appear here when submitted.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {complaints.map((c) => (
              <div
                key={c.id}
                className="flex flex-col items-start justify-between gap-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-emerald-200 hover:shadow-md sm:p-6 md:flex-row md:items-center"
              >
                <div className="min-w-0 flex-1 space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-bold text-amber-800">
                      {c.category}
                    </span>
                    <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
                      Status: {c.status}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-800">
                    {c.subject}
                  </h3>

                  <p className="whitespace-pre-wrap break-words rounded-xl border border-slate-100 bg-slate-50 p-3 text-sm text-slate-600">
                    "{c.description}"
                  </p>

                  {c.adminNotes && (
                    <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-3 text-sm text-emerald-800">
                      <strong>Resolution Response:</strong> {c.adminNotes}
                    </div>
                  )}
                </div>

                <div className="flex w-full flex-shrink-0 justify-end md:w-auto">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedComplaint(c);
                      setAdminNotes(c.adminNotes || '');
                    }}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-emerald-700"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Respond &amp; Resolve
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal for Admin Response */}
        {selectedComplaint && (
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/50 p-4 backdrop-blur-sm">
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="resolve-complaint-title"
              className="my-auto w-full max-w-lg space-y-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl sm:p-6"
            >
              <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-emerald-50 p-2.5 text-emerald-700">
                    <AlertTriangle className="h-5 w-5" />
                  </div>
                  <h3
                    id="resolve-complaint-title"
                    className="text-lg font-bold text-slate-800"
                  >
                    Resolve Complaint
                  </h3>
                </div>

                <button
                  type="button"
                  aria-label="Close dialog"
                  onClick={() => setSelectedComplaint(null)}
                  className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleResolve} className="space-y-5">
                <div>
                  <span className="mb-1 block text-xs font-semibold text-slate-500">
                    Subject
                  </span>
                  <p className="break-words text-sm font-bold text-slate-800">
                    {selectedComplaint.subject}
                  </p>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                    Municipal Response / Action Notes *
                  </label>
                  <textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    rows={4}
                    placeholder="Describe resolution steps taken or instructions to collector team..."
                    className="w-full resize-y rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                    required
                  />
                </div>

                <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={() => setSelectedComplaint(null)}
                    className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={updating}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    {updating ? 'Saving...' : 'Save & Mark Resolved'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};
