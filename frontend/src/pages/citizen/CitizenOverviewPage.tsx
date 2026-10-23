
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { citizenService } from '../../services/citizenService';
import { CitizenLayout } from '../../layouts/CitizenLayout';
import {
  FileText,
  Truck,
  Clock,
  CheckCircle2,
  AlertTriangle,
  PlusCircle,
  Bell,
  ChevronRight,
  MapPin,
  Calendar,
} from 'lucide-react';

export const CitizenOverviewPage: React.FC = () => {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{
    stats: {
      totalReports: number;
      pendingReports: number;
      activeCollectionRequests: number;
      completedCollections: number;
      unreadNotificationsCount: number;
    };
    recentNotifications: any[];
    recentReports: any[];
    recentRequests: any[];
  }>({
    stats: {
      totalReports: 0,
      pendingReports: 0,
      activeCollectionRequests: 0,
      completedCollections: 0,
      unreadNotificationsCount: 0,
    },
    recentNotifications: [],
    recentReports: [],
    recentRequests: [],
  });

  useEffect(() => {
    async function loadStats() {
      setLoading(true);
      try {
        const res: any = await citizenService.getDashboardStats();

        if (res && res.stats) {
          setData(res);
        } else if (res && res.data && res.data.stats) {
          setData(res.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  if (loading) {
    return (
      <CitizenLayout>
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-emerald-600" />
        </div>
      </CitizenLayout>
    );
  }

  const { stats, recentNotifications, recentReports, recentRequests } = data;

  const cardClass =
    'rounded-2xl border border-slate-200 bg-white p-5 shadow-sm';

  const linkClass =
    'flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-800';

  const smallHeadingClass =
    'flex items-center gap-2 text-sm font-bold text-slate-800';

  const mutedTextClass = 'text-xs text-slate-500';

  return (
    <CitizenLayout>
      <div className="space-y-6">
        {/* Welcome Banner */}
        <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-emerald-100 bg-[#E8F3E7] p-5 sm:p-6 md:flex-row md:items-center">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-lg font-bold text-white sm:h-14 sm:w-14 sm:text-xl">
              {user?.name ? user.name.charAt(0) : 'U'}
            </div>

            <div>
              <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-emerald-800">
                Citizen Dashboard
              </div>

              <h1 className="text-xl font-bold text-slate-800 sm:text-2xl">
                Welcome back, {user?.name ? user.name.split(' ')[0] : 'Citizen'}!
              </h1>

              <p className="mt-1 max-w-2xl text-xs leading-5 text-slate-600 sm:text-sm">
                Track your waste reports, manage collection requests, and
                monitor cleanup activities.
              </p>
            </div>
          </div>

          <div className="flex w-full flex-wrap gap-2 sm:flex-nowrap md:w-auto">
            <Link
              to="/citizen/report-waste"
              className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-white px-4 py-2.5 text-xs font-semibold text-emerald-800 transition hover:bg-emerald-50 sm:flex-none"
            >
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <span>Report Waste</span>
            </Link>

            <Link
              to="/citizen/request-collection"
              className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-emerald-700 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-emerald-800 sm:flex-none"
            >
              <PlusCircle className="h-4 w-4 shrink-0" />
              <span>Request Pickup</span>
            </Link>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          <div className={cardClass}>
            <div className="mb-3 flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-slate-500">
                Total Reports
              </span>
              <div className="rounded-lg bg-emerald-50 p-2 text-emerald-700">
                <FileText className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-slate-800">
              {stats.totalReports}
            </div>
            <p className="mt-1 text-xs leading-5 text-slate-500">
              Submitted waste reports
            </p>
          </div>

          <div className={cardClass}>
            <div className="mb-3 flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-slate-500">
                Pending Reports
              </span>
              <div className="rounded-lg bg-amber-50 p-2 text-amber-700">
                <Clock className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-amber-700">
              {stats.pendingReports}
            </div>
            <p className="mt-1 text-xs leading-5 text-slate-500">
              Awaiting verification
            </p>
          </div>

          <div className={cardClass}>
            <div className="mb-3 flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-slate-500">
                Active Requests
              </span>
              <div className="rounded-lg bg-sky-50 p-2 text-sky-700">
                <Truck className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-sky-700">
              {stats.activeCollectionRequests}
            </div>
            <p className="mt-1 text-xs leading-5 text-slate-500">
              Collection requests in progress
            </p>
          </div>

          <div className={cardClass}>
            <div className="mb-3 flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-slate-500">
                Completed
              </span>
              <div className="rounded-lg bg-emerald-50 p-2 text-emerald-700">
                <CheckCircle2 className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-emerald-700">
              {stats.completedCollections}
            </div>
            <p className="mt-1 text-xs leading-5 text-slate-500">
              Completed collections
            </p>
          </div>
        </div>

        {/* Recent Reports and Collection Requests */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {/* Recent Waste Reports */}
          <div className={`${cardClass} space-y-4`}>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className={smallHeadingClass}>
                <FileText className="h-4 w-4 text-emerald-700" />
                Recent Waste Reports
              </h3>

              <Link to="/citizen/my-reports" className={linkClass}>
                View All <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {recentReports.length === 0 ? (
              <div className="space-y-2 py-8 text-center">
                <FileText className="mx-auto h-8 w-8 text-slate-300" />
                <p className={mutedTextClass}>
                  No waste reports submitted yet.
                </p>
                <Link
                  to="/citizen/report-waste"
                  className="text-xs font-medium text-emerald-700 underline"
                >
                  Submit your first report
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {recentReports.map((report) => (
                  <div
                    key={report.id}
                    className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 bg-[#FAFCF9] p-3.5"
                  >
                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="truncate text-xs font-bold text-slate-800">
                          {report.title ||
                            `${report.wasteType || report.category || 'Waste'} Site`}
                        </span>

                        {report.isIllegalDumping && (
                          <span className="rounded border border-rose-200 bg-rose-50 px-1.5 py-0.5 text-[10px] font-semibold text-rose-700">
                            Illegal Dumping
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {report.address || 'Geo-pinned'}
                        </span>
                        <span>•</span>
                        <span>
                          {new Date(report.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <span
                      className={`shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-semibold ${getStatusBadgeStyle(report.status)}`}
                    >
                      {report.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Collection Requests */}
          <div className={`${cardClass} space-y-4`}>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className={smallHeadingClass}>
                <Truck className="h-4 w-4 text-sky-700" />
                Recent Collection Requests
              </h3>

              <Link
                to="/citizen/my-requests"
                className="flex items-center gap-1 text-xs font-semibold text-sky-700 hover:text-sky-800"
              >
                View All <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {recentRequests.length === 0 ? (
              <div className="space-y-2 py-8 text-center">
                <Truck className="mx-auto h-8 w-8 text-slate-300" />
                <p className={mutedTextClass}>
                  No collection requests created yet.
                </p>
                <Link
                  to="/citizen/request-collection"
                  className="text-xs font-medium text-sky-700 underline"
                >
                  Request a waste pickup
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {recentRequests.map((req) => (
                  <Link
                    key={req.id}
                    to={`/citizen/requests/${req.id}`}
                    className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 bg-[#FAFCF9] p-3.5 transition hover:border-sky-200 hover:bg-sky-50/40"
                  >
                    <div className="min-w-0 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-bold text-slate-800">
                          {req.wasteType} Waste
                        </span>
                        {req.estimatedQuantity && (
                          <span className="text-[10px] text-slate-500">
                            ({req.estimatedQuantity})
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(req.preferredDate).toLocaleDateString()}
                        </span>
                        <span>•</span>
                        <span>{req.address}</span>
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                      <span
                        className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold ${getStatusBadgeStyle(req.status)}`}
                      >
                        {req.status}
                      </span>
                      <ChevronRight className="h-4 w-4 text-slate-400" />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Notifications */}
        <div className={`${cardClass} space-y-4`}>
          <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <h3 className={smallHeadingClass}>
              <Bell className="h-4 w-4 text-amber-600" />
              Recent Notifications
            </h3>

            <Link
              to="/citizen/notifications"
              className="flex items-center gap-1 text-xs font-semibold text-amber-700 hover:text-amber-800"
            >
              <span>
                Notifications ({stats.unreadNotificationsCount} unread)
              </span>
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {recentNotifications.length === 0 ? (
            <div className="py-6 text-center text-xs text-slate-500">
              No notifications yet. You will receive updates as your reports
              and requests progress.
            </div>
          ) : (
            <div className="space-y-2.5">
              {recentNotifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`flex items-start justify-between gap-3 rounded-xl border p-3.5 ${
                    !notif.isRead
                      ? 'border-amber-200 bg-amber-50'
                      : 'border-slate-100 bg-[#FAFCF9]'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="text-xs font-bold text-slate-800">
                      {notif.title}
                    </div>
                    <div className="text-xs leading-5 text-slate-600">
                      {notif.message}
                    </div>
                    <div className="pt-1 text-[10px] text-slate-500">
                      {new Date(notif.createdAt).toLocaleString()}
                    </div>
                  </div>

                  {!notif.isRead && (
                    <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-amber-500" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </CitizenLayout>
  );
};

function getStatusBadgeStyle(status: string) {
  switch (status) {
    case 'PENDING':
      return 'border-amber-200 bg-amber-50 text-amber-800';
    case 'VERIFIED':
    case 'APPROVED':
      return 'border-blue-200 bg-blue-50 text-blue-800';
    case 'ASSIGNED':
      return 'border-purple-200 bg-purple-50 text-purple-800';
    case 'IN_PROGRESS':
      return 'border-sky-200 bg-sky-50 text-sky-800';
    case 'COLLECTED':
    case 'COMPLETED':
      return 'border-emerald-200 bg-emerald-50 text-emerald-800';
    case 'REJECTED':
      return 'border-rose-200 bg-rose-50 text-rose-800';
    default:
      return 'border-slate-200 bg-slate-100 text-slate-600';
  }
}
