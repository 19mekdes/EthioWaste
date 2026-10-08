import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  PlusCircle,
  FileText,
  ListOrdered,
  MapPin,
  Bell,
  MessageSquare,
  Star,
  Recycle,
  AlertTriangle,
} from 'lucide-react';

interface CitizenSidebarProps {
  unreadNotificationsCount?: number;
}

export function CitizenSidebar({ unreadNotificationsCount = 0 }: CitizenSidebarProps) {
  const location = useLocation();
  const pathname = location.pathname;

  const navItems = [
    { href: '/citizen/overview', label: 'Overview', icon: LayoutDashboard },
    { href: '/citizen/report-waste', label: 'Report Waste', icon: AlertTriangle, highlight: true },
    { href: '/citizen/my-reports', label: 'My Reports', icon: FileText },
    { href: '/citizen/request-collection', label: 'Request Collection', icon: PlusCircle },
    { href: '/citizen/my-requests', label: 'My Requests', icon: ListOrdered },
    { href: '/citizen/centers', label: 'Collection Points', icon: MapPin },
    {
      href: '/citizen/notifications',
      label: 'Notifications',
      icon: Bell,
      badge: unreadNotificationsCount > 0 ? unreadNotificationsCount : undefined,
    },
    { href: '/citizen/complaints', label: 'Complaints', icon: MessageSquare },
    { href: '/citizen/feedback', label: 'Feedback', icon: Star },
  ];

  return (
    <aside className="w-full md:w-64 shrink-0 space-y-6">
      <div className="glass-card p-4 space-y-1.5 border-slate-800 bg-slate-900/60 backdrop-blur-md">
        <div className="px-3 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
          <Recycle className="w-3.5 h-3.5 text-emerald-400" />
          <span>Citizen Portal</span>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== '/dashboard/citizen' && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                to={item.href}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/10 text-emerald-400 border border-emerald-500/30 shadow-md shadow-emerald-500/5'
                    : item.highlight
                    ? 'text-amber-300 hover:bg-amber-500/10 hover:text-amber-200 border border-amber-500/20'
                    : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <item.icon
                    className={`w-4 h-4 ${
                      isActive
                        ? 'text-emerald-400'
                        : item.highlight
                        ? 'text-amber-400'
                        : 'text-slate-400'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500 text-white animate-pulse">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="glass-card p-4 bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-950 border-emerald-500/30 space-y-3">
        <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
          <PlusCircle className="w-3.5 h-3.5" />
          Quick Actions
        </h4>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          Spotted illegal dumping or need a bulk waste collection? Submit a report in under 60 seconds.
        </p>
        <div className="space-y-2 pt-1">
          <Link
            to="/citizen/report-waste"
            className="w-full glass-button-primary text-xs py-2 justify-center"
          >
            Report Waste Issue
          </Link>
          <Link
            to="/citizen/request-collection"
            className="w-full glass-button-secondary text-xs py-2 justify-center"
          >
            Request Collection
          </Link>
        </div>
      </div>
    </aside>
  );
}
