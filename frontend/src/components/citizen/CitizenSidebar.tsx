import React, { useState } from 'react';
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
  ChevronDown,
} from 'lucide-react';

interface CitizenSidebarProps {
  unreadNotificationsCount?: number;
}

export function CitizenSidebar({ unreadNotificationsCount = 0 }: CitizenSidebarProps) {
  const [mobileExpanded, setMobileExpanded] = useState(false);
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

  const currentItem = navItems.find(
    (item) => pathname === item.href || (item.href !== '/dashboard/citizen' && pathname.startsWith(item.href))
  ) || navItems[0];

  const renderNavLinks = () => (
    <nav className="space-y-1">
      {navItems.map((item) => {
        const isActive =
          pathname === item.href ||
          (item.href !== '/dashboard/citizen' && pathname.startsWith(item.href));

        return (
          <Link
            key={item.href}
            to={item.href}
            onClick={() => setMobileExpanded(false)}
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
                className={`w-4 h-4 shrink-0 ${
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
  );

  return (
    <aside className="w-full md:w-64 shrink-0">
      {/* Mobile Collapsible Subnav Bar */}
      <div className="md:hidden mb-4">
        <button
          type="button"
          onClick={() => setMobileExpanded(!mobileExpanded)}
          className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-slate-800/90 border border-emerald-500/30 text-xs font-bold text-slate-200 shadow-lg"
        >
          <div className="flex items-center gap-2">
            <Recycle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-emerald-400 uppercase tracking-wider text-[11px]">Citizen Menu:</span>
            <span className="text-white">{currentItem.label}</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
            {unreadNotificationsCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-bold">
                {unreadNotificationsCount}
              </span>
            )}
            <span>{mobileExpanded ? 'Hide' : 'All Sections'}</span>
            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${mobileExpanded ? 'rotate-180' : ''}`} />
          </div>
        </button>

        {mobileExpanded && (
          <div className="mt-2 p-3 rounded-2xl bg-slate-900 border border-emerald-500/30 space-y-3 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-150">
            {renderNavLinks()}
            <div className="pt-2 border-t border-slate-800 flex gap-2">
              <Link
                to="/citizen/report-waste"
                onClick={() => setMobileExpanded(false)}
                className="flex-1 py-2 text-center text-xs font-bold bg-amber-500 text-slate-950 rounded-xl"
              >
                Report Waste
              </Link>
              <Link
                to="/citizen/request-collection"
                onClick={() => setMobileExpanded(false)}
                className="flex-1 py-2 text-center text-xs font-bold bg-emerald-500 text-slate-950 rounded-xl"
              >
                Request Pickup
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Desktop Persistent Sidebar */}
      <div className="hidden md:block space-y-6">
        <div className="glass-card p-4 space-y-1.5 border border-slate-800 bg-slate-900/60 backdrop-blur-md rounded-2xl">
          <div className="px-3 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <Recycle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Citizen Portal</span>
          </div>
          {renderNavLinks()}
        </div>

        <div className="glass-card p-4 bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-950 border border-emerald-500/30 rounded-2xl space-y-3">
          <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
            <PlusCircle className="w-3.5 h-3.5 shrink-0" />
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
      </div>
    </aside>
  );
}
