'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Bell,
  CheckCircle2,
  Info,
  AlertTriangle,
  CheckCheck,
  Clock,
  Loader2,
} from 'lucide-react';
import { markNotificationAsRead, markAllNotificationsAsRead } from '@/actions/notifications';

interface RecyclingNotificationsFeedProps {
  notifications: any[];
  unreadCount: number;
}

export function RecyclingNotificationsFeed({
  notifications: initialNotifications,
  unreadCount: initialUnreadCount,
}: RecyclingNotificationsFeedProps) {
  const router = useRouter();
  const [notifications, setNotifications] = useState(initialNotifications);
  const [unreadCount, setUnreadCount] = useState(initialUnreadCount);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [markingAll, setMarkingAll] = useState(false);

  const handleMarkAsRead = async (id: string) => {
    setLoadingId(id);
    const res = await markNotificationAsRead(id);
    setLoadingId(null);

    if (res.success) {
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
      router.refresh();
    }
  };

  const handleMarkAllAsRead = async () => {
    setMarkingAll(true);
    const res = await markAllNotificationsAsRead();
    setMarkingAll(false);

    if (res.success) {
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
      router.refresh();
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="glass-card p-6 bg-slate-900/60 border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Bell className="w-6 h-6 text-emerald-400" />
            Facility Notifications Feed
          </h1>
          <p className="text-xs text-slate-400">
            Real-time notifications regarding incoming waste batches, transfer handoffs, and municipal alerts.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            disabled={markingAll}
            className="glass-button-secondary text-xs py-2 px-3.5 text-emerald-300 border-emerald-500/30 flex items-center gap-1.5 shrink-0"
          >
            {markingAll ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCheck className="w-3.5 h-3.5" />}
            <span>Mark All as Read ({unreadCount})</span>
          </button>
        )}
      </div>

      {/* Notifications List */}
      {notifications.length === 0 ? (
        <div className="glass-card p-12 text-center border-slate-800 space-y-2">
          <Bell className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-slate-200">No Notifications</h3>
          <p className="text-xs text-slate-400 max-w-xs mx-auto">
            Your recycling facility does not have any notifications at this time.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => {
            const isUnread = !n.isRead;
            const isUpdating = loadingId === n.id;

            return (
              <div
                key={n.id}
                className={`glass-card p-4 border-slate-800 transition-all ${
                  isUnread
                    ? 'bg-emerald-950/20 border-emerald-500/30 shadow-md shadow-emerald-500/5'
                    : 'bg-slate-900/40 opacity-80'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">{getNotificationIcon(n.type)}</div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-100">{n.title}</h4>
                        {isUnread && (
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
                        )}
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">{n.message}</p>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1 pt-1 font-mono">
                        <Clock className="w-3 h-3 text-slate-500" />
                        <span>{new Date(n.createdAt).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {isUnread && (
                    <button
                      onClick={() => handleMarkAsRead(n.id)}
                      disabled={isUpdating}
                      className="glass-button-secondary text-[11px] py-1 px-2.5 text-slate-300 hover:text-white shrink-0 flex items-center gap-1"
                    >
                      {isUpdating ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      )}
                      <span>Mark Read</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function getNotificationIcon(type: string) {
  switch (type) {
    case 'SUCCESS':
      return (
        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center shrink-0">
          <CheckCircle2 className="w-4 h-4" />
        </div>
      );
    case 'WARNING':
      return (
        <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center shrink-0">
          <AlertTriangle className="w-4 h-4" />
        </div>
      );
    default:
      return (
        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center shrink-0">
          <Info className="w-4 h-4" />
        </div>
      );
  }
}
