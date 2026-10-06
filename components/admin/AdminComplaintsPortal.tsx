'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MessageSquare, Search, CheckCircle2, XCircle, AlertCircle, Clock, Send, Loader2 } from 'lucide-react';
import { updateComplaintAdmin } from '@/actions/admin';
import { ComplaintStatus } from '@prisma/client';

interface AdminComplaintsPortalProps {
  initialComplaints: any[];
}

export function AdminComplaintsPortal({ initialComplaints }: AdminComplaintsPortalProps) {
  const router = useRouter();

  const [complaints, setComplaints] = useState(initialComplaints);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const [selectedComplaint, setSelectedComplaint] = useState<any | null>(null);
  const [adminResponse, setAdminResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const filteredComplaints = complaints.filter((c) => {
    if (statusFilter !== 'ALL' && c.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchCategory = c.category?.toLowerCase().includes(q);
      const matchDesc = c.description?.toLowerCase().includes(q);
      const matchCitizen = c.citizen?.name?.toLowerCase().includes(q);
      const matchId = c.id?.toLowerCase().includes(q);
      if (!matchCategory && !matchDesc && !matchCitizen && !matchId) return false;
    }
    return true;
  });

  const handleStatusUpdate = async (complaintId: string, nextStatus: ComplaintStatus) => {
    setLoading(true);
    setError('');

    const res = await updateComplaintAdmin(complaintId, nextStatus, adminResponse);
    setLoading(false);

    if (res.success && res.complaint) {
      setComplaints((prev) => prev.map((item) => (item.id === complaintId ? res.complaint : item)));
      if (selectedComplaint?.id === complaintId) {
        setSelectedComplaint(res.complaint);
      }
      setAdminResponse('');
      router.refresh();
    } else {
      setError(res.error || 'Failed to update complaint.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card p-6 bg-slate-900/60 border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-rose-400" />
            Citizen Grievance & Complaints Management
          </h1>
          <p className="text-xs text-slate-400">
            Review service grievances, provide official municipal responses, and resolve citizen issues.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card p-4 border-slate-800 bg-slate-900/40 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search category, description, or citizen..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full glass-input pl-9 text-xs"
            />
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full glass-input text-xs"
            >
              <option value="ALL">All Complaint Statuses</option>
              <option value="OPEN">OPEN</option>
              <option value="IN_REVIEW">IN_REVIEW</option>
              <option value="RESOLVED">RESOLVED</option>
              <option value="REJECTED">REJECTED</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          {filteredComplaints.length === 0 ? (
            <div className="glass-card p-12 text-center border-slate-800 space-y-2">
              <MessageSquare className="w-10 h-10 text-slate-600 mx-auto" />
              <p className="text-xs text-slate-400">No complaints found matching filters.</p>
            </div>
          ) : (
            filteredComplaints.map((c) => (
              <div
                key={c.id}
                onClick={() => {
                  setSelectedComplaint(c);
                  setAdminResponse(c.adminResponse || '');
                }}
                className={`glass-card p-4 border transition-all cursor-pointer ${
                  selectedComplaint?.id === c.id
                    ? 'border-rose-500 bg-rose-500/10'
                    : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xs font-bold text-white">{c.category}</h3>
                      <span className="text-[10px] text-slate-400 font-mono">#{c.id.slice(-8)}</span>
                    </div>

                    <div className="text-[11px] text-slate-300">
                      Citizen: <span className="font-semibold">{c.citizen?.name}</span> ({c.citizen?.email})
                    </div>

                    <p className="text-xs text-slate-400 line-clamp-2">{c.description}</p>

                    <div className="text-[10px] text-slate-500 pt-1">
                      Filed: {new Date(c.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${getComplaintBadgeStyle(c.status)}`}>
                    {c.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Selected Complaint Detail & Admin Response Box */}
        <div>
          {selectedComplaint ? (
            <div className="glass-card p-5 border-slate-800 bg-slate-900/80 sticky top-20 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400" />
                  Complaint Review
                </h3>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${getComplaintBadgeStyle(selectedComplaint.status)}`}>
                  {selectedComplaint.status}
                </span>
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                  {error}
                </div>
              )}

              <div className="space-y-2 text-xs">
                <div>
                  <h4 className="font-bold text-slate-100">{selectedComplaint.category}</h4>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Citizen: {selectedComplaint.citizen?.name} ({selectedComplaint.citizen?.phone || selectedComplaint.citizen?.email})
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Citizen Description:</span>
                  <p className="text-slate-200 text-xs leading-relaxed">{selectedComplaint.description}</p>
                </div>

                {selectedComplaint.relatedRequestId && (
                  <div className="text-[10px] text-sky-400">
                    Linked Request ID: #{selectedComplaint.relatedRequestId.slice(-8)}
                  </div>
                )}

                {/* Response Input */}
                <div className="pt-2 space-y-2">
                  <label className="block text-xs font-semibold text-slate-300">Official Admin Response</label>
                  <textarea
                    rows={3}
                    placeholder="Enter your administrative response or action plan for the citizen..."
                    value={adminResponse}
                    onChange={(e) => setAdminResponse(e.target.value)}
                    className="w-full glass-input text-xs"
                  />
                </div>

                {/* Workflow Action Buttons */}
                <div className="pt-2 space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Transition Workflow:</span>

                  {selectedComplaint.status === 'OPEN' && (
                    <button
                      onClick={() => handleStatusUpdate(selectedComplaint.id, ComplaintStatus.IN_REVIEW)}
                      disabled={loading}
                      className="glass-button-primary text-xs w-full py-2 bg-sky-600 text-white"
                    >
                      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Clock className="w-4 h-4" />}
                      <span>Mark as IN_REVIEW</span>
                    </button>
                  )}

                  {(selectedComplaint.status === 'OPEN' || selectedComplaint.status === 'IN_REVIEW') && (
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleStatusUpdate(selectedComplaint.id, ComplaintStatus.RESOLVED)}
                        disabled={loading}
                        className="glass-button-primary text-xs py-2 bg-emerald-600 text-slate-950 font-bold"
                      >
                        <CheckCircle2 className="w-4 h-4" /> Resolve
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(selectedComplaint.id, ComplaintStatus.REJECTED)}
                        disabled={loading}
                        className="glass-button-secondary text-xs py-2 text-rose-300 border-rose-500/30"
                      >
                        <XCircle className="w-4 h-4" /> Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="glass-card p-8 text-center border-slate-800 text-xs text-slate-500">
              Select a complaint from the list to review grievance details, write responses, and transition status.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function getComplaintBadgeStyle(status: string) {
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
