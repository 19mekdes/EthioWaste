
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Mail,
  Lock,
  Loader2,
  LogIn,
  AlertCircle,
  Recycle,
} from 'lucide-react';

export function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const executeLogin = async (loginEmail: string, loginPass: string) => {
    setLoading(true);
    setError('');
    const res = await login({ email: loginEmail, password: loginPass });
    setLoading(false);

    if (!res.success) {
      setError(res.message || 'Invalid email or password.');
      return;
    }

    const emailLower = loginEmail.toLowerCase();
    if (emailLower.includes('admin')) {
      navigate('/admin/overview');
    } else if (emailLower.includes('collector')) {
      navigate('/collector/overview');
    } else if (emailLower.includes('recycling')) {
      navigate('/recycling/overview');
    } else {
      navigate('/citizen/overview');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await executeLogin(email, password);
  };

  const labelClass =
    'block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5';

  const inputClass =
    'w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500';

  return (
    <div className="min-h-screen bg-[#F8FAF8] text-slate-800 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12 font-sans">
      <div className="max-w-md w-full bg-white border border-emerald-100 rounded-3xl p-5 sm:p-8 shadow-xl space-y-5 sm:space-y-6">
        <div className="text-center space-y-2">
          <Link
            to="/"
            title="Go back to Home Page"
            aria-label="Back to home page"
            className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-500 border border-emerald-100 mb-2 hover:bg-emerald-100 hover:border-emerald-200 hover:scale-105 active:scale-95 transition-all cursor-pointer group shadow-sm"
          >
            <Recycle className="w-6 h-6 text-emerald-500 group-hover:rotate-180 transition-transform duration-500" />
          </Link>

          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
            Welcome Back to EcoBin
          </h2>
          <p className="text-xs text-slate-500">
            Sign in to manage waste reports, collections, and recycling operations
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          {error && (
            <div className="flex items-center gap-2 bg-rose-50 border border-rose-200 text-rose-700 p-3 rounded-xl text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className={labelClass}>
              <Mail className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className={inputClass}
              required
              autoComplete="email"
            />
          </div>

          <div>
            <label className={labelClass}>
              <Lock className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className={inputClass}
              required
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm shadow-lg shadow-emerald-500/20 transition flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin shrink-0" />
            ) : (
              <LogIn className="w-4 h-4 shrink-0" />
            )}
            <span>Sign In to EcoBin</span>
          </button>

          <div className="text-center text-xs text-slate-500">
            New to EcoBin?{' '}
            <Link
              to="/register"
              className="text-emerald-600 font-semibold hover:text-emerald-700 hover:underline"
            >
              Create an account
            </Link>
          </div>

          <div className="bg-[#F8FAF8] border border-slate-200 rounded-xl p-3 sm:p-4 text-[11px] text-slate-600 space-y-2.5 pt-3 sm:pt-4">
            <div className="flex items-center gap-1.5 font-semibold text-slate-700">
              <Recycle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              Quick 1-Click Login:
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  setEmail('citizen@ecobin.org');
                  setPassword('password123');
                  executeLogin('citizen@ecobin.org', 'password123');
                }}
                className="px-1.5 sm:px-2 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 font-semibold text-center transition-all text-[11px] sm:text-xs truncate"
              >
                👤 Citizen
              </button>

              <button
                type="button"
                onClick={() => {
                  setEmail('collector@ecobin.org');
                  setPassword('password123');
                  executeLogin('collector@ecobin.org', 'password123');
                }}
                className="px-1.5 sm:px-2 py-1.5 rounded-lg bg-sky-50 text-sky-700 border border-sky-200 hover:bg-sky-100 font-semibold text-center transition-all text-[11px] sm:text-xs truncate"
              >
                🚚 Collector
              </button>

              <button
                type="button"
                onClick={() => {
                  setEmail('recycling@ecobin.org');
                  setPassword('password123');
                  executeLogin('recycling@ecobin.org', 'password123');
                }}
                className="px-1.5 sm:px-2 py-1.5 rounded-lg bg-teal-50 text-teal-700 border border-teal-200 hover:bg-teal-100 font-semibold text-center transition-all text-[11px] sm:text-xs truncate"
              >
                ♻️ Recycler
              </button>

              <button
                type="button"
                onClick={() => {
                  setEmail('admin@ecobin.org');
                  setPassword('password123');
                  executeLogin('admin@ecobin.org', 'password123');
                }}
                className="px-1.5 sm:px-2 py-1.5 rounded-lg bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 font-semibold text-center transition-all text-[11px] sm:text-xs truncate"
              >
                🛡️ Admin
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
