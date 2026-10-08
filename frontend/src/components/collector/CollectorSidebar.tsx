import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Truck,
  History,
  Bell,
  User,
  ListCheck,
} from 'lucide-react';

interface CollectorSidebarProps {
  unreadNotificationsCount?: number;
}

export function CollectorSidebar({ unreadNotificationsCount = 0 }: CollectorSidebarProps) {
  const location = useLocation();
  const pathname = location.pathname;

  const navItems = [
    { href: '/dashboard/collector', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/dashboard/collector/tasks', label: 'My Tasks', icon: Truck },
    { href: '/dashboard/collector/history', label: 'Task History', icon: History },
    {
      href: '/dashboard/collector/notifications',
      label: 'Notifications',
      icon: Bell,
      badge: unreadNotificationsCount > 0 ? unreadNotificationsCount : undefined,
    },
    { href: '/dashboard/collector/profile', label: 'Profile', icon: User },
  ];

  return (
    <aside className="w-full md:w-64 shrink-0 space-y-6">
      <div className="glass-card p-4 space-y-1.5 border-purple-500/30 bg-slate-900/60 backdrop-blur-md">
        <div className="px-3 py-2 text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-2">
          <Truck className="w-4 h-4 text-purple-400" />
          <span>Collector Portal</span>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== '/dashboard/collector' && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                to={item.href}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-500/20 to-indigo-500/10 text-purple-300 border border-purple-500/30 shadow-md shadow-purple-500/5'
                    : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <item.icon className={`w-4 h-4 ${isActive ? 'text-purple-400' : 'text-slate-400'}`} />
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

      <div className="glass-card p-4 bg-gradient-to-br from-purple-950/40 via-slate-900 to-slate-950 border-purple-500/30 space-y-3">
        <h4 className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
          <ListCheck className="w-3.5 h-3.5" />
          Field Operations
        </h4>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          Open assigned tasks to access map routes, start collection, upload photo proof, and mark tasks completed.
        </p>
        <div className="space-y-2 pt-1">
          <Link
            to="/dashboard/collector/tasks"
            className="w-full glass-button-primary text-xs py-2 justify-center bg-purple-600 text-white font-bold"
          >
            View Active Tasks
          </Link>
        </div>
      </div>
    </aside>
  );
}
