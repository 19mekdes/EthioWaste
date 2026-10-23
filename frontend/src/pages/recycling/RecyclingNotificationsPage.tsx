
import React, { useEffect, useState } from 'react';
import { RecyclingLayout } from '../../layouts/RecyclingLayout';
import { notificationService } from '../../services/notificationService';
import { AppNotification } from '../../types';
import { Bell, Check, AlertCircle } from 'lucide-react';

export const RecyclingNotificationsPage: React.FC = () => {
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
        err.response?.data?.error || 'Failed to fetch facility alerts.'
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
    <RecyclingLayout title="Facility Alerts">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="flex flex-col items-start justify-between gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              Facility Alerts & Dispatches
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Intake notifications and municipal recycling dispatches.
            </p>
          </div>

          {notifications.some((n) => !n.isRead) && (
            <button
              onClick={handleMarkAllAsRead}
              className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-800"
            >
              <Check className="h-4 w-4 text-emerald-700" />
              Mark All Read
            </button>
          )}
        </div>

        {error && (
          <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-emerald-600" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="py-12 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
              <Bell className="h-6 w-6" />
            </div>
            <p className="font-medium text-slate-700">
              No facility alerts.
            </p>
            <p className="mt-1 text-sm text-slate-500">
              New notifications will appear here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-200">
            {notifications.map((n) => (
              <article
                key={n.id}
                className={`flex items-start justify-between gap-4 py-5 transition ${
                  n.isRead ? 'opacity-75' : ''
                }`}
              >
                <div className="flex min-w-0 items-start gap-3">
                  <div
                    className={`shrink-0 rounded-lg p-2.5 ${
                      n.isRead
                        ? 'bg-slate-100 text-slate-500'
                        : 'bg-emerald-50 text-emerald-700'
                    }`}
                  >
                    <Bell className="h-5 w-5" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="font-semibold text-slate-800">
                        {n.title}
                      </h4>

                      {!n.isRead && (
                        <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-800">
                          New
                        </span>
                      )}
                    </div>

                    <p className="mt-1 break-words text-sm leading-6 text-slate-600">
                      {n.message}
                    </p>

                    <span className="mt-2 block text-xs text-slate-500">
                      {new Date(n.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>

                {!n.isRead && (
                  <button
                    onClick={() => handleMarkAsRead(n.id)}
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-emerald-200 px-3 py-2 text-xs font-semibold text-emerald-800 transition hover:bg-emerald-50"
                  >
                    <Check className="h-3.5 w-3.5" />
                    Read
                  </button>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </RecyclingLayout>
  );
};
