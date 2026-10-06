'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  Truck,
  ListCheck,
  Users,
  UserCheck,
  Factory,
  MapPin,
  MessageSquare,
  Star,
  BarChart3,
  Shield,
  PlusCircle,
} from 'lucide-react';

export function AdminSidebar() {
  const pathname = usePathname();

  const navItems = [
    { href: '/dashboard/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/dashboard/admin/reports', label: 'Waste Reports', icon: FileText },
    { href: '/dashboard/admin/requests', label: 'Collection Requests', icon: Truck },
    { href: '/dashboard/admin/tasks', label: 'Collection Tasks', icon: ListCheck },
    { href: '/dashboard/admin/users', label: 'Users', icon: Users },
    { href: '/dashboard/admin/collectors', label: 'Collectors', icon: UserCheck },
    { href: '/dashboard/admin/recycling-organizations', label: 'Recycling Orgs', icon: Factory },
    { href: '/dashboard/admin/centers', label: 'Recycling Centers', icon: MapPin },
    { href: '/dashboard/admin/complaints', label: 'Complaints', icon: MessageSquare },
    { href: '/dashboard/admin/feedback', label: 'Feedback', icon: Star },
    { href: '/dashboard/admin/analytics', label: 'Reports & Analytics', icon: BarChart3 },
  ];

  return (
    <aside className="w-full md:w-64 shrink-0 space-y-6">
      <div className="glass-card p-4 space-y-1.5 border-amber-500/30 bg-slate-900/60 backdrop-blur-md">
        <div className="px-3 py-2 text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
          <Shield className="w-4 h-4 text-amber-400" />
          <span>Municipal Control</span>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== '/dashboard/admin' && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/10 text-amber-400 border border-amber-500/30 shadow-md shadow-amber-500/5'
                    : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <item.icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="glass-card p-4 bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-950 border-amber-500/30 space-y-3">
        <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
          <Shield className="w-3.5 h-3.5" />
          Dispatch Center
        </h4>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          Verify citizen reports, approve bulk collection requests, and assign collectors.
        </p>
        <div className="space-y-2 pt-1">
          <Link
            href="/dashboard/admin/requests"
            className="w-full glass-button-primary text-xs py-2 justify-center bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold"
          >
            Dispatch Work Queue
          </Link>
        </div>
      </div>
    </aside>
  );
}
