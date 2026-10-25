
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
  ArrowLeft,
  Leaf,
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

    try {
      const res = await login({
        email: loginEmail,
        password: loginPass,
      });

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
    } catch {
      setError('Unable to sign in right now. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await executeLogin(email, password);
  };

  const inputClass =
    'w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 disabled:opacity-60';

  const labelClass =
    'mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700';

  return (
    <main className="min-h-screen bg-[#F5F8F4] px-4 py-6 font-sans text-slate-800 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-6xl flex-col">
        <header className="flex items-center justify-between py-3">
          <Link
            to="/"
            aria-label="Back to homepage"
            className="inline-flex items-center gap-2 rounded-lg text-lg font-extrabold tracking-tight text-slate-800"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white">
              <Recycle className="h-6 w-6" />
            </span>
            Eco<span className="text-emerald-700">Bin</span>
          </Link>

          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-white hover:text-emerald-700"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Back to home</span>
            <span className="sm:hidden">Home</span>
          </Link>
        </header>

        <section className="flex flex-1 items-center justify-center py-8 sm:py-12">
          <div className="w-full max-w-xl overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-xl shadow-slate-200/50">

            <div className="p-6 sm:p-9 lg:p-10">
              <div className="mb-8">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 md:hidden">
                  <Recycle className="h-6 w-6" />
                </div>

                <p className="text-sm font-semibold text-emerald-700">
                  Welcome back
                </p>

                <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                  Sign in to your account
                </h2>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                  Enter your email and password to continue to EcoBin.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <div
                    role="alert"
                    className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700"
                  >
                    <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div>
                  <label htmlFor="login-email" className={labelClass}>
                    <Mail className="h-4 w-4 text-emerald-700" />
                    Email address
                  </label>

                  <input
                    id="login-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className={inputClass}
                    required
                    autoComplete="email"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label htmlFor="login-password" className={labelClass}>
                    <Lock className="h-4 w-4 text-emerald-700" />
                    Password
                  </label>

                  <input
                    id="login-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className={inputClass}
                    required
                    autoComplete="current-password"
                    disabled={loading}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-700/15 transition hover:bg-emerald-800 focus:outline-none focus:ring-4 focus:ring-emerald-600/20 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <LogIn className="h-4 w-4" />
                  )}
                  {loading ? 'Signing in...' : 'Sign In'}
                </button>

                <p className="text-center text-sm text-slate-500">
                  New to EcoBin?{' '}
                  <Link
                    to="/register"
                    className="font-bold text-emerald-700 hover:text-emerald-900 hover:underline"
                  >
                    Create an account
                  </Link>
                </p>

                <div className="border-t border-slate-100 pt-5">
                  <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">
                    Quick demo access
                  </p>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      disabled={loading}
                      onClick={() => {
                        setEmail('citizen@ecobin.org');
                        setPassword('password123');
                        void executeLogin('citizen@ecobin.org', 'password123');
                      }}
                      className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-100 disabled:opacity-50"
                    >
                      Citizen
                    </button>

                    <button
                      type="button"
                      disabled={loading}
                      onClick={() => {
                        setEmail('collector@ecobin.org');
                        setPassword('password123');
                        void executeLogin('collector@ecobin.org', 'password123');
                      }}
                      className="rounded-xl border border-sky-200 bg-sky-50 px-3 py-2.5 text-sm font-semibold text-sky-800 transition hover:bg-sky-100 disabled:opacity-50"
                    >
                      Collector
                    </button>

                    <button
                      type="button"
                      disabled={loading}
                      onClick={() => {
                        setEmail('recycling@ecobin.org');
                        setPassword('password123');
                        void executeLogin('recycling@ecobin.org', 'password123');
                      }}
                      className="rounded-xl border border-teal-200 bg-teal-50 px-3 py-2.5 text-sm font-semibold text-teal-800 transition hover:bg-teal-100 disabled:opacity-50"
                    >
                      Recycler
                    </button>

                    <button
                      type="button"
                      disabled={loading}
                      onClick={() => {
                        setEmail('admin@ecobin.org');
                        setPassword('password123');
                        void executeLogin('admin@ecobin.org', 'password123');
                      }}
                      className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5 text-sm font-semibold text-amber-800 transition hover:bg-amber-100 disabled:opacity-50"
                    >
                      Admin
                    </button>
                  </div>

                  <p className="mt-3 text-xs leading-5 text-slate-400">
                    Demo access works only when these accounts are configured
                    in your development environment.
                  </p>
                </div>
              </form>
            </div>
          </div>
        </section>

        <footer className="py-4 text-center text-xs text-slate-400">
          EcoBin ┬╖ Smarter waste management for cleaner communities
        </footer>
      </div>
    </main>
  );
}

