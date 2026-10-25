
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  Recycle,
  Award,
  Shield,
  Truck,
  Menu,
  X,
  LogIn,
  UserPlus,
  Factory,
  LayoutDashboard,
  FileText,
  Bell,
  MessageSquare,
} from 'lucide-react';

interface HeaderProps {
  unreadCount?: number;
}

interface NavLink {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: string[];
}

const NAV_LINKS: NavLink[] = [
  { href: '/citizen/overview', label: 'Overview', icon: LayoutDashboard, roles: ['CITIZEN'] },
  { href: '/citizen/my-reports', label: 'My Reports', icon: FileText, roles: ['CITIZEN'] },
  { href: '/citizen/my-requests', label: 'My Requests', icon: Truck, roles: ['CITIZEN'] },
  { href: '/citizen/notifications', label: 'Notifications', icon: Bell, roles: ['CITIZEN'] },
  { href: '/citizen/complaints', label: 'Complaints', icon: MessageSquare, roles: ['CITIZEN'] },
  { href: '/collector/overview', label: 'Collector Tasks', icon: Truck, roles: ['COLLECTOR'] },
  { href: '/recycling/overview', label: 'Recycling Portal', icon: Factory, roles: ['RECYCLING_ORGANIZATION'] },
  { href: '/admin/overview', label: 'Admin Dashboard', icon: Shield, roles: ['MUNICIPAL_ADMIN'] },
];

export function Header({ unreadCount = 0 }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const pathname = location.pathname;

  const visibleLinks = user
    ? NAV_LINKS.filter((link) => link.roles.includes(user.role))
    : [];

  const handleLogout = async () => {
    await logout();
    setMobileMenuOpen(false);
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-2 px-3 sm:gap-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link
          to="/"
          className="group flex shrink-0 items-center gap-2.5 sm:gap-3"
        >
          <div className="h-9 w-9 shrink-0 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-400 p-0.5 shadow-lg shadow-emerald-500/20 transition-transform group-hover:scale-105 sm:h-10 sm:w-10">
            <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-slate-950">
              <Recycle className="h-5 w-5 text-emerald-400 sm:h-6 sm:w-6" />
            </div>
          </div>

          <div>
            <span className="text-lg font-bold tracking-tight text-slate-800 sm:text-xl">
              EcoBin
            </span>
            <span className="ml-2 hidden rounded-full border border-emerald-100 bg-emerald-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-800 sm:inline-block">
              Smart Platform
            </span>
          </div>
        </Link>

        {/* Account Actions and User Profile */}
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          {!user ? (
            <>
              <Link
                to="/login"
                className="flex items-center gap-1 rounded-xl border border-slate-200 px-2.5 py-1.5 text-xs font-bold text-slate-700 transition-all hover:border-emerald-300 hover:text-emerald-800 sm:gap-1.5 sm:px-3"
              >
                <LogIn className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
                <span>Login</span>
              </Link>

              <Link
                to="/register"
                className="flex items-center gap-1 rounded-xl bg-emerald-600 px-2.5 py-1.5 text-xs font-bold text-white shadow-sm transition-all hover:bg-emerald-700 sm:gap-1.5 sm:px-3"
              >
                <UserPlus className="h-3.5 w-3.5 shrink-0" />
                <span>Register</span>
              </Link>
            </>
          ) : (
            <>
              {/* Citizen Points Badge */}
              {user.role === 'CITIZEN' && (
                <div className="hidden shrink-0 items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 sm:flex">
                  <Award className="h-3.5 w-3.5 shrink-0 text-amber-600" />
                  <span className="text-xs font-bold tracking-wide text-amber-800">
                    {user.ecoPoints}{' '}
                    <span className="text-[10px] font-normal text-amber-700">
                      PTS
                    </span>
                  </span>
                </div>
              )}

              {/* User Profile â€” no separate sign-out icon */}
              <div className="flex items-center gap-2 border-l border-slate-200 pl-2 sm:pl-3">
                <img
                  src={
                    user.avatarUrl ||
                    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'
                  }
                  alt={user.name}
                  className="h-7 w-7 shrink-0 rounded-full border border-slate-200 object-cover ring-2 ring-emerald-100 sm:h-8 sm:w-8"
                />

                <div className="hidden text-left lg:block">
                  <div className="line-clamp-1 text-xs font-semibold text-slate-800">
                    {user.name}
                  </div>
                  <div className="font-mono text-[10px] uppercase tracking-wider text-slate-500">
                    {user.role.replace('_', ' ')}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="border-b border-slate-200 bg-white px-4 py-3 text-sm shadow-lg md:hidden">
          {!user ? (
            <div className="space-y-2 pb-2 pt-1">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 font-medium text-slate-600 hover:text-emerald-800"
              >
                Home
              </Link>

              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 py-2 font-semibold text-emerald-700 hover:text-emerald-900"
              >
                <LogIn className="h-4 w-4" />
                Sign In
              </Link>

              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 py-2 font-semibold text-teal-700 hover:text-teal-900"
              >
                <UserPlus className="h-4 w-4" />
                Create Account
              </Link>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between border-b border-slate-200 pb-2 text-xs">
                <div className="truncate font-medium text-slate-600">
                  Logged in as{' '}
                  <span className="font-bold text-emerald-800">
                    {user.name}
                  </span>
                </div>

                {user.role === 'CITIZEN' && (
                  <span className="flex shrink-0 items-center gap-1 font-bold text-amber-700">
                    <Award className="h-3.5 w-3.5" />
                    {user.ecoPoints} PTS
                  </span>
                )}
              </div>

              <div className="space-y-1 py-2">
                {visibleLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 font-medium text-slate-700 transition hover:bg-emerald-50 hover:text-emerald-800"
                  >
                    <link.icon className="h-4 w-4 shrink-0 text-emerald-700" />
                    <span>{link.label}</span>

                    {link.href.includes('notifications') && unreadCount > 0 && (
                      <span className="ml-auto rounded-full bg-rose-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
                        {unreadCount}
                      </span>
                    )}
                  </Link>
                ))}
              </div>

              <div className="border-t border-slate-200 pt-2">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-lg px-2.5 py-2 font-medium text-slate-600 transition hover:bg-rose-50 hover:text-rose-700"
                >
                  Sign out
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </header>
  );
}

