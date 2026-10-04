'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { Role } from '@prisma/client';
import { Recycle, Award, PlusCircle, Shield, MapPin, Truck, Menu, X, LogOut, LogIn, UserPlus } from 'lucide-react';
import { ActiveUser } from './RoleSwitcher';

interface HeaderProps {
  user: ActiveUser;
  onOpenReportModal?: () => void;
  onSelectTab?: (tab: string) => void;
}

interface NavLink {
  href: string;
  label: string;
  tabKey?: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: Role[];
}

const NAV_LINKS: NavLink[] = [
  { href: '/citizen', label: 'Live City Map', tabKey: 'MAP', icon: MapPin, roles: ['CITIZEN', 'COLLECTOR', 'MUNICIPAL_ADMIN'] },
  { href: '/citizen/centers', label: 'Recycling Centers', tabKey: 'CENTERS', icon: Recycle, roles: ['CITIZEN'] },
  { href: '/citizen/pickup', label: 'Bulk Pickup', tabKey: 'PICKUP', icon: Truck, roles: ['CITIZEN'] },
  { href: '/citizen/rewards', label: 'Eco-Rewards', tabKey: 'REWARDS', icon: Award, roles: ['CITIZEN'] },
  { href: '/collector', label: 'Collector Tasks', tabKey: 'COLLECTOR', icon: Truck, roles: ['COLLECTOR'] },
  { href: '/admin', label: 'Admin Dashboard', tabKey: 'ADMIN', icon: Shield, roles: ['MUNICIPAL_ADMIN'] },
];

export function Header({ user, onOpenReportModal, onSelectTab }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const pathname = usePathname();

  const visibleLinks = NAV_LINKS.filter((l) => l.roles.includes(user.role));

  const handleLinkClick = (e: React.MouseEvent, l: NavLink) => {
    if (pathname === '/' && onSelectTab && l.tabKey) {
      e.preventDefault();
      onSelectTab(l.tabKey);
    }
  };

  return (
    <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800/80 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-eco-600 via-emerald-500 to-teal-400 p-0.5 shadow-lg shadow-eco-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Recycle className="w-6 h-6 text-eco-400" />
            </div>
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
              EcoBin
            </span>
            <span className="hidden sm:inline-block ml-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-eco-500/10 text-eco-400 border border-eco-500/20 uppercase tracking-wider">
              Smart Platform
            </span>
          </div>
        </Link>

        {/* Navigation Links — Filtered by Active Role */}
        <nav className="hidden md:flex items-center gap-1 font-medium text-sm">
          {visibleLinks.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.label}
                href={l.href}
                onClick={(e) => handleLinkClick(e, l)}
                className={`px-3 py-2 rounded-lg transition-all flex items-center gap-1.5 ${active ? 'text-eco-400 bg-eco-500/10' : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  }`}
              >
                <l.icon className="w-4 h-4" />
                {l.label}
              </Link>
            );
          })}
        </nav>


        <div className="flex items-center gap-3">
          {/* Citizen Points Badge */}
          {user.role === 'CITIZEN' && (
            <div className="flex items-center gap-2 bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border border-amber-500/30 px-3.5 py-1.5 rounded-full shadow-inner shadow-amber-500/10">
              <Award className="w-4 h-4 text-amber-400 animate-bounce" />
              <span className="text-amber-300 font-bold text-sm tracking-wide">
                {user.ecoPoints} <span className="text-xs font-normal text-amber-400/80">PTS</span>
              </span>
            </div>
          )}

          {/* Citizen Report Waste Action */}
          {onOpenReportModal && user.role === 'CITIZEN' && (
            <button onClick={onOpenReportModal} className="glass-button-primary text-xs py-2 px-3 sm:px-4">
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Report Waste</span>
            </button>
          )}

          {/* Sign In & Register Buttons */}
          <div className="hidden sm:flex items-center gap-2 border-l border-slate-800 pl-3">
            <Link
              href="/login"
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-all flex items-center gap-1.5 border border-slate-800"
            >
              <LogIn className="w-3.5 h-3.5 text-emerald-400" />
              <span>Sign In</span>
            </Link>
            <Link
              href="/register"
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/30 transition-all flex items-center gap-1.5"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Register</span>
            </Link>
          </div>

          {/* User Profile Avatar */}
          <div className="flex items-center gap-2.5 pl-2 border-l border-slate-800">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={user.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'}
              alt={user.name}
              className="w-9 h-9 rounded-full object-cover border border-slate-700 ring-2 ring-emerald-500/30"
            />
            <div className="hidden lg:block text-left">
              <div className="text-xs font-semibold text-slate-200 line-clamp-1">{user.name}</div>
              <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">{user.role.replace('_', ' ')}</div>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              title="Sign out"
              className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

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
              href={l.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-slate-200 hover:text-emerald-400 font-medium"
            >
              {l.label}
            </Link>
          ))}
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="block py-2 text-rose-400 font-medium w-full text-left"
          >
            Sign out
          </button>
        </div>
      )}
    </header>
  );
}
