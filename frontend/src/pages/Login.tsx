import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Mail, Lock, Loader2, LogIn, AlertCircle, Recycle } from 'lucide-react';

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

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-12 font-sans">
      <div className="max-w-md w-full bg-slate-800/80 border border-slate-700/60 rounded-3xl p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-2">
            <Recycle className="w-6 h-6 text-emerald-400" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Welcome Back to EcoBin</h2>
          <p className="text-xs text-slate-400">Sign in to manage waste reports, collections, and recycling operations</p>
        </div>

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
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/20 transition flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4" />}
            <span>Sign In to EcoBin</span>
          </button>

          <div className="text-center text-xs text-slate-400">
            New to EcoBin?{' '}
            <Link
              to="/register"
              className="text-emerald-400 font-semibold hover:text-emerald-300 hover:underline"
            >
              Create an account
            </Link>
          </div>

          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 text-[11px] text-slate-400 space-y-2.5 pt-4">
            <div className="flex items-center gap-1.5 font-semibold text-slate-300">
              <Recycle className="w-3.5 h-3.5 text-emerald-400" />
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
                className="px-2 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 font-semibold text-center transition-all text-xs"
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
                className="px-2 py-1.5 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/30 hover:bg-sky-500/20 font-semibold text-center transition-all text-xs"
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
                className="px-2 py-1.5 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/30 hover:bg-teal-500/20 font-semibold text-center transition-all text-xs"
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
                className="px-2 py-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500/20 font-semibold text-center transition-all text-xs"
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
