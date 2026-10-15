import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Truck,
  History,
  Bell,
  User,
  ListCheck,
  ChevronDown,
} from 'lucide-react';

interface CollectorSidebarProps {
  unreadNotificationsCount?: number;
}

export function CollectorSidebar({ unreadNotificationsCount = 0 }: CollectorSidebarProps) {
  const [mobileExpanded, setMobileExpanded] = useState(false);
  const location = useLocation();
  const pathname = location.pathname;

  const navItems = [
    { href: '/collector/overview', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/collector/tasks', label: 'My Tasks', icon: Truck },
    { href: '/collector/history', label: 'Task History', icon: History },
    {
      href: '/collector/notifications',
      label: 'Notifications',
      icon: Bell,
      badge: unreadNotificationsCount > 0 ? unreadNotificationsCount : undefined,
    },
    { href: '/collector/profile', label: 'Profile', icon: User },
  ];

  const currentItem = navItems.find(
    (item) => pathname === item.href || (item.href !== '/collector/overview' && pathname.startsWith(item.href))
  ) || navItems[0];

  const renderNavLinks = () => (
    <nav className="space-y-1">
      {navItems.map((item) => {
        const isActive =
          pathname === item.href ||
          (item.href !== '/collector/overview' && pathname.startsWith(item.href));

        return (
          <Link
            key={item.href}
            to={item.href}
            onClick={() => setMobileExpanded(false)}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              isActive
                ? 'bg-gradient-to-r from-purple-500/20 to-indigo-500/10 text-purple-300 border border-purple-500/30 shadow-md shadow-purple-500/5'
                : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <item.icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-purple-400' : 'text-slate-400'}`} />
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
          className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-slate-800/90 border border-purple-500/30 text-xs font-bold text-slate-200 shadow-lg"
        >
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-purple-400 shrink-0" />
            <span className="text-purple-400 uppercase tracking-wider text-[11px]">Collector Menu:</span>
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
          <div className="mt-2 p-3 rounded-2xl bg-slate-900 border border-purple-500/30 space-y-3 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-150">
            {renderNavLinks()}
          </div>
        )}
      </div>

      {/* Desktop Persistent Sidebar */}
      <div className="hidden md:block space-y-6">
        <div className="glass-card p-4 space-y-1.5 border-purple-500/30 bg-slate-900/60 backdrop-blur-md rounded-2xl">
          <div className="px-3 py-2 text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-2">
            <Truck className="w-4 h-4 text-purple-400 shrink-0" />
            <span>Collector Portal</span>
          </div>
          {renderNavLinks()}
        </div>

        <div className="glass-card p-4 bg-gradient-to-br from-purple-950/40 via-slate-900 to-slate-950 border border-purple-500/30 rounded-2xl space-y-3">
          <h4 className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
            <ListCheck className="w-3.5 h-3.5 shrink-0" />
            Field Operations
          </h4>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Open assigned tasks to access map routes, start collection, upload photo proof, and mark tasks completed.
          </p>
          <div className="space-y-2 pt-1">
            <Link
              to="/collector/tasks"
              className="w-full glass-button-primary text-xs py-2 justify-center bg-purple-600 text-white font-bold"
            >
              View Active Tasks
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}
