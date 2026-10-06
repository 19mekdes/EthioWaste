'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { Mail, Lock, Loader2, LogIn, AlertCircle, Recycle } from 'lucide-react';

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/citizen';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid email or password. Please try again.');
        setLoading(false);
        return;
      }

      if (searchParams.get('callbackUrl')) {
        const url = searchParams.get('callbackUrl')!;
        router.push(url.startsWith('/') ? url : '/dashboard/citizen');
      } else {
        const emailLower = email.toLowerCase();
        if (emailLower.includes('admin')) {
          router.push('/dashboard/admin');
        } else if (emailLower.includes('collector')) {
          router.push('/dashboard/collector');
        } else if (emailLower.includes('recycling')) {
          router.push('/dashboard/recycling');
        } else {
          router.push('/dashboard/citizen');
        }
      }
      router.refresh();
    } catch (err) {
      console.error('Login error:', err);
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="flex items-center gap-2 bg-rose-500/10 border border-rose-500/30 text-rose-300 p-3 rounded-xl text-xs">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
          <Mail className="w-3.5 h-3.5 text-emerald-400" />
          Email Address
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full glass-input"
          required
          autoComplete="email"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
          <Lock className="w-3.5 h-3.5 text-amber-400" />
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          className="w-full glass-input"
          required
          autoComplete="current-password"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="glass-button-primary w-full py-3"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4" />}
        <span>Sign In to EcoBin</span>
      </button>

      <div className="text-center text-xs text-slate-400">
        New to EcoBin?{' '}
        <Link
          href={callbackUrl ? `/register?callbackUrl=${encodeURIComponent(callbackUrl)}` : '/register'}
          className="text-emerald-400 font-semibold hover:text-emerald-300 hover:underline"
        >
          Create an account
        </Link>
      </div>

      <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 text-[11px] text-slate-400 space-y-2.5">
        <div className="flex items-center gap-1.5 font-semibold text-slate-300">
          <Recycle className="w-3.5 h-3.5 text-emerald-400" />
          Quick 1-Click Login:
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
          <button
            type="button"
            onClick={async () => {
              setEmail('citizen@ecobin.org');
              setPassword('password123');
              setLoading(true);
              const result = await signIn('credentials', { email: 'citizen@ecobin.org', password: 'password123', redirect: false });
              if (result?.error) { setError('Login failed'); setLoading(false); }
              else { router.push('/dashboard/citizen'); router.refresh(); }
            }}
            className="px-2 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 font-semibold text-center transition-all text-xs"
          >
            👤 Citizen
          </button>
          <button
            type="button"
            onClick={async () => {
              setEmail('collector@ecobin.org');
              setPassword('password123');
              setLoading(true);
              const result = await signIn('credentials', { email: 'collector@ecobin.org', password: 'password123', redirect: false });
              if (result?.error) { setError('Login failed'); setLoading(false); }
              else { router.push('/dashboard/collector'); router.refresh(); }
            }}
            className="px-2 py-1.5 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/30 hover:bg-sky-500/20 font-semibold text-center transition-all text-xs"
          >
            🚚 Collector
          </button>
          <button
            type="button"
            onClick={async () => {
              setEmail('recycling@ecobin.org');
              setPassword('password123');
              setLoading(true);
              const result = await signIn('credentials', { email: 'recycling@ecobin.org', password: 'password123', redirect: false });
              if (result?.error) { setError('Login failed'); setLoading(false); }
              else { router.push('/dashboard/recycling'); router.refresh(); }
            }}
            className="px-2 py-1.5 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/30 hover:bg-teal-500/20 font-semibold text-center transition-all text-xs"
          >
            ♻️ Recycler
          </button>
          <button
            type="button"
            onClick={async () => {
              setEmail('admin@ecobin.org');
              setPassword('password123');
              setLoading(true);
              const result = await signIn('credentials', { email: 'admin@ecobin.org', password: 'password123', redirect: false });
              if (result?.error) { setError('Login failed'); setLoading(false); }
              else { router.push('/dashboard/admin'); router.refresh(); }
            }}
            className="px-2 py-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500/20 font-semibold text-center transition-all text-xs"
          >
            🛡️ Admin
          </button>
        </div>
      </div>
    </form>
  );
}

export function LoginFormSkeleton() {
  return (
    <div className="space-y-5 animate-pulse">
      <div className="h-4 w-1/3 bg-slate-800 rounded" />
      <div className="h-11 w-full bg-slate-800/70 rounded-xl" />
      <div className="h-4 w-1/3 bg-slate-800 rounded" />
      <div className="h-11 w-full bg-slate-800/70 rounded-xl" />
      <div className="h-12 w-full bg-slate-800 rounded-xl" />
    </div>
  );
}

export function LoginFormWithSuspense() {
  return (
    <Suspense fallback={<LoginFormSkeleton />}>
      <LoginForm />
    </Suspense>
  );
}
