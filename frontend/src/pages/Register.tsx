
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Mail,
  Lock,
  User as UserIcon,
  Phone,
  Loader2,
  UserPlus,
  AlertCircle,
  CheckCircle2,
  Recycle,
  ArrowLeft,
  Leaf,
} from 'lucide-react';

export function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const res = await register({
        name,
        email,
        phone,
        password,
        confirmPassword,
      });

      if (!res.success) {
        setError(res.message || 'Registration failed. Please try again.');
        return;
      }

      setSuccess(true);

      setTimeout(() => {
        navigate('/citizen/overview');
      }, 1000);
    } catch {
      setError('Unable to create your account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const labelClass =
    'mb-1.5 flex items-center gap-2 text-sm font-semibold text-slate-700';

  const inputClass =
    'w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:bg-slate-50';

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#F5F8F4] px-4 py-8 font-sans text-slate-800 sm:px-6 sm:py-12 lg:px-8">
      <div className="w-full max-w-xl">
        {/* Back to home link */}
        <div className="mb-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200/80 bg-white/90 px-3.5 py-2 text-sm font-medium text-slate-600 shadow-sm backdrop-blur-sm transition hover:border-emerald-300 hover:bg-white hover:text-emerald-700"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to home</span>
          </Link>
        </div>

        {/* Main content */}
        <main className="w-full">
          <div className="w-full overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-xl shadow-slate-200/40">
            <section className="p-6 sm:p-9 lg:p-10">
              <div className="mb-7">
                {/* EcoBin Brand Logo placed inside the card at the top */}
                <div className="mb-6">
                  <Link
                    to="/"
                    aria-label="Back to homepage"
                    className="group inline-flex items-center gap-2.5 transition-transform hover:scale-105"
                  >
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-md shadow-emerald-600/25">
                      <Recycle className="h-6 w-6" />
                    </span>
                    <span className="text-2xl font-extrabold tracking-tight text-slate-900">
                      Eco<span className="text-emerald-600">Bin</span>
                    </span>
                  </Link>
                </div>

                <p className="mb-2 text-sm font-semibold text-emerald-700">
                  Get started for free
                </p>

                <h2 className="text-3xl font-extrabold tracking-tight text-slate-800">
                  Create your account
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Join EcoBin and help keep your community clean.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div
                    role="alert"
                    className="flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-sm text-rose-700"
                  >
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {success && (
                  <div
                    role="status"
                    className="flex items-start gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-sm text-emerald-800"
                  >
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>
                      Account created successfully! Redirecting to your
                      dashboard...
                    </span>
                  </div>
                )}

                <div>
                  <label htmlFor="register-name" className={labelClass}>
                    <UserIcon className="h-4 w-4 text-emerald-600" />
                    Full name
                  </label>
                  <input
                    id="register-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your full name"
                    className={inputClass}
                    required
                    autoComplete="name"
                    disabled={loading || success}
                  />
                </div>

                <div>
                  <label htmlFor="register-email" className={labelClass}>
                    <Mail className="h-4 w-4 text-emerald-600" />
                    Email address
                  </label>
                  <input
                    id="register-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className={inputClass}
                    required
                    autoComplete="email"
                    disabled={loading || success}
                  />
                </div>

                <div>
                  <label htmlFor="register-phone" className={labelClass}>
                    <Phone className="h-4 w-4 text-emerald-600" />
                    Phone number
                    <span className="font-normal text-slate-400">
                      (Optional)
                    </span>
                  </label>
                  <input
                    id="register-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+251 911 234 567"
                    className={inputClass}
                    autoComplete="tel"
                    disabled={loading || success}
                  />
                </div>

                <div>
                  <label htmlFor="register-password" className={labelClass}>
                    <Lock className="h-4 w-4 text-emerald-600" />
                    Password
                  </label>
                  <input
                    id="register-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 8 characters"
                    className={inputClass}
                    required
                    minLength={8}
                    autoComplete="new-password"
                    disabled={loading || success}
                  />
                  <p className="mt-1.5 text-xs text-slate-500">
                    Use at least 8 characters.
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="register-confirm-password"
                    className={labelClass}
                  >
                    <Lock className="h-4 w-4 text-emerald-600" />
                    Confirm password
                  </label>
                  <input
                    id="register-confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Enter your password again"
                    className={inputClass}
                    required
                    minLength={8}
                    autoComplete="new-password"
                    disabled={loading || success}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || success}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3.5 text-sm font-bold text-white shadow-md shadow-emerald-600/15 transition hover:bg-emerald-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <UserPlus className="h-4 w-4" />
                  )}
                  <span>
                    {loading ? 'Creating account...' : 'Create free account'}
                  </span>
                </button>

                <p className="pt-2 text-center text-sm text-slate-500">
                  Already have an account?{' '}
                  <Link
                    to="/login"
                    className="font-bold text-emerald-700 transition hover:text-emerald-800 hover:underline"
                  >
                    Sign in
                  </Link>
                </p>
              </form>
            </section>
          </div>
        </main>

        <footer className="py-5 text-center text-xs text-slate-500">
          Making waste management smarter, one step at a time.
        </footer>
      </div>
    </div>
  );
}

