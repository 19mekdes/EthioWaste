
import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
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
  ChevronDown,
  LogOut,
} from 'lucide-react';

interface CitizenSidebarProps {
  unreadNotificationsCount?: number;
}

export function CitizenSidebar({
  unreadNotificationsCount = 0,
}: CitizenSidebarProps) {
  const [mobileExpanded, setMobileExpanded] = useState(false);
  const [canScrollDown, setCanScrollDown] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
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
      (item) => pathname === item.href || pathname.startsWith(item.href)
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

  const handleLogout = async () => {
    await logout();
    setMobileExpanded(false);
    navigate('/login');
  };

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
            className={`flex w-full items-center justify-between rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors ${isActive
                ? 'border-emerald-100 bg-emerald-50 text-emerald-800'
                : item.highlight
                  ? 'border-transparent text-emerald-800 hover:bg-emerald-50'
                  : 'border-transparent text-slate-600 hover:bg-slate-50 hover:text-emerald-800'
              }`}
          >
            <span className="flex items-center gap-3">
              <item.icon
                className={`h-4 w-4 shrink-0 ${isActive || item.highlight
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
      {/* Mobile menu bar */}
      <div className="fixed left-0 right-0 top-16 z-30 border-b border-slate-200 bg-white px-4 py-3 shadow-sm md:hidden">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2">
            <Recycle className="h-5 w-5 shrink-0 text-emerald-700" />
            <span className="truncate text-sm font-semibold text-slate-800">
              {currentItem.label}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setMobileExpanded(true)}
            aria-label="Open citizen navigation"
            aria-controls="citizen-mobile-sidebar"
            aria-expanded={mobileExpanded}
            className="shrink-0 rounded-lg p-2 text-slate-700 transition hover:bg-emerald-50 hover:text-emerald-800"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Reserve space for the fixed mobile menu bar */}
      <div className="h-14 md:hidden" aria-hidden="true" />

      {/* Mobile backdrop */}
      {mobileExpanded && (
        <button
          type="button"
          aria-label="Close navigation menu"
          onClick={() => setMobileExpanded(false)}
          className="fixed inset-0 z-40 bg-slate-900/40 md:hidden"
        />
      )}

      {/* Mobile drawer */}
      <aside
        id="citizen-mobile-sidebar"
        aria-label="Citizen navigation"
        aria-hidden={!mobileExpanded}
        className={`fixed inset-y-0 left-0 z-50 flex w-[min(19rem,85vw)] flex-col overflow-y-auto border-r border-slate-200 bg-white p-5 shadow-xl transition-transform duration-200 md:hidden ${mobileExpanded ? 'translate-x-0' : '-translate-x-full'
          }`}
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
            className="rounded-lg p-2 text-slate-600 transition hover:bg-slate-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-5">
          {renderNavLinks()}
          {quickActions}
        </div>

        <div className="mt-5 border-t border-slate-200 pt-4">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-rose-50 hover:text-rose-700"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 md:block">
        <div className="relative flex max-h-[calc(100vh-8rem)] flex-col overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="flex shrink-0 items-center gap-2 border-b border-slate-100 bg-white px-6 pb-4 pt-4">
            <Recycle className="h-5 w-5 text-emerald-700" />
            <span className="text-sm font-bold text-slate-800">
              Citizen Portal
            </span>
          </div>

          {/* Independently scrollable sidebar content */}
          <div
            className="min-h-0 flex-1 overflow-y-auto px-4 py-4"
            onScroll={(event) => {
              const element = event.currentTarget;
              setCanScrollDown(
                element.scrollTop + element.clientHeight <
                element.scrollHeight - 2
              );
            }}
            ref={(element) => {
              if (element) {
                setCanScrollDown(
                  element.scrollTop + element.clientHeight <
                  element.scrollHeight - 2
                );
              }
            }}
          >
            <div className="space-y-5">
              {renderNavLinks()}
              {quickActions}
            </div>
          </div>

          {/* Scroll indicator */}
          <button
            type="button"
            aria-label="Scroll sidebar down"
            title="Scroll down"
            onClick={(event) => {
              const scrollArea = event.currentTarget.previousElementSibling;
              scrollArea?.scrollBy({ top: 180, behavior: 'smooth' });
            }}
            className={`flex shrink-0 items-center justify-center border-t border-slate-100 bg-white py-2 text-emerald-700 transition hover:bg-emerald-50 ${canScrollDown ? 'animate-pulse' : ''
              }`}
          >
            <ChevronDown className="h-5 w-5" />
          </button>

          {/* Sign out at the bottom of the sidebar */}
          <div className="shrink-0 border-t border-slate-200 p-3">
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-rose-50 hover:text-rose-700"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
