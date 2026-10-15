import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
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
  ChevronDown,
} from 'lucide-react';

export function AdminSidebar() {
  const [mobileExpanded, setMobileExpanded] = useState(false);
  const location = useLocation();
  const pathname = location.pathname;

  const navItems = [
    { href: '/admin/overview', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/reports', label: 'Waste Reports', icon: FileText },
    { href: '/admin/requests', label: 'Collection Requests', icon: Truck },
    { href: '/admin/tasks', label: 'Collection Tasks', icon: ListCheck },
    { href: '/admin/users', label: 'Users', icon: Users },
    { href: '/admin/collectors', label: 'Collectors', icon: UserCheck },
    { href: '/admin/recycling-orgs', label: 'Recycling Orgs', icon: Factory },
    { href: '/admin/centers', label: 'Recycling Centers', icon: MapPin },
    { href: '/admin/complaints', label: 'Complaints', icon: MessageSquare },
    { href: '/admin/feedback', label: 'Feedback', icon: Star },
    { href: '/admin/analytics', label: 'Reports & Analytics', icon: BarChart3 },
  ];

  const currentItem = navItems.find(
    (item) => pathname === item.href || (item.href !== '/admin/overview' && pathname.startsWith(item.href))
  ) || navItems[0];

  const renderNavLinks = () => (
    <nav className="space-y-1">
      {navItems.map((item) => {
        const isActive =
          pathname === item.href ||
          (item.href !== '/admin/overview' && pathname.startsWith(item.href));

        return (
          <Link
            key={item.href}
            to={item.href}
            onClick={() => setMobileExpanded(false)}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              isActive
                ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/10 text-amber-400 border border-amber-500/30 shadow-md shadow-amber-500/5'
                : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <item.icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
              <span>{item.label}</span>
            </div>
          </Link>
        );
      })}
    </nav>
  );

  return (
    <aside className="w-full md:w-64 shrink-0">
      {/* Mobile Collapsible Subnav Bar */}
      <div className="md:hidden mb-4">
        <button
          type="button"
          onClick={() => setMobileExpanded(!mobileExpanded)}
          className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-slate-800/90 border border-amber-500/30 text-xs font-bold text-slate-200 shadow-lg"
        >
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="text-amber-400 uppercase tracking-wider text-[11px]">Admin Menu:</span>
            <span className="text-white">{currentItem.label}</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
            <span>{mobileExpanded ? 'Hide' : 'All Sections'}</span>
            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${mobileExpanded ? 'rotate-180' : ''}`} />
          </div>
        </button>

        {mobileExpanded && (
          <div className="mt-2 p-3 rounded-2xl bg-slate-900 border border-amber-500/30 space-y-3 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-150">
            {renderNavLinks()}
          </div>
        )}
      </div>

      {/* Desktop Persistent Sidebar */}
      <div className="hidden md:block space-y-6">
        <div className="glass-card p-4 space-y-1.5 border-amber-500/30 bg-slate-900/60 backdrop-blur-md rounded-2xl">
          <div className="px-3 py-2 text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
            <Shield className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Municipal Control</span>
          </div>
          {renderNavLinks()}
        </div>

        <div className="glass-card p-4 bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-950 border border-amber-500/30 rounded-2xl space-y-3">
          <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 shrink-0" />
            Dispatch Center
          </h4>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Verify citizen reports, approve bulk collection requests, and assign collectors.
          </p>
          <div className="space-y-2 pt-1">
            <Link
              to="/admin/requests"
              className="w-full glass-button-primary text-xs py-2 justify-center bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold"
            >
              Dispatch Work Queue
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}
