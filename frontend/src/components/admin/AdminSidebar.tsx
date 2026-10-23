
import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
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
  Menu,
  X,
  ChevronDown,
  LogOut,
} from 'lucide-react';

export function AdminSidebar() {
  const [mobileExpanded, setMobileExpanded] = useState(false);
  const [canScrollDown, setCanScrollDown] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const pathname = location.pathname;

  const desktopScrollRef = useRef<HTMLDivElement>(null);

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

  const isItemActive = (href: string) =>
    pathname === href ||
    (href !== '/admin/overview' && pathname.startsWith(href));

  const currentItem =
    navItems.find((item) => isItemActive(item.href)) || navItems[0];

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

  const updateScrollState = () => {
    const element = desktopScrollRef.current;

    if (!element) {
      setCanScrollDown(false);
      return;
    }

    setCanScrollDown(
      element.scrollTop + element.clientHeight < element.scrollHeight - 2
    );
  };

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      setMobileExpanded(false);
      navigate('/login');
    }
  };

  const signOutButton = (
    <button
      type="button"
      onClick={handleLogout}
      className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-rose-50 hover:text-rose-700"
    >
      <LogOut className="h-4 w-4 shrink-0" />
      <span>Sign out</span>
    </button>
  );

  const renderNavLinks = () => (
    <nav className="space-y-1">
      {navItems.map((item) => {
        const isActive = isItemActive(item.href);

        return (
          <Link
            key={item.href}
            to={item.href}
            onClick={() => setMobileExpanded(false)}
            className={`flex w-full items-center justify-between rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors ${isActive
                ? 'border-emerald-100 bg-emerald-50 text-emerald-800'
                : 'border-transparent text-slate-600 hover:bg-slate-50 hover:text-emerald-800'
              }`}
          >
            <span className="flex items-center gap-3">
              <item.icon
                className={`h-4 w-4 shrink-0 ${isActive ? 'text-emerald-700' : 'text-slate-500'
                  }`}
              />
              <span>{item.label}</span>
            </span>
          </Link>
        );
      })}
    </nav>
  );

  const dispatchCenter = (
    <div className="space-y-3 border-t border-slate-100 pt-4">
      <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-700">
        <Shield className="h-4 w-4 text-emerald-700" />
        Dispatch Center
      </h4>

      <p className="text-xs leading-5 text-slate-500">
        Verify citizen reports, approve bulk collection requests, and assign collectors.
      </p>

      <Link
        to="/admin/requests"
        onClick={() => setMobileExpanded(false)}
        className="flex w-full items-center justify-center rounded-lg bg-emerald-700 px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800"
      >
        Dispatch Work Queue
      </Link>
    </div>
  );

  return (
    <>
      {/* Fixed mobile menu bar */}
      <div className="fixed left-0 right-0 top-16 z-30 border-b border-slate-200 bg-white px-4 py-3 shadow-sm md:hidden">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2">
            <Shield className="h-5 w-5 shrink-0 text-emerald-700" />
            <span className="truncate text-sm font-semibold text-slate-800">
              {currentItem.label}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setMobileExpanded(true)}
            aria-label="Open admin navigation"
            aria-controls="admin-mobile-sidebar"
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

      {/* Mobile slide-out drawer */}
      <aside
        id="admin-mobile-sidebar"
        aria-label="Admin navigation"
        aria-hidden={!mobileExpanded}
        className={`fixed inset-y-0 left-0 z-50 flex w-[min(19rem,85vw)] flex-col overflow-y-auto border-r border-slate-200 bg-white p-5 shadow-xl transition-transform duration-200 md:hidden ${mobileExpanded ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <div className="mb-6 flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-emerald-700" />
            <span className="font-bold text-slate-800">Admin Portal</span>
          </div>

          <button
            type="button"
            onClick={() => setMobileExpanded(false)}
            aria-label="Close admin navigation"
            className="rounded-lg p-2 text-slate-600 transition hover:bg-slate-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-1 flex-col gap-5">
          {renderNavLinks()}
          {dispatchCenter}

          <div className="mt-auto border-t border-slate-100 pt-3">
            {signOutButton}
          </div>
        </div>
      </aside>

      {/* Desktop persistent sidebar */}
      <aside className="hidden w-64 shrink-0 md:block">
        <div className="relative flex max-h-[calc(100vh-8rem)] flex-col overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="flex shrink-0 items-center gap-2 border-b border-slate-100 bg-white px-6 pb-4 pt-4">
            <Shield className="h-5 w-5 text-emerald-700" />
            <span className="text-sm font-bold text-slate-800">
              Admin Portal
            </span>
          </div>

          {/* Independently scrollable sidebar content */}
          <div
            ref={desktopScrollRef}
            className="min-h-0 flex-1 overflow-y-auto px-4 py-4"
            onScroll={updateScrollState}
          >
            <div className="space-y-5">
              {renderNavLinks()}
              {dispatchCenter}
            </div>
          </div>

          {/* Desktop sign-out button */}
          <div className="shrink-0 border-t border-slate-100 bg-white p-3">
            {signOutButton}
          </div>

          {/* Sidebar scroll indicator */}
          <button
            type="button"
            aria-label="Scroll sidebar down"
            title="Scroll down"
            onClick={() => {
              desktopScrollRef.current?.scrollBy({
                top: 180,
                behavior: 'smooth',
              });
            }}
            className={`flex shrink-0 items-center justify-center border-t border-slate-100 bg-white py-2 text-emerald-700 transition hover:bg-emerald-50 ${canScrollDown ? 'animate-pulse' : ''
              }`}
          >
            <ChevronDown className="h-5 w-5" />
          </button>
        </div>
      </aside>
    </>
  );
}
