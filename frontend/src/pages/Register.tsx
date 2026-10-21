
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
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    const res = await register({
      name,
      email,
      phone,
      password,
      confirmPassword,
    });
    setLoading(false);

    if (!res.success) {
      setError(res.message || 'Registration failed');
      return;
    }

    setSuccess(true);
    setTimeout(() => {
      navigate('/citizen/overview');
    }, 1000);
  };

  const labelClass =
    'block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5';

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
            Create Your Account
          </h2>

          <p className="text-xs text-slate-500">
            Join EcoBin to report waste, earn Eco-Points, and keep Addis Ababa clean
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="flex items-center gap-2 bg-rose-50 border border-rose-200 text-rose-700 p-3 rounded-xl text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 p-3 rounded-xl text-xs">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Account created! Redirecting to dashboard...</span>
            </div>
          )}

          <div>
            <label className={labelClass}>
              <UserIcon className="w-3.5 h-3.5 text-emerald-500" />
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Jane Citizen"
              className={inputClass}
              required
              autoComplete="name"
            />
          </div>

          <div>
            <label className={labelClass}>
              <Mail className="w-3.5 h-3.5 text-emerald-500" />
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
              <Phone className="w-3.5 h-3.5 text-emerald-500" />
              Phone Number (Optional)
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+251 911 234 567"
              className={inputClass}
              autoComplete="tel"
            />
          </div>

          <div>
            <label className={labelClass}>
              <Lock className="w-3.5 h-3.5 text-emerald-500" />
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              className={inputClass}
              required
              minLength={8}
              autoComplete="new-password"
            />
          </div>

          <div>
            <label className={labelClass}>
              <Lock className="w-3.5 h-3.5 text-emerald-500" />
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter your password"
              className={inputClass}
              required
              minLength={8}
              autoComplete="new-password"
            />
          </div>

          <button
            type="submit"
            disabled={loading || success}
            className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm shadow-lg shadow-emerald-500/20 transition flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <UserPlus className="w-4 h-4" />
            )}
            <span>
              {loading ? 'Creating Account...' : 'Create Free Account'}
            </span>
          </button>

          <div className="text-center text-xs text-slate-500 pt-2">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-emerald-600 font-semibold hover:text-emerald-700 hover:underline"
            >
              Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
