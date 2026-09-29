import Link from 'next/link';
import { Recycle, ArrowLeft, Sparkles } from 'lucide-react';
import { RegisterFormWithSuspense } from '@/components/auth/RegisterForm';

export const metadata = {
  title: 'Create Account — EcoBin Smart Waste Platform',
};

export default function RegisterPage() {
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
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-semibold w-fit">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            Free for citizens — start earning today
          </div>
          <h1 className="text-4xl font-extrabold leading-tight text-white">
            Become an{' '}
            <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
              Eco Guardian.
            </span>
          </h1>
          <p className="text-slate-400 max-w-md text-sm">
            Every validated waste report earns you +50 Eco-Points redeemable for transit vouchers,
            eco-merch, and more.
          </p>

          <div className="space-y-3 pt-2">
            {[
              { pts: '+50', desc: 'per validated waste report' },
              { pts: '+100', desc: 'per bulk pickup completed' },
              { pts: 'Vouchers', desc: 'transit passes, coffee & eco-merch' },
            ].map((r) => (
              <div key={r.desc} className="flex items-center gap-4">
                <span className="text-sm font-extrabold text-amber-400 w-20">{r.pts}</span>
                <span className="text-xs text-slate-500">{r.desc}</span>
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
              <h2 className="text-2xl font-extrabold text-white">Create your account</h2>
              <p className="text-sm text-slate-400 mt-1">Join as a Citizen and start reporting waste</p>
            </div>

            <RegisterFormWithSuspense />
          </div>
        </div>
      </div>
    </div>
  );
}
