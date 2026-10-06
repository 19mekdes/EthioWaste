'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MessageSquare, Plus, AlertCircle, Clock, CheckCircle2, XCircle, Send, Loader2, FileText } from 'lucide-react';
import { createComplaint } from '@/actions/complaints';

interface CitizenComplaintsPortalProps {
  initialComplaints: any[];
  myRequests: any[];
}

export function CitizenComplaintsPortal({ initialComplaints, myRequests }: CitizenComplaintsPortalProps) {
  const router = useRouter();

  const [category, setCategory] = useState('Missed Pickup');
  const [description, setDescription] = useState('');
  const [relatedRequestId, setRelatedRequestId] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      setError('Please provide a detailed description of your complaint.');
      return;
    }

    setLoading(true);
    setError('');

    const res = await createComplaint({
      category,
      description,
      relatedRequestId: relatedRequestId || undefined,
    });

    setLoading(false);

    if (res.success) {
      setSuccess(true);
      setDescription('');
      setRelatedRequestId('');
      setTimeout(() => {
        setShowForm(false);
        setSuccess(false);
        router.refresh();
      }, 1500);
    } else {
      setError(res.error || 'Failed to submit complaint.');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="glass-card p-6 bg-slate-900/60 border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-rose-400" />
            Citizen Complaints Portal
          </h1>
          <p className="text-xs text-slate-400">
            Submit service grievances or issues regarding collection delays and track resolution by municipal staff.
          </p>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="glass-button-primary text-xs py-2 px-4 bg-gradient-to-r from-rose-500 to-amber-500 text-white font-bold"
        >
          <Plus className="w-4 h-4" />
          <span>{showForm ? 'Cancel' : 'Submit New Complaint'}</span>
        </button>
      </div>

      {/* New Complaint Form Card */}
      {showForm && (
        <div className="glass-card p-6 border-rose-500/30 bg-slate-900/90 space-y-4">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100">File a Service Complaint</h2>
              <p className="text-xs text-slate-400">Your complaint will be reviewed directly by Municipal Administration</p>
            </div>
          </div>

          {success ? (
            <div className="py-6 text-center space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto animate-bounce" />
              <h3 className="text-base font-bold text-white">Complaint Submitted Successfully!</h3>
              <p className="text-xs text-slate-300">Status set to OPEN. You will be notified when an admin reviews it.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Complaint Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full glass-input text-xs"
                  >
                    <option value="Missed Pickup">Missed Waste Pickup</option>
                    <option value="Delayed Service">Delayed Collection Schedule</option>
                    <option value="Spill / Damage">Waste Spillage or Property Damage</option>
                    <option value="Staff Behavior">Collector Staff Conduct</option>
                    <option value="Illegal Dumping Site">Unaddressed Illegal Dumping</option>
                    <option value="Other">Other Grievance</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Related Collection Request (Optional)
                  </label>
                  <select
                    value={relatedRequestId}
                    onChange={(e) => setRelatedRequestId(e.target.value)}
                    className="w-full glass-input text-xs"
                  >
                    <option value="">None / General Issue</option>
                    {myRequests.map((req) => (
                      <option key={req.id} value={req.id}>
                        {req.wasteType} Waste - {new Date(req.createdAt).toLocaleDateString()} (#{req.id.slice(-6)})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Detailed Explanation</label>
                <textarea
                  rows={4}
                  placeholder="Provide complete details, dates, times, and any relevant location information..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full glass-input text-xs"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="glass-button-secondary text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="glass-button-primary text-xs bg-rose-500 text-white font-bold"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  <span>Submit Complaint</span>
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Complaints List */}
      {initialComplaints.length === 0 ? (
        <div className="glass-card p-12 text-center border-slate-800 space-y-3">
          <MessageSquare className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-slate-200">No Complaints Submitted</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            You haven&apos;t filed any complaints. If you experience missed pickups or issues, submit a grievance here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {initialComplaints.map((c) => (
            <div key={c.id} className="glass-card p-5 border-slate-800 bg-slate-900/60 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
                    <AlertCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">{c.category}</h3>
                    <div className="text-[11px] text-slate-400 flex items-center gap-2">
                      <span className="font-mono">ID: #{c.id.slice(-8)}</span>
                      <span>•</span>
                      <span>Filed: {new Date(c.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <span className={`px-3 py-1 rounded-full text-xs font-bold ${getComplaintStatusBadgeStyle(c.status)}`}>
                  {c.status}
                </span>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-300 leading-relaxed">{c.description}</p>

              {/* Admin Response Section (Read Only) */}
              {c.adminResponse ? (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs space-y-1">
                  <span className="font-bold text-emerald-400 block">Official Admin Response:</span>
                  <p className="text-slate-200">{c.adminResponse}</p>
                </div>
              ) : (
                <div className="text-[11px] text-slate-500 italic">
                  Awaiting municipal administrator review and response.
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function getComplaintStatusBadgeStyle(status: string) {
  switch (status) {
    case 'OPEN':
      return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
    case 'IN_REVIEW':
      return 'bg-sky-500/10 text-sky-400 border border-sky-500/20 animate-pulse';
    case 'RESOLVED':
      return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
    case 'REJECTED':
      return 'bg-rose-500/10 text-rose-400 border border-rose-500/20';
    default:
      return 'bg-slate-800 text-slate-400';
  }
}
