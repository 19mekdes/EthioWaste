'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useActionState } from 'react';
import { signIn } from 'next-auth/react';
import { registerUser } from '@/actions/auth-actions';
import { Mail, Lock, User, Loader2, UserPlus, AlertCircle, CheckCircle2 } from 'lucide-react';

export function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/citizen';

  const [state, formAction, pending] = useActionState(registerUser, {});
  const [autoSigningIn, setAutoSigningIn] = useState(false);


  React.useEffect(() => {
    if (state.success && !autoSigningIn) {
      setAutoSigningIn(true);
      const emailInput = document.getElementById('email') as HTMLInputElement | null;
      const passwordInput = document.getElementById('password') as HTMLInputElement | null;
      const email = emailInput?.value || '';
      const password = passwordInput?.value || '';

      signIn('credentials', { email, password, redirect: false }).then((res) => {
        if (res?.error) {
          router.push('/login?registered=1');
        } else {
          router.push(callbackUrl && callbackUrl.startsWith('/') ? callbackUrl : '/');
          router.refresh();
        }
      });
    }
  }, [state.success, autoSigningIn, router]);

  const fieldError = (key: 'name' | 'email' | 'password') =>
    state.fieldErrors?.[key]?.[0];

  return (
    <form action={formAction} className="space-y-5">
      {state.error && (
        <div className="flex items-center gap-2 bg-rose-500/10 border border-rose-500/30 text-rose-300 p-3 rounded-xl text-xs">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{state.error}</span>
        </div>
      )}

      {state.success && (
        <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 p-3 rounded-xl text-xs">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Account created! Signing you in...</span>
        </div>
      )}

      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
          <User className="w-3.5 h-3.5 text-emerald-400" />
          Full Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          placeholder="Jane Citizen"
          className="w-full glass-input"
          required
          autoComplete="name"
        />
        {fieldError('name') && (
          <p className="text-[11px] text-rose-400 mt-1">{fieldError('name')}</p>
        )}
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
          <Mail className="w-3.5 h-3.5 text-emerald-400" />
          Email Address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="you@example.com"
          className="w-full glass-input"
          required
          autoComplete="email"
        />
        {fieldError('email') && (
          <p className="text-[11px] text-rose-400 mt-1">{fieldError('email')}</p>
        )}
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
          <Lock className="w-3.5 h-3.5 text-amber-400" />
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          placeholder="At least 8 characters"
          className="w-full glass-input"
          required
          minLength={8}
          autoComplete="new-password"
        />
        {fieldError('password') && (
          <p className="text-[11px] text-rose-400 mt-1">{fieldError('password')}</p>
        )}
      </div>

      <button type="submit" disabled={pending || autoSigningIn} className="glass-button-primary w-full py-3">
        {pending || autoSigningIn ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <UserPlus className="w-4 h-4" />
        )}
        <span>{pending || autoSigningIn ? 'Creating Account...' : 'Create Free Account'}</span>
      </button>

      <div className="text-center text-xs text-slate-400">
        Already have an account?{' '}
        <Link
          href={callbackUrl ? `/login?callbackUrl=${encodeURIComponent(callbackUrl)}` : '/login'}
          className="text-emerald-400 font-semibold hover:text-emerald-300 hover:underline"
        >
          Sign in
        </Link>
      </div>
    </form>
  );
}

export function RegisterFormSkeleton() {
  return (
    <div className="space-y-5 animate-pulse">
      <div className="h-4 w-1/3 bg-slate-800 rounded" />
      <div className="h-11 w-full bg-slate-800/70 rounded-xl" />
      <div className="h-4 w-1/3 bg-slate-800 rounded" />
      <div className="h-11 w-full bg-slate-800/70 rounded-xl" />
      <div className="h-4 w-1/3 bg-slate-800 rounded" />
      <div className="h-11 w-full bg-slate-800/70 rounded-xl" />
      <div className="h-12 w-full bg-slate-800 rounded-xl" />
    </div>
  );
}

export function RegisterFormWithSuspense() {
  return (
    <Suspense fallback={<RegisterFormSkeleton />}>
      <RegisterForm />
    </Suspense>
  );
}
