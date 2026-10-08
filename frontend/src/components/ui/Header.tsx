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
  { href: '/dashboard/citizen', label: 'Overview', icon: LayoutDashboard, roles: ['CITIZEN'] },
  { href: '/dashboard/citizen/reports', label: 'My Reports', icon: FileText, roles: ['CITIZEN'] },
  { href: '/dashboard/citizen/requests', label: 'My Requests', icon: Truck, roles: ['CITIZEN'] },
  { href: '/dashboard/citizen/notifications', label: 'Notifications', icon: Bell, roles: ['CITIZEN'] },
  { href: '/dashboard/citizen/complaints', label: 'Complaints', icon: MessageSquare, roles: ['CITIZEN'] },
  { href: '/dashboard/collector', label: 'Collector Tasks', icon: Truck, roles: ['COLLECTOR'] },
  { href: '/dashboard/recycling', label: 'Recycling Portal', icon: Factory, roles: ['RECYCLING_ORGANIZATION'] },
  { href: '/dashboard/admin', label: 'Admin Dashboard', icon: Shield, roles: ['MUNICIPAL_ADMIN'] },
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
    <header className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800/80 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link to={user?.role === 'CITIZEN' ? '/dashboard/citizen' : user?.role === 'COLLECTOR' ? '/dashboard/collector' : user?.role === 'RECYCLING_ORGANIZATION' ? '/dashboard/recycling' : user?.role === 'MUNICIPAL_ADMIN' ? '/dashboard/admin' : '/'} className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-400 p-0.5 shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Recycle className="w-6 h-6 text-emerald-400" />
            </div>
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
              EcoBin
            </span>
            <span className="hidden sm:inline-block ml-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-wider">
              Smart Platform
            </span>
          </div>
        </Link>

        {/* Navigation Links — Filtered by Active Role */}
        <nav className="hidden md:flex items-center gap-1 font-medium text-xs lg:text-sm">
          {visibleLinks.map((l) => {
            const active = pathname === l.href || (l.href !== '/dashboard/citizen' && pathname.startsWith(l.href));
            return (
              <Link
                key={l.label}
                to={l.href}
                className={`px-3 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
                  active ? 'text-emerald-400 bg-emerald-500/10 font-semibold' : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <l.icon className="w-4 h-4" />
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

        <div className="flex items-center gap-2">
          {!user ? (
            <>
              <Link
                to="/login"
                className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-300 border border-slate-800 hover:border-slate-700 hover:text-white transition-all flex items-center gap-1.5"
              >
                <LogIn className="w-3.5 h-3.5 text-emerald-400" />
                <span>Login</span>
              </Link>

              <Link
                to="/register"
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-500 text-white hover:bg-emerald-600 shadow-sm shadow-emerald-500/20 transition-all flex items-center gap-1.5"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Register</span>
              </Link>
            </>
          ) : (
            <>
              {/* Citizen Points Badge */}
              {user.role === 'CITIZEN' && (
                <div className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border border-amber-500/30 px-3 py-1.5 rounded-full shadow-inner shadow-amber-500/10">
                  <Award className="w-4 h-4 text-amber-400 animate-bounce" />
                  <span className="text-amber-300 font-bold text-xs tracking-wide">
                    {user.ecoPoints} <span className="text-[10px] font-normal text-amber-400/80">PTS</span>
                  </span>
                </div>
              )}

              {/* User Profile Avatar & Sign Out */}
              <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
                <img
                  src={user.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'}
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover border border-slate-700 ring-2 ring-emerald-500/30"
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
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 py-3 space-y-2 text-sm">
          {visibleLinks.map((l) => (
            <Link
              key={l.href}
              to={l.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-slate-200 hover:text-emerald-400 font-medium"
            >
              {l.label}
            </Link>
          ))}
          {user && (
            <button
              onClick={handleLogout}
              className="block py-2 text-rose-400 font-medium w-full text-left"
            >
              Sign out
            </button>
          )}
        </div>
      )}
    </header>
  );
}
