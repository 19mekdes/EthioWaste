import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { reportService } from '../../services/reportService';
import { WasteReport } from '../../types';
import { FileText, PlusCircle, Search, MapPin, Calendar, Tag } from 'lucide-react';

export const MyReportsPage: React.FC = () => {
  const [reports, setReports] = useState<WasteReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');

  useEffect(() => {
    async function loadReports() {
      setLoading(true);
      try {
        const res = await reportService.getMyReports();
        setReports(Array.isArray(res) ? res : (res as any)?.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadReports();
  }, []);

  const filteredReports = useMemo(() => {
    return reports
      .filter((report) => {
        if (statusFilter !== 'ALL' && report.status !== statusFilter) return false;
        if (categoryFilter !== 'ALL' && (report.category || report.wasteType) !== categoryFilter) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = (report.title || '').toLowerCase().includes(q);
          const matchDesc = (report.description || '').toLowerCase().includes(q);
          const matchAddress = (report.address || '').toLowerCase().includes(q);
          const matchId = (report.id || '').toLowerCase().includes(q);
          if (!matchTitle && !matchDesc && !matchAddress && !matchId) return false;
        }
        return true;
      })
      .sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return sortBy === 'newest' ? dateB - dateA : dateA - dateB;
      });
  }, [reports, statusFilter, categoryFilter, searchQuery, sortBy]);

  if (loading) {
    return (
      <div className="py-12 flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="glass-card p-6 bg-slate-900/60 border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-emerald-400" />
            My Waste Reports
          </h1>
          <p className="text-xs text-slate-400">
            Track all submitted waste and illegal dumping issues in Addis Ababa and monitor verification status.
          </p>
        </div>
        <Link to="/citizen/report-waste" className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 transition">
          <PlusCircle className="w-4 h-4" />
          Submit New Report
        </Link>
      </div>

      {/* Filter Controls Bar */}
      <div className="glass-card p-4 border-slate-800 bg-slate-900/40 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search reports or locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100"
            />
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100"
            >
              <option value="ALL">All Statuses</option>
              <option value="PENDING">PENDING (Awaiting Review)</option>
              <option value="VERIFIED">VERIFIED (Approved)</option>
              <option value="ASSIGNED">ASSIGNED (Collector Assigned)</option>
              <option value="IN_PROGRESS">IN_PROGRESS (Cleanup active)</option>
              <option value="COMPLETED">COMPLETED (Resolved)</option>
              <option value="REJECTED">REJECTED</option>
            </select>
          </div>

          <div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100"
            >
              <option value="ALL">All Waste Categories</option>
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
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100"
            >
              <option value="newest">Sort: Newest First</option>
              <option value="oldest">Sort: Oldest First</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-400 px-1 pt-1 border-t border-slate-800/60">
          <span>Showing {filteredReports.length} of {reports.length} reports</span>
          {(statusFilter !== 'ALL' || categoryFilter !== 'ALL' || searchQuery !== '') && (
            <button
              onClick={() => {
                setStatusFilter('ALL');
                setCategoryFilter('ALL');
                setSearchQuery('');
              }}
              className="text-emerald-400 hover:underline text-xs"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Reports List */}
      {filteredReports.length === 0 ? (
        <div className="glass-card p-12 text-center border-slate-800 space-y-3">
          <FileText className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-slate-200">No Reports Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {reports.length === 0
              ? "You haven't submitted any waste or illegal dumping reports yet."
              : 'No reports match your selected search or filter criteria.'}
          </p>
          {reports.length === 0 && (
            <div className="pt-2">
              <Link to="/citizen/report-waste" className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs inline-flex">
                Submit Your First Waste Report
              </Link>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredReports.map((report) => (
            <div
              key={report.id}
              className="glass-card p-4 border border-slate-800 bg-slate-900/60 hover:border-emerald-500/40 transition-all space-y-3 flex flex-col justify-between rounded-2xl"
            >
              <div className="space-y-2.5">
                <div className="flex items-start gap-3">
                  <img
                    src={report.imageUrl || (report.photos && report.photos[0]) || 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=400&q=80'}
                    alt={report.title || 'Waste report photo'}
                    className="w-16 h-16 rounded-xl object-cover border border-slate-700 shrink-0 bg-slate-950"
                  />
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-slate-100 truncate">{report.title || `${report.wasteType || report.category || 'Waste'} Site`}</span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${getStatusBadgeStyle(report.status)}`}>
                        {report.status}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium flex items-center gap-1">
                        <Tag className="w-3 h-3 text-emerald-400" />
                        {report.category || report.wasteType || 'GENERAL'}
                      </span>
                      {report.severity && (
                        <span className={`px-2 py-0.5 rounded font-medium ${getSeverityStyle(report.severity)}`}>
                          {report.severity}
                        </span>
                      )}
                      {report.isIllegalDumping && (
                        <span className="px-2 py-0.5 rounded font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                          Illegal Dumping
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                  {report.description}
                </p>

                <div className="pt-2 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-[11px] text-slate-400">
                  <div className="flex items-center gap-1.5 truncate">
                    <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span className="truncate">{report.address || 'Geo-pinned'}</span>
                  </div>
                  <div className="flex items-center gap-1.5 justify-end">
                    <Calendar className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span>{new Date(report.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between text-[10px] text-slate-500 border-t border-slate-800/40">
                <span className="font-mono">ID: #{report.id.slice(-8)}</span>
                {report.resolvedAt && (
                  <span className="text-emerald-400 font-semibold">
                    Resolved: {new Date(report.resolvedAt).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

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

function getSeverityStyle(severity: string) {
  switch (severity) {
    case 'LOW':
      return 'bg-slate-800 text-slate-300';
    case 'MEDIUM':
      return 'bg-amber-500/10 text-amber-300 border border-amber-500/20';
    case 'HIGH':
      return 'bg-orange-500/10 text-orange-300 border border-orange-500/20';
    case 'CRITICAL':
      return 'bg-rose-500/20 text-rose-300 border border-rose-500/30';
    default:
      return 'bg-slate-800 text-slate-300';
  }
}
