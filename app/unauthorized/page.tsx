import Link from 'next/link';
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';

export const metadata = {
  title: 'Access Denied — EcoBin Platform',
};

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-brand-dark flex items-center justify-center p-4">
      <div className="glass-card max-w-md w-full p-8 text-center space-y-6 border-rose-500/30">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center mx-auto">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-extrabold text-white">403 — Access Denied</h1>
          <p className="text-xs text-slate-400 leading-relaxed">
            You do not have permission to access this page or dashboard. Access is restricted based on your assigned account role.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-auto glass-button-primary text-xs py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-700"
          >
            <Home className="w-4 h-4" />
            <span>Go to Home</span>
          </Link>

          <Link
            href="/login"
            className="w-full sm:w-auto glass-button-primary text-xs py-2.5 px-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Sign In with Role</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
