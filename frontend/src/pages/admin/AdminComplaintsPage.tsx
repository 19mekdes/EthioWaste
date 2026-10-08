import React, { useEffect, useState } from 'react';
import { AdminLayout } from '../../layouts/AdminLayout';
import { complaintService } from '../../services/complaintService';
import { Complaint } from '../../types';
import { AlertTriangle, MessageSquare, Send, CheckCircle2, AlertCircle } from 'lucide-react';

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
      await complaintService.resolveComplaint(selectedComplaint.id, 'RESOLVED', adminNotes);
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
      <div className="space-y-6 max-w-7xl mx-auto">
        <div>
          <h2 className="text-xl font-bold text-white">Citizen Complaints & Service Issues</h2>
          <p className="text-sm text-slate-400">Review reported service bottlenecks and respond to citizen inquiries.</p>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500" />
          </div>
        ) : complaints.length === 0 ? (
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-12 text-center text-slate-400">
            No complaints recorded.
          </div>
        ) : (
          <div className="space-y-4">
            {complaints.map((c) => (
              <div
                key={c.id}
                className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-6 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                      {c.category}
                    </span>
                    <span className="text-xs text-slate-400">
                      Status: {c.status}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white">{c.subject}</h3>
                  <p className="text-xs text-slate-300 bg-slate-900/60 p-3 rounded-xl border border-slate-700/40">
                    "{c.description}"
                  </p>
                  {c.adminNotes && (
                    <div className="text-xs text-emerald-300 bg-emerald-950/30 border border-emerald-800/40 p-2.5 rounded-xl">
                      <strong>Resolution Response:</strong> {c.adminNotes}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                  <button
                    onClick={() => {
                      setSelectedComplaint(c);
                      setAdminNotes(c.adminNotes || '');
                    }}
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition"
                  >
                    Respond & Resolve
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal for Admin Response */}
        {selectedComplaint && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-6">
              <div className="flex items-center justify-between border-b border-slate-700 pb-4">
                <h3 className="text-xl font-bold text-white">Resolve Complaint</h3>
                <button onClick={() => setSelectedComplaint(null)} className="text-slate-400 hover:text-white font-bold">✕</button>
              </div>

              <form onSubmit={handleResolve} className="space-y-4">
                <div>
                  <span className="text-xs text-slate-400 block mb-1">Subject</span>
                  <p className="text-sm font-bold text-white">{selectedComplaint.subject}</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Municipal Response / Action Notes *
                  </label>
                  <textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    rows={4}
                    placeholder="Describe resolution steps taken or instructions to collector team..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100"
                    required
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-700">
                  <button
                    type="button"
                    onClick={() => setSelectedComplaint(null)}
                    className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={updating}
                    className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md"
                  >
                    Save & Mark Resolved
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
