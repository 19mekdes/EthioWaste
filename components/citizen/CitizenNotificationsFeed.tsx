'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, CheckCheck, Clock, Info, CheckCircle2, AlertTriangle, ListCheck, ShieldAlert, Loader2 } from 'lucide-react';
import { markNotificationAsRead, markAllNotificationsAsRead } from '@/actions/notifications';

interface CitizenNotificationsFeedProps {
  initialNotifications: any[];
  initialUnreadCount: number;
}

export function CitizenNotificationsFeed({
  initialNotifications,
  initialUnreadCount,
}: CitizenNotificationsFeedProps) {
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
      setUnreadCount((c) => Math.max(0, c - 1));
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
      <div className="glass-card p-6 bg-slate-900/60 border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Bell className="w-6 h-6 text-amber-400" />
            Notifications Feed
          </h1>
          <p className="text-xs text-slate-400">
            Real-time automated alerts on your waste reports, collection status updates, and eco-rewards.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            disabled={markingAll}
            className="glass-button-secondary text-xs py-2 px-3.5 flex items-center gap-1.5"
          >
            {markingAll ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />}
            <span>Mark All as Read ({unreadCount})</span>
          </button>
        )}
      </div>

      {/* List */}
      {notifications.length === 0 ? (
        <div className="glass-card p-12 text-center border-slate-800 space-y-3">
          <Bell className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-slate-200">No Notifications</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            You do not have any notifications in your inbox yet. Alerts will appear here automatically as your requests progress.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`glass-card p-4 border transition-all flex items-start justify-between gap-4 ${
                !n.isRead
                  ? 'bg-amber-500/10 border-amber-500/30'
                  : 'bg-slate-900/60 border-slate-800/80'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div className={`p-2.5 rounded-xl shrink-0 mt-0.5 ${getNotificationIconBg(n.type)}`}>
                  {getNotificationIcon(n.type)}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-bold text-slate-100">{n.title}</h3>
                    {!n.isRead && (
                      <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                        NEW
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{n.message}</p>
                  <div className="flex items-center gap-2 text-[10px] text-slate-500 pt-1">
                    <Clock className="w-3 h-3" />
                    <span>{new Date(n.createdAt).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {!n.isRead && (
                <button
                  onClick={() => handleMarkAsRead(n.id)}
                  disabled={loadingId === n.id}
                  className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all shrink-0"
                >
                  {loadingId === n.id ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Mark Read'}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function getNotificationIcon(type: string) {
  switch (type) {
    case 'SUCCESS':
      return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
    case 'WARNING':
      return <AlertTriangle className="w-4 h-4 text-amber-400" />;
    case 'TASK':
      return <ListCheck className="w-4 h-4 text-sky-400" />;
    case 'SYSTEM':
      return <ShieldAlert className="w-4 h-4 text-purple-400" />;
    default:
      return <Info className="w-4 h-4 text-blue-400" />;
  }
}

function getNotificationIconBg(type: string) {
  switch (type) {
    case 'SUCCESS':
      return 'bg-emerald-500/10 border border-emerald-500/20';
    case 'WARNING':
      return 'bg-amber-500/10 border border-amber-500/20';
    case 'TASK':
      return 'bg-sky-500/10 border border-sky-500/20';
    case 'SYSTEM':
      return 'bg-purple-500/10 border border-purple-500/20';
    default:
      return 'bg-blue-500/10 border border-blue-500/20';
  }
}
