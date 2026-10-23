
import React, { useEffect, useState } from 'react';
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
  Menu,
  X,
} from 'lucide-react';

interface CitizenSidebarProps {
  unreadNotificationsCount?: number;
}

export function CitizenSidebar({
  unreadNotificationsCount = 0,
}: CitizenSidebarProps) {
  const [mobileExpanded, setMobileExpanded] = useState(false);
  const location = useLocation();
  const pathname = location.pathname;

  const navItems = [
    { href: '/citizen/overview', label: 'Overview', icon: LayoutDashboard },
    {
      href: '/citizen/report-waste',
      label: 'Report Waste',
      icon: AlertTriangle,
      highlight: true,
    },
    { href: '/citizen/my-reports', label: 'My Reports', icon: FileText },
    {
      href: '/citizen/request-collection',
      label: 'Request Collection',
      icon: PlusCircle,
    },
    { href: '/citizen/my-requests', label: 'My Requests', icon: ListOrdered },
    { href: '/citizen/centers', label: 'Collection Points', icon: MapPin },
    {
      href: '/citizen/notifications',
      label: 'Notifications',
      icon: Bell,
      badge:
        unreadNotificationsCount > 0
          ? unreadNotificationsCount
          : undefined,
    },
    { href: '/citizen/complaints', label: 'Complaints', icon: MessageSquare },
    { href: '/citizen/feedback', label: 'Feedback', icon: Star },
  ];

  const currentItem =
    navItems.find(
      (item) =>
        pathname === item.href || pathname.startsWith(item.href)
    ) || navItems[0];

  useEffect(() => {
    setMobileExpanded(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileExpanded) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileExpanded(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileExpanded]);

  const renderNavLinks = () => (
    <nav className="space-y-1">
      {navItems.map((item) => {
        const isActive =
          pathname === item.href || pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            to={item.href}
            onClick={() => setMobileExpanded(false)}
            className={`flex w-full items-center justify-between rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors ${
              isActive
                ? 'border-emerald-100 bg-emerald-50 text-emerald-800'
                : item.highlight
                  ? 'border-transparent text-emerald-800 hover:bg-emerald-50'
                  : 'border-transparent text-slate-600 hover:bg-slate-50 hover:text-emerald-800'
            }`}
          >
            <span className="flex items-center gap-3">
              <item.icon
                className={`h-4 w-4 shrink-0 ${
                  isActive || item.highlight
                    ? 'text-emerald-700'
                    : 'text-slate-500'
                }`}
              />
              <span>{item.label}</span>
            </span>

            {item.badge !== undefined && (
              <span className="rounded-full bg-emerald-700 px-2 py-0.5 text-xs font-semibold text-white">
                {item.badge}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );

  const quickActions = (
    <div className="space-y-3 border-t border-slate-100 pt-4">
      <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-700">
        <PlusCircle className="h-4 w-4 text-emerald-700" />
        Quick Actions
      </h4>

      <p className="text-xs leading-5 text-slate-500">
        Spotted illegal dumping or need a bulk waste collection? Submit a
        report in under 60 seconds.
      </p>

      <div className="space-y-2">
        <Link
          to="/citizen/report-waste"
          onClick={() => setMobileExpanded(false)}
          className="flex w-full items-center justify-center rounded-lg bg-emerald-700 px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800"
        >
          Report Waste Issue
        </Link>

        <Link
          to="/citizen/request-collection"
          onClick={() => setMobileExpanded(false)}
          className="flex w-full items-center justify-center rounded-lg border border-emerald-200 bg-white px-3 py-2.5 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-50"
        >
          Request Collection
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile menu button */}
      <div className="mb-4 flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 md:hidden">
        <div className="flex items-center gap-2">
          <Recycle className="h-5 w-5 text-emerald-700" />
          <span className="text-sm font-semibold text-slate-800">
            {currentItem.label}
          </span>
        </div>

        <button
          type="button"
          onClick={() => setMobileExpanded(true)}
          aria-label="Open citizen navigation"
          aria-expanded={mobileExpanded}
          className="rounded-lg p-2 text-slate-700 transition hover:bg-emerald-50 hover:text-emerald-800"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Mobile backdrop */}
      {mobileExpanded && (
        <button
          type="button"
          aria-label="Close navigation menu"
          onClick={() => setMobileExpanded(false)}
          className="fixed inset-0 z-40 bg-slate-900/40 md:hidden"
        />
      )}

      {/* Mobile slide-out drawer */}
      <aside
        id="citizen-mobile-sidebar"
        aria-label="Citizen navigation"
        className={`fixed inset-y-0 left-0 z-50 flex w-[min(19rem,85vw)] flex-col overflow-y-auto border-r border-slate-200 bg-white p-5 shadow-xl transition-transform duration-200 md:hidden ${
          mobileExpanded ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-hidden={!mobileExpanded}
      >
        <div className="mb-6 flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <Recycle className="h-5 w-5 text-emerald-700" />
            <span className="font-bold text-slate-800">Citizen Portal</span>
          </div>

          <button
            type="button"
            onClick={() => setMobileExpanded(false)}
            aria-label="Close citizen navigation"
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-5">
          {renderNavLinks()}
          {quickActions}
        </div>
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 md:block">
        <div className="space-y-5 rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-2 border-b border-slate-100 px-2 pb-4">
            <Recycle className="h-5 w-5 text-emerald-700" />
            <span className="text-sm font-bold text-slate-800">
              Citizen Portal
            </span>
          </div>

          {renderNavLinks()}
          {quickActions}
        </div>
      </aside>
    </>
  );
}
