'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  FileText,
  Search,
  CheckCircle2,
  XCircle,
  MapPin,
  Calendar,
  AlertOctagon,
  Tag,
  User,
  Loader2,
  ExternalLink,
} from 'lucide-react';
import InteractiveMap, { MapMarker } from '@/components/map/InteractiveMap';
import { validateAndApproveReport, rejectReport } from '@/actions/admin';
import { WasteCategory, ReportStatus, ReportSeverity } from '@prisma/client';

interface AdminWasteReportsPortalProps {
  initialReports: any[];
  collectors: any[];
}

export function AdminWasteReportsPortal({ initialReports, collectors }: AdminWasteReportsPortalProps) {
  const router = useRouter();

  const [reports, setReports] = useState(initialReports);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReport, setSelectedReport] = useState<any | null>(null);

  const [actionLoading, setActionLoading] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [reportToReject, setReportToReject] = useState<any | null>(null);

  const filteredReports = useMemo(() => {
    return reports.filter((r) => {
      if (statusFilter !== 'ALL' && r.status !== statusFilter) return false;
      if (categoryFilter !== 'ALL' && r.category !== categoryFilter) return false;
      if (severityFilter !== 'ALL' && r.severity !== severityFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = r.title?.toLowerCase().includes(q);
        const matchDesc = r.description?.toLowerCase().includes(q);
        const matchAddr = r.address?.toLowerCase().includes(q);
        const matchReporter = r.reporter?.name?.toLowerCase().includes(q);
        const matchId = r.id?.toLowerCase().includes(q);
        if (!matchTitle && !matchDesc && !matchAddr && !matchReporter && !matchId) return false;
      }
      return true;
    });
  }, [reports, statusFilter, categoryFilter, severityFilter, searchQuery]);

  const handleApprove = async (reportId: string) => {
    setActionLoading(true);
    const res = await validateAndApproveReport(reportId);
    setActionLoading(false);

    if (res.success && res.report) {
      setReports((prev) => prev.map((r) => (r.id === reportId ? { ...r, ...res.report } : r)));
      if (selectedReport?.id === reportId) {
        setSelectedReport((prev: any) => ({ ...prev, ...res.report }));
      }
      router.refresh();
    } else {
      alert(res.error || 'Failed to approve report.');
    }
  };

  const handleRejectConfirm = async () => {
    if (!reportToReject) return;
    setActionLoading(true);
    const res = await rejectReport(reportToReject.id, rejectReason);
    setActionLoading(false);

    if (res.success && res.report) {
      setReports((prev) => prev.map((r) => (r.id === reportToReject.id ? { ...r, status: 'REJECTED' } : r)));
      if (selectedReport?.id === reportToReject.id) {
        setSelectedReport((prev: any) => ({ ...prev, status: 'REJECTED' }));
      }
      setShowRejectModal(false);
      setReportToReject(null);
      setRejectReason('');
      router.refresh();
    } else {
      alert(res.error || 'Failed to reject report.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card p-6 bg-slate-900/60 border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-amber-400" />
            Waste & Dumping Reports Management
          </h1>
          <p className="text-xs text-slate-400">
            Review citizen-submitted waste issues, verify authenticity, and transition workflow statuses.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="glass-card p-4 border-slate-800 bg-slate-900/40 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search title, location, or reporter..."
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
              <option value="ALL">All Statuses</option>
              <option value="PENDING">PENDING</option>
              <option value="VERIFIED">VERIFIED</option>
              <option value="ASSIGNED">ASSIGNED</option>
              <option value="IN_PROGRESS">IN_PROGRESS</option>
              <option value="COMPLETED">COMPLETED</option>
              <option value="REJECTED">REJECTED</option>
            </select>
          </div>

          <div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full glass-input text-xs"
            >
              <option value="ALL">All Categories</option>
              <option value="PLASTIC">PLASTIC</option>
              <option value="PAPER">PAPER</option>
              <option value="CARDBOARD">CARDBOARD</option>
              <option value="GLASS">GLASS</option>
              <option value="METAL">METAL</option>
              <option value="ELECTRONIC">ELECTRONIC</option>
              <option value="ORGANIC">ORGANIC</option>
              <option value="HAZARDOUS">HAZARDOUS</option>
              <option value="MIXED">MIXED</option>
              <option value="OTHER">OTHER</option>
            </select>
          </div>

          <div>
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="w-full glass-input text-xs"
            >
              <option value="ALL">All Severities</option>
              <option value="LOW">LOW</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="HIGH">HIGH</option>
              <option value="CRITICAL">CRITICAL</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reports Table & Detail Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Reports Table List */}
        <div className="lg:col-span-2 space-y-3">
          {filteredReports.length === 0 ? (
            <div className="glass-card p-12 text-center border-slate-800 space-y-2">
              <FileText className="w-10 h-10 text-slate-600 mx-auto" />
              <p className="text-xs text-slate-400">No waste reports match your selected criteria.</p>
            </div>
          ) : (
            filteredReports.map((r) => (
              <div
                key={r.id}
                onClick={() => setSelectedReport(r)}
                className={`glass-card p-4 border transition-all cursor-pointer ${
                  selectedReport?.id === r.id
                    ? 'border-amber-500 bg-amber-500/10'
                    : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={r.imageUrl}
                      alt={r.title}
                      className="w-14 h-14 rounded-xl object-cover border border-slate-700 bg-slate-950 shrink-0"
                    />
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white truncate">{r.title}</span>
                        {r.isIllegalDumping && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                            Dumping
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400">
                        <span>Reporter: {r.reporter?.name || 'Anonymous'}</span>
                        <span>•</span>
                        <span>{new Date(r.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px]">
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                          {r.category}
                        </span>
                        <span className={`px-2 py-0.5 rounded font-bold ${getSeverityBadgeStyle(r.severity)}`}>
                          {r.severity}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${getStatusBadgeStyle(r.status)}`}>
                      {r.status}
                    </span>

                    {r.status === 'PENDING' && (
                      <div className="flex items-center gap-1.5 pt-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleApprove(r.id);
                          }}
                          disabled={actionLoading}
                          className="px-2.5 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-[10px] flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3 h-3" /> Verify
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setReportToReject(r);
                            setShowRejectModal(true);
                          }}
                          disabled={actionLoading}
                          className="px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 font-bold text-[10px] flex items-center gap-1"
                        >
                          <XCircle className="w-3 h-3" /> Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Selected Report Inspection Card */}
        <div>
          {selectedReport ? (
            <div className="glass-card p-5 border-slate-800 bg-slate-900/80 sticky top-20 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-amber-400" />
                  Report Details
                </h3>
                <span className="text-[10px] font-mono text-slate-500">#{selectedReport.id.slice(-8)}</span>
              </div>

              {/* Photo Preview */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedReport.imageUrl}
                alt={selectedReport.title}
                className="w-full h-44 rounded-xl object-cover border border-slate-700 bg-slate-950"
              />

              <div className="space-y-2 text-xs">
                <div>
                  <h4 className="font-bold text-slate-100 text-sm">{selectedReport.title}</h4>
                  <p className="text-slate-300 leading-relaxed mt-1 text-xs">{selectedReport.description}</p>
                </div>

                <div className="pt-2 space-y-1.5 border-t border-slate-800 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Reporter:</span>
                    <span className="font-bold text-slate-200">{selectedReport.reporter?.name} ({selectedReport.reporter?.email})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Location:</span>
                    <span className="font-medium text-slate-200">{selectedReport.address}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Status:</span>
                    <span className={`font-bold ${getStatusBadgeStyle(selectedReport.status)} px-2 py-0.5 rounded text-[10px]`}>
                      {selectedReport.status}
                    </span>
                  </div>
                </div>

                {/* Location Map */}
                <div className="pt-2">
                  <span className="text-[11px] text-slate-400 block mb-1">Pinned GPS Coordinates:</span>
                  <InteractiveMap
                    markers={[
                      {
                        id: selectedReport.id,
                        title: selectedReport.title,
                        latitude: selectedReport.latitude,
                        longitude: selectedReport.longitude,
                        type: 'REPORT',
                      },
                    ]}
                    height="140px"
                    centerLat={selectedReport.latitude}
                    centerLng={selectedReport.longitude}
                    zoom={14}
                  />
                </div>

                {/* Actions */}
                {selectedReport.status === 'PENDING' && (
                  <div className="pt-3 flex gap-2">
                    <button
                      onClick={() => handleApprove(selectedReport.id)}
                      disabled={actionLoading}
                      className="glass-button-primary text-xs flex-1 py-2"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Verify & Award Points
                    </button>
                    <button
                      onClick={() => {
                        setReportToReject(selectedReport);
                        setShowRejectModal(true);
                      }}
                      disabled={actionLoading}
                      className="glass-button-secondary text-xs py-2 text-rose-300 border-rose-500/30"
                    >
                      <XCircle className="w-4 h-4" /> Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="glass-card p-8 text-center border-slate-800 text-xs text-slate-500">
              Select any waste report from the list to inspect location, photo, and perform verification actions.
            </div>
          )}
        </div>
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-card p-6 max-w-md w-full border-rose-500/30 space-y-4">
            <h3 className="text-base font-bold text-white">Reject Waste Report</h3>
            <p className="text-xs text-slate-400">
              Please specify the reason for rejecting this report. An automated notification will be sent to the reporting citizen.
            </p>

            <textarea
              rows={3}
              placeholder="e.g. Duplicate report, insufficient photo clarity, or private property..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full glass-input text-xs"
            />

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowRejectModal(false)}
                className="glass-button-secondary text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRejectConfirm}
                disabled={actionLoading}
                className="glass-button-primary text-xs bg-rose-500 text-white font-bold"
              >
                {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm Rejection'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function getStatusBadgeStyle(status: string) {
  switch (status) {
    case 'PENDING':
      return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
    case 'VERIFIED':
      return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
    case 'ASSIGNED':
      return 'bg-purple-500/10 text-purple-400 border border-purple-500/20';
    case 'IN_PROGRESS':
      return 'bg-sky-500/10 text-sky-400 border border-sky-500/20 animate-pulse';
    case 'COLLECTED':
    case 'COMPLETED':
      return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
    case 'REJECTED':
      return 'bg-rose-500/10 text-rose-400 border border-rose-500/20';
    default:
      return 'bg-slate-800 text-slate-400';
  }
}

function getSeverityBadgeStyle(severity: string) {
  switch (severity) {
    case 'LOW':
      return 'bg-slate-800 text-slate-300';
    case 'MEDIUM':
      return 'bg-amber-500/10 text-amber-300';
    case 'HIGH':
      return 'bg-orange-500/10 text-orange-300';
    case 'CRITICAL':
      return 'bg-rose-500/20 text-rose-300';
    default:
      return 'bg-slate-800 text-slate-300';
  }
}
