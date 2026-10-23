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
  LogOut,
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

  const visibleLinks = user ? NAV_LINKS.filter((l) => l.roles.includes(user.role)) : [];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand Logo */}
        <Link to={user?.role === 'CITIZEN' ? '/citizen/overview' : user?.role === 'COLLECTOR' ? '/collector/overview' : user?.role === 'RECYCLING_ORGANIZATION' ? '/recycling/overview' : user?.role === 'MUNICIPAL_ADMIN' ? '/admin/overview' : '/'} className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-400 p-0.5 shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform shrink-0">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Recycle className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400" />
            </div>
          </div>
          <div>
            <span className="text-lg sm:text-xl font-bold tracking-tight text-slate-800">
              EcoBin
            </span>
            <span className="hidden sm:inline-block ml-2 rounded-full border border-emerald-100 bg-emerald-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-800">
              Smart Platform
            </span>
          </div>
        </Link>

        {/* Navigation Links — Filtered by Active Role */}
        <nav className="hidden md:flex items-center gap-1 font-medium text-xs lg:text-sm">
          {visibleLinks.map((l) => {
            const active = pathname === l.href || (l.href.includes('/overview') ? false : pathname.startsWith(l.href));
            return (
              <Link
                key={l.label}
                to={l.href}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-2 transition-colors ${
                  active
                    ? 'bg-emerald-50 font-semibold text-emerald-800'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-emerald-800'
                }`}
              >
                <l.icon className="w-4 h-4 shrink-0" />
                <span>{l.label}</span>
                {l.href.includes('notifications') && unreadCount > 0 && (
                  <span className="ml-1 text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-rose-500 text-white animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {!user ? (
            <>
              <Link
                to="/login"
                className="px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold text-slate-300 border border-slate-800 hover:border-slate-700 hover:text-white transition-all flex items-center gap-1 sm:gap-1.5"
              >
                <LogIn className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Login</span>
              </Link>

              <Link
                to="/register"
                className="px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-sm shadow-emerald-500/20 transition-all flex items-center gap-1 sm:gap-1.5"
              >
                <UserPlus className="w-3.5 h-3.5 shrink-0" />
                <span>Register</span>
              </Link>
            </>
          ) : (
            <>
              {/* Citizen Points Badge */}
              {user.role === 'CITIZEN' && (
                <div className="hidden sm:flex items-center gap-1.5 bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border border-amber-500/30 px-2.5 py-1 rounded-full shadow-inner shadow-amber-500/10 shrink-0">
                  <Award className="w-3.5 h-3.5 text-amber-400 animate-bounce shrink-0" />
                  <span className="text-amber-300 font-bold text-xs tracking-wide">
                    {user.ecoPoints} <span className="text-[10px] font-normal text-amber-400/80">PTS</span>
                  </span>
                </div>
              )}

              {/* User Profile Avatar & Sign Out */}
              <div className="flex items-center gap-1.5 border-l border-slate-200 pl-1.5 sm:gap-2 sm:pl-2">
                <img
                  src={user.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'}
                  alt={user.name}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover border border-slate-200 ring-2 ring-emerald-100 shrink-0"
                />
                <div className="hidden lg:block text-left">
                  <div className="text-xs font-semibold text-slate-200 line-clamp-1">{user.name}</div>
                  <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">{user.role.replace('_', ' ')}</div>
                </div>
                <button
                  onClick={handleLogout}
                  title="Sign out"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
                >
                  <LogOut className="w-4 h-4 shrink-0" />
                </button>
              </div>
            </>
          )}

          {/* Mobile Menu Button */}
          {user?.role !== 'CITIZEN' && (
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
              className="rounded-lg p-2 text-slate-600 transition hover:bg-emerald-50 hover:text-emerald-800 md:hidden"
          >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
          </button>
        )}
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 py-3 text-sm shadow-lg">
          {!user ? (
            <div className="space-y-2 pt-1 pb-2">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-slate-200 hover:text-emerald-400 font-medium"
              >
                Home
              </Link>
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-2"
              >
                <LogIn className="w-4 h-4" /> Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-2"
              >
                <UserPlus className="w-4 h-4" /> Create Account
              </Link>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs">
                <div className="text-slate-300 font-medium truncate">
                  Logged in as <span className="text-emerald-400 font-bold">{user.name}</span>
                </div>
                {user.role === 'CITIZEN' && (
                  <span className="text-amber-400 font-bold flex items-center gap-1 shrink-0">
                    <Award className="w-3.5 h-3.5" /> {user.ecoPoints} PTS
                  </span>
                )}
              </div>
              <div className="py-1 space-y-1">
                {visibleLinks.map((l) => (
                  <Link
                    key={l.href}
                    to={l.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 py-2 px-2.5 rounded-lg text-slate-200 hover:text-emerald-400 hover:bg-slate-800/60 font-medium transition"
                  >
                    <l.icon className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{l.label}</span>
                  </Link>
                ))}
              </div>
              <div className="pt-2 border-t border-slate-800">
                <button
                  onClick={handleLogout}
                  className="rounded-lg p-1.5 text-slate-500 transition hover:bg-rose-50 hover:text-rose-600"
                >
                  <LogOut className="w-4 h-4 shrink-0" />
                  <span>Sign out</span>
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </header>
  );
}
