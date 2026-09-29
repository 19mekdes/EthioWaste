'use client';

import React, { useState } from 'react';
import { Shield, CheckCircle2, XCircle, UserCheck, AlertTriangle, Loader2, MapPin, Award } from 'lucide-react';
import { validateAndApproveReport, rejectReport } from '@/actions/admin';
import { getSeverityBadge, getStatusBadge } from '@/lib/utils';
import { TaskAssignmentModal } from './TaskAssignmentModal';

export interface AdminReportItem {
  id: string;
  title: string;
  description: string;
  category: string;
  severity: string;
  status: string;
  imageUrl: string;
  cleanupImageUrl?: string | null;
  latitude: number;
  longitude: number;
  address?: string | null;
  createdAt: string | Date;
  reporter: { id: string; name: string; email: string; avatarUrl?: string | null };
  assignedTo?: { id: string; name: string; avatarUrl?: string | null } | null;
}

interface ReportValidationQueueProps {
  reports: AdminReportItem[];
  collectors: any[];
  onRefresh: () => void;
}

export function ReportValidationQueue({ reports, collectors, onRefresh }: ReportValidationQueueProps) {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [assigningReport, setAssigningReport] = useState<AdminReportItem | null>(null);
  const [filter, setFilter] = useState<'PENDING' | 'ALL'>('PENDING');

  const filteredReports = reports.filter((r) => {
    if (filter === 'PENDING') return r.status === 'PENDING';
    return true;
  });

  const handleApprove = async (reportId: string) => {
    setLoadingId(reportId);
    await validateAndApproveReport(reportId, 50);
    setLoadingId(null);
    onRefresh();
  };

  const handleReject = async (reportId: string) => {
    setLoadingId(reportId);
    await rejectReport(reportId);
    setLoadingId(null);
    onRefresh();
  };

  return (
    <div className="glass-card p-6 space-y-5">
      {/* Assignment Modal */}
      {assigningReport && (
        <TaskAssignmentModal
          reportId={assigningReport.id}
          reportTitle={assigningReport.title}
          collectors={collectors}
          onSuccess={() => {
            setAssigningReport(null);
            onRefresh();
          }}
          onClose={() => setAssigningReport(null)}
        />
      )}

      {/* Header & Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <Shield className="w-5 h-5 text-amber-400" />
            Citizen Report Validation & Task Dispatch Queue
          </h3>
          <p className="text-xs text-slate-400">Validate citizen waste logs, award +50 Eco-Points, or delegate to field staff</p>
        </div>

        <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setFilter('PENDING')}
            className={`text-xs px-3 py-1.5 rounded-lg font-bold transition-all ${
              filter === 'PENDING' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Pending Review ({reports.filter((r) => r.status === 'PENDING').length})
          </button>
          <button
            onClick={() => setFilter('ALL')}
            className={`text-xs px-3 py-1.5 rounded-lg font-bold transition-all ${
              filter === 'ALL' ? 'bg-slate-800 text-slate-200' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All Reports ({reports.length})
          </button>
        </div>
      </div>

      {/* Queue List */}
      {filteredReports.length === 0 ? (
        <div className="text-center py-10 text-xs text-slate-400 border border-dashed border-slate-800 rounded-xl">
          No reports pending validation. Clean slate! 🎉
        </div>
      ) : (
        <div className="space-y-4">
          {filteredReports.map((report) => {
            const isLoading = loadingId === report.id;

            return (
              <div
                key={report.id}
                className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  <img
                    src={report.imageUrl}
                    alt={report.title}
                    className="w-20 h-20 rounded-xl object-cover border border-slate-800 shrink-0"
                  />

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold uppercase ${getSeverityBadge(report.severity)}`}>
                        {report.severity}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-bold uppercase">
                        {report.category}
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold uppercase ${getStatusBadge(report.status)}`}>
                        {report.status}
                      </span>
                    </div>

                    <h4 className="font-bold text-sm text-slate-100">{report.title}</h4>
                    <p className="text-xs text-slate-400 line-clamp-1">{report.description}</p>

                    <div className="flex items-center gap-4 text-[11px] text-slate-500 pt-1">
                      <span>Reporter: {report.reporter?.name || 'Anonymous'}</span>
                      {report.address && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          {report.address}
                        </span>
                      )}
                      {report.assignedTo && (
                        <span className="text-sky-400 font-medium">Assigned to {report.assignedTo.name}</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-slate-800">
                  <button
                    onClick={() => handleApprove(report.id)}
                    disabled={isLoading}
                    className="glass-button-primary text-xs py-2 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 shadow-emerald-600/20"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Award className="w-3.5 h-3.5 text-amber-300" />
                        <span>Validate & Award +50 PTS</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => setAssigningReport(report)}
                    className="glass-button-secondary text-xs py-2 text-sky-300 border-sky-500/30 hover:bg-sky-500/10"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Assign Field Staff</span>
                  </button>

                  <button
                    onClick={() => handleReject(report.id)}
                    disabled={isLoading}
                    className="p-2 rounded-xl text-rose-400 hover:bg-rose-500/10 border border-rose-500/20"
                    title="Reject Report"
                  >
                    <XCircle className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
