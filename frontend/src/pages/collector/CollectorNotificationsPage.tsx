
import React, { useEffect, useState } from 'react';
import { CollectorLayout } from '../../layouts/CollectorLayout';
import { notificationService } from '../../services/notificationService';
import { AppNotification } from '../../types';
import { Bell, Check, AlertCircle } from 'lucide-react';

export const CollectorNotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await notificationService.getMyNotifications();
      setNotifications(data);
    } catch (err: any) {
      setError(
        err.response?.data?.error ||
          'Failed to fetch dispatch notifications.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id: string) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    } catch (err: any) {
      console.error(err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, isRead: true }))
      );
    } catch (err: any) {
      console.error(err);
    }
  };

  return (
    <CollectorLayout title="Dispatch Notifications">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Notification heading and actions */}
        <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center sm:gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              Collector Alerts &amp; Dispatches
            </h2>
            <p className="text-sm text-slate-500">
              Notifications regarding task assignments and schedule updates.
            </p>
          </div>

          {notifications.some((n) => !n.isRead) && (
            <button
              onClick={handleMarkAllAsRead}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-emerald-700 px-4 py-2 text-xs font-semibold text-white transition hover:bg-emerald-800"
            >
              <Check className="h-4 w-4" />
              Mark All Read
            </button>
          )}
        </div>

        {/* Error message */}
        {error && (
          <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Loading state */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-emerald-600" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="rounded-xl border border-slate-100 bg-white p-12 text-center text-slate-500 shadow-sm">
            No dispatch notifications.
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((n) => (
              <div
                key={n.id}
                className={`flex items-start justify-between gap-4 rounded-xl border bg-white p-5 transition-colors ${
                  n.isRead
                    ? 'border-slate-100'
                    : 'border-emerald-100 shadow-sm hover:border-emerald-200'
                }`}
              >
                <div className="flex min-w-0 items-start gap-3.5">
                  <div
                    className={`shrink-0 rounded-xl p-2.5 ${
                      n.isRead
                        ? 'bg-slate-50 text-slate-500'
                        : 'bg-emerald-50 text-emerald-700'
                    }`}
                  >
                    <Bell className="h-5 w-5" />
                  </div>

                  <div className="min-w-0">
                    <h4 className="text-base font-bold text-slate-800">
                      {n.title}
                    </h4>
                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      {n.message}
                    </p>
                    <span className="mt-2 block text-xs text-slate-400">
                      {new Date(n.createdAt).toLocaleString()}
                    </span>
                    {n.isRead && (
                      <span className="mt-2 inline-block text-xs font-medium text-slate-400">
                        Read
                      </span>
                    )}
                  </div>
                </div>

                {!n.isRead && (
                  <button
                    onClick={() => handleMarkAsRead(n.id)}
                    className="flex shrink-0 items-center gap-1 rounded-lg border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800 transition hover:bg-emerald-100"
                  >
                    <Check className="h-3.5 w-3.5" />
                    Read
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </CollectorLayout>
  );
};
