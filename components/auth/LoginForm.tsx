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

      // Success — honor the middleware callbackUrl, otherwise let the
      // landing page route us to the right role home
      router.push(callbackUrl && callbackUrl.startsWith('/') ? callbackUrl : '/');
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

      <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 text-[11px] text-slate-400 space-y-1.5">
        <div className="flex items-center gap-1.5 font-semibold text-slate-300">
          <Recycle className="w-3.5 h-3.5 text-emerald-400" />
          Demo accounts (seeded)
        </div>
        <div><span className="text-emerald-400 font-mono">citizen@ecobin.org</span> — password123</div>
        <div><span className="text-sky-400 font-mono">collector@ecobin.org</span> — password123</div>
        <div><span className="text-amber-400 font-mono">admin@ecobin.org</span> — password123</div>
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
