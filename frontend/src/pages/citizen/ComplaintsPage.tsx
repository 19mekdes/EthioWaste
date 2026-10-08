import React, { useEffect, useState } from 'react';
import { CitizenLayout } from '../../layouts/CitizenLayout';
import { complaintService } from '../../services/complaintService';
import { Complaint } from '../../types';
import { AlertTriangle, MessageSquare, Send, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

export const ComplaintsPage: React.FC = () => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [category, setCategory] = useState('MISSED_PICKUP');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const data = await complaintService.getMyComplaints();
      setComplaints(data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load complaints.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !description) return;

    try {
      setSubmitting(true);
      setError(null);
      await complaintService.submitComplaint({
        category,
        subject,
        description,
      });

      setSuccess(true);
      setSubject('');
      setDescription('');
      fetchComplaints();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to submit complaint.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <CitizenLayout title="Municipal Complaints">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Submit Form */}
          <div className="lg:col-span-1 bg-slate-800/80 border border-slate-700/60 rounded-2xl p-6 shadow-xl h-fit">
            <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-amber-400" /> File a Complaint
            </h2>
            <p className="text-xs text-slate-400 mb-6">
              Report issues such as uncollected waste bins, illegal dumping, collector misconduct, or delayed response.
            </p>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>Complaint logged successfully!</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="MISSED_PICKUP">Missed Waste Pickup</option>
                  <option value="ILLEGAL_DUMPING">Overflowing Dump / Illegal Site</option>
                  <option value="COLLECTOR_BEHAVIOR">Collector Misconduct / Conduct</option>
                  <option value="APP_ISSUE">Platform / Technical Issue</option>
                  <option value="OTHER">Other Issue</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Subject *
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Uncollected bins on Bole Road"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Detailed Description *
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  placeholder="Provide location details, dates, and background..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold shadow-lg shadow-amber-500/20 transition flex items-center justify-center gap-2 text-sm"
              >
                <Send className="w-4 h-4" /> {submitting ? 'Submitting...' : 'Submit Complaint'}
              </button>
            </form>
          </div>

          {/* Submitted Complaints List */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-emerald-400" /> Your Submitted Complaints
            </h2>

            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500" />
              </div>
            ) : complaints.length === 0 ? (
              <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-8 text-center text-slate-400 text-sm">
                No complaints recorded yet.
              </div>
            ) : (
              <div className="space-y-4">
                {complaints.map((c) => (
                  <div
                    key={c.id}
                    className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-5 shadow-md space-y-3"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <span className="text-xs font-semibold text-amber-400 uppercase">
                          {c.category.replace('_', ' ')}
                        </span>
                        <h3 className="text-base font-bold text-white mt-0.5">{c.subject}</h3>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        c.status === 'RESOLVED' 
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' 
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                      }`}>
                        {c.status}
                      </span>
                    </div>

                    <p className="text-sm text-slate-300 bg-slate-900/60 p-3 rounded-xl border border-slate-700/40">
                      {c.description}
                    </p>

                    {c.adminNotes && (
                      <div className="bg-emerald-950/40 border border-emerald-800/50 p-3 rounded-xl text-xs text-emerald-200">
                        <span className="font-bold text-emerald-400 block mb-1">Municipal Response:</span>
                        {c.adminNotes}
                      </div>
                    )}

                    <div className="text-xs text-slate-500 flex items-center gap-2 pt-2 border-t border-slate-700/50">
                      <Clock className="w-3.5 h-3.5 text-slate-400" /> Submitted on {new Date(c.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </CitizenLayout>
  );
};
