import Link from 'next/link';
import { Recycle, MapPin, Shield, Award, ArrowLeft } from 'lucide-react';
import { LoginFormWithSuspense } from '@/components/auth/LoginForm';

export const metadata = {
  title: 'Sign In — EcoBin Smart Waste Platform',
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-brand-dark flex flex-col lg:flex-row">
      {/* Left brand panel */}
      <div className="relative hidden lg:flex lg:w-1/2 flex-col justify-between p-12 bg-gradient-to-br from-emerald-950 via-slate-950 to-brand-dark border-r border-slate-800/80 overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-sky-500/5 blur-3xl" />

        <Link href="/" className="flex items-center gap-3 relative z-10">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-eco-600 via-emerald-500 to-teal-400 p-0.5 shadow-lg shadow-emerald-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Recycle className="w-6 h-6 text-emerald-400" />
            </div>
          </div>
          <span className="text-2xl font-extrabold tracking-tight text-white">EcoBin</span>
        </Link>

        <div className="relative z-10 space-y-6">
          <h1 className="text-4xl font-extrabold leading-tight text-white">
            A cleaner city starts with{' '}
            <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
              one report.
            </span>
          </h1>
          <p className="text-slate-400 max-w-md text-sm">
            Join citizens, field collectors, and municipal administrators on a single smart
            waste-management network. Report issues, track cleanup routes, and earn Eco-Points.
          </p>

          <div className="space-y-3 pt-2">
            {[
              { icon: MapPin, title: 'Report & geotag waste', desc: 'GPS-pinned incident reports with photo proof' },
              { icon: Shield, title: 'Role-based dashboards', desc: 'Citizen, Collector, and Municipal Admin workspaces' },
              { icon: Award, title: 'Earn Eco-Points', desc: 'Redeem rewards for keeping your district clean' },
            ].map((f) => (
              <div key={f.title} className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/25 text-emerald-400 flex items-center justify-center shrink-0">
                  <f.icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-200">{f.title}</div>
                  <div className="text-xs text-slate-500">{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-[11px] text-slate-600 relative z-10">© 2026 EcoBin Municipal Infrastructure</p>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-emerald-400 transition-colors mb-6"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to home
          </Link>

          <div className="glass-card p-8">
            <div className="mb-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-eco-600 to-teal-500 p-0.5 mb-4 lg:hidden">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                  <Recycle className="w-6 h-6 text-emerald-400" />
                </div>
              </div>
              <h2 className="text-2xl font-extrabold text-white">Welcome back</h2>
              <p className="text-sm text-slate-400 mt-1">Sign in to access your EcoBin dashboard</p>
            </div>

            <LoginFormWithSuspense />
          </div>
        </div>
      </div>
    </div>
  );
}
