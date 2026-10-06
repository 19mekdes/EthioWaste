'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Recycle,
  Boxes,
  FileCheck2,
  History,
  Bell,
  Building2,
  ListCheck,
  CheckCircle2,
} from 'lucide-react';

interface RecyclingSidebarProps {
  unreadNotificationsCount?: number;
}

export function RecyclingSidebar({ unreadNotificationsCount = 0 }: RecyclingSidebarProps) {
  const pathname = usePathname();

  const navItems = [
    { href: '/dashboard/recycling', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/dashboard/recycling/materials', label: 'Available Materials', icon: Boxes },
    { href: '/dashboard/recycling/records', label: 'Recycling Records', icon: FileCheck2 },
    { href: '/dashboard/recycling/history', label: 'Processing History', icon: History },
    {
      href: '/dashboard/recycling/notifications',
      label: 'Notifications',
      icon: Bell,
      badge: unreadNotificationsCount > 0 ? unreadNotificationsCount : undefined,
    },
    { href: '/dashboard/recycling/profile', label: 'Facility Profile', icon: Building2 },
  ];

  return (
    <aside className="w-full md:w-64 shrink-0 space-y-6">
      <div className="glass-card p-4 space-y-1.5 border-emerald-500/30 bg-slate-900/60 backdrop-blur-md">
        <div className="px-3 py-2 text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
          <Recycle className="w-4 h-4 text-emerald-400" />
          <span>Recycling Portal</span>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== '/dashboard/recycling' && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/10 text-emerald-300 border border-emerald-500/30 shadow-md shadow-emerald-500/5'
                    : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <item.icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
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

      {/* Operational Help Card */}
      <div className="glass-card p-4 bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-950 border-emerald-500/30 space-y-3">
        <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
          <ListCheck className="w-3.5 h-3.5" />
          Material Lifecycle
        </h4>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          Receive collected waste, accept into inventory, process at facility, and record final recycled quantities.
        </p>
        <div className="space-y-2 pt-1">
          <Link
            href="/dashboard/recycling/materials"
            className="w-full glass-button-primary text-xs py-2 justify-center bg-emerald-600 text-white font-bold"
          >
            Receive Incoming Waste
          </Link>
        </div>
      </div>
    </aside>
  );
}
