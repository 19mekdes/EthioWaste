
import React from 'react';
import { Link } from 'react-router-dom';
import {
  Recycle,
  Trash2,
  Truck,
  Building2,
  ShieldCheck,
  ArrowRight,
  Leaf,
  CheckCircle2,
  MapPin,
  Users,
  Sprout,
  Globe2,
  ClipboardList,
} from 'lucide-react';

const stakeholders = [
  {
    title: 'Citizens',
    description:
      'Help keep your neighborhood clean by reporting waste concerns and requesting collection.',
    icon: Trash2,
    color: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
  },
  {
    title: 'Waste Collectors',
    description:
      'Support organized waste collection and keep track of assigned collection activities.',
    icon: Truck,
    color: 'bg-sky-500/10 text-sky-400 border border-sky-500/20',
  },
  {
    title: 'Recycling Organizations',
    description:
      'Support the responsible handling of recyclable materials and help reduce waste.',
    icon: Building2,
    color: 'bg-teal-500/10 text-teal-400 border border-teal-500/20',
  },
  {
    title: 'City Administrators',
    description:
      'Coordinate waste management activities and support better-informed decisions.',
    icon: ShieldCheck,
    color: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
  },
];

const steps = [
  {
    number: '01',
    title: 'Report a waste concern',
    description:
      'Residents can use the platform to report waste concerns or explore collection options.',
    icon: ClipboardList,
  },
  {
    number: '02',
    title: 'Coordinate collection',
    description:
      'The platform is designed to help relevant teams organize and manage waste collection activities.',
    icon: Truck,
  },
  {
    number: '03',
    title: 'Encourage responsible recycling',
    description:
      'Connect waste management with recycling efforts to support a cleaner, more sustainable city.',
    icon: Recycle,
  },
];

export const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-brand-dark text-slate-100 font-sans selection:bg-eco-500 selection:text-white">
      {/* Navigation */}
      <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-900/90 backdrop-blur-md">
        <nav
          className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:px-8"
          aria-label="Main navigation"
        >
          <Link to="/" className="flex shrink-0 items-center gap-3 group">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-400 p-0.5 shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform shrink-0">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Recycle className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400" />
              </div>
            </div>
            <div>
              <span className="block text-lg font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent sm:text-xl">
                EcoBin
              </span>
              <span className="hidden text-xs text-slate-400 sm:block">
                Smarter Waste Management
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              to="/login"
              className="rounded-xl px-3 py-2 text-xs sm:text-sm font-bold text-slate-300 border border-slate-800 hover:border-slate-700 hover:text-white transition"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center gap-1.5 sm:gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-xs sm:text-sm font-bold text-slate-950 shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-400 active:scale-95"
            >
              Get Started
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </nav>
      </header>

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-brand-dark to-slate-900/60 pt-12 pb-20 sm:pt-20 sm:pb-28 lg:py-32">
          <div className="pointer-events-none absolute -right-24 -top-20 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 -left-24 h-96 w-96 rounded-full bg-teal-500/10 blur-3xl" />

          <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:gap-16">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-xs sm:text-sm font-bold text-emerald-400 shadow-sm">
                <Leaf className="h-4 w-4" />
                Building a cleaner Addis Ababa
              </div>

              <h1 className="max-w-2xl text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
                A cleaner city starts with{' '}
                <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                  smarter waste management.
                </span>
              </h1>

              <p className="mt-6 max-w-xl text-base leading-8 text-slate-300 sm:text-lg">
                EcoBin brings citizens, waste collectors, recycling
                organizations, and city administrators together to support
                more organized waste management and a greener urban future.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-6 py-4 font-bold text-slate-950 shadow-xl shadow-emerald-500/25 transition hover:bg-emerald-400 hover:-translate-y-0.5 active:scale-95"
                >
                  Get Started
                  <ArrowRight className="h-5 w-5" />
                </Link>

                <a
                  href="#how-it-works"
                  className="inline-flex items-center justify-center rounded-xl border border-slate-700 bg-slate-800/80 px-6 py-4 font-semibold text-slate-200 transition hover:bg-slate-700/80 hover:border-slate-600"
                >
                  Discover How It Works
                </a>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-slate-400">
                <span className="inline-flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  Community focused
                </span>
                <span className="inline-flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  Sustainability minded
                </span>
              </div>
            </div>

            {/* Decorative hero illustration */}
            <div className="relative mx-auto w-full max-w-lg">
              <div className="absolute inset-6 rounded-[2rem] bg-emerald-500/10 blur-2xl" />

              <div className="relative overflow-hidden rounded-3xl border border-slate-800/80 bg-slate-900/70 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-400">
                      A shared responsibility
                    </p>
                    <h2 className="mt-1 text-xl font-extrabold text-white sm:text-2xl">
                      Better together.
                    </h2>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <Sprout className="h-7 w-7" />
                  </div>
                </div>

                <div className="my-7 flex items-center justify-center rounded-2xl bg-gradient-to-br from-slate-950/80 to-slate-900/80 border border-slate-800/80 py-10">
                  <div className="relative flex h-44 w-44 items-center justify-center rounded-full border border-slate-700 bg-slate-900/80 shadow-inner">
                    <div className="absolute -left-3 top-7 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 border border-slate-700 text-emerald-400 shadow-md">
                      <Users className="h-6 w-6" />
                    </div>
                    <div className="absolute -right-3 top-7 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 border border-slate-700 text-sky-400 shadow-md">
                      <Truck className="h-6 w-6" />
                    </div>
                    <div className="absolute -bottom-2 left-1/2 flex h-12 w-12 -translate-x-1/2 items-center justify-center rounded-xl bg-slate-900 border border-slate-700 text-teal-400 shadow-md">
                      <Building2 className="h-6 w-6" />
                    </div>
                    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/30">
                      <Recycle className="h-12 w-12" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-xl bg-slate-950/60 border border-slate-800/80 p-3 text-center">
                    <Users className="mx-auto h-5 w-5 text-emerald-400" />
                    <p className="mt-2 text-xs font-semibold text-slate-300">
                      Community
                    </p>
                  </div>
                  <div className="rounded-xl bg-slate-950/60 border border-slate-800/80 p-3 text-center">
                    <Truck className="mx-auto h-5 w-5 text-sky-400" />
                    <p className="mt-2 text-xs font-semibold text-slate-300">
                      Collection
                    </p>
                  </div>
                  <div className="rounded-xl bg-slate-950/60 border border-slate-800/80 p-3 text-center">
                    <Recycle className="mx-auto h-5 w-5 text-teal-400" />
                    <p className="mt-2 text-xs font-semibold text-slate-300">
                      Recycling
                    </p>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-5 -left-3 hidden items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/90 backdrop-blur-md p-4 shadow-xl sm:flex">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <Globe2 className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">
                    A greener future
                  </p>
                  <p className="text-xs text-slate-400">
                    One community at a time
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stakeholders */}
        <section className="px-5 py-20 sm:px-8 sm:py-24 border-t border-slate-800/80 bg-slate-900/40">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
                One platform, shared purpose
              </span>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                Waste management works better together
              </h2>
              <p className="mt-4 leading-7 text-slate-400">
                EcoBin is designed to support the people and organizations
                involved in keeping our communities clean.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {stakeholders.map((item) => {
                const Icon = item.icon;

                return (
                  <article
                    key={item.title}
                    className="glass-card group rounded-2xl border border-slate-800 bg-slate-900/60 p-6 transition duration-200 hover:-translate-y-1 hover:border-emerald-500/40 hover:shadow-lg hover:shadow-emerald-500/10"
                  >
                    <div
                      className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl p-3 border ${item.color}`}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-bold text-white">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-slate-400">
                      {item.description}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section
          id="how-it-works"
          className="border-y border-slate-800/80 bg-slate-950/70 px-5 py-20 sm:px-8 sm:py-24"
        >
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto mb-14 max-w-2xl text-center">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
                A simpler approach
              </span>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                How EcoBin works
              </h2>
              <p className="mt-4 leading-7 text-slate-400">
                A shared approach can help make waste reporting, collection,
                and recycling easier to coordinate.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-6">
              {steps.map((step, index) => {
                const Icon = step.icon;

                return (
                  <article key={step.number} className="relative">
                    {index < steps.length - 1 && (
                      <div className="absolute left-[4.5rem] top-9 hidden h-px w-[calc(100%-3rem)] bg-slate-800 md:block" />
                    )}

                    <div className="relative mb-6 flex items-center gap-4">
                      <div className="flex h-[4.5rem] w-[4.5rem] shrink-0 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900/90 text-emerald-400 shadow-md">
                        <Icon className="h-8 w-8" />
                      </div>
                      <span className="text-xs font-extrabold tracking-widest text-emerald-400">
                        STEP {step.number}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-white">
                      {step.title}
                    </h3>
                    <p className="mt-3 max-w-sm text-sm leading-7 text-slate-400">
                      {step.description}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* Why it matters */}
        <section className="px-5 py-20 sm:px-8 sm:py-24 bg-brand-dark">
          <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2 lg:gap-20">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
                Why it matters
              </span>
              <h2 className="mt-3 text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl">
                Small actions can help create cleaner communities.
              </h2>
              <p className="mt-5 leading-8 text-slate-300">
                Responsible waste management takes cooperation. When
                residents, collection teams, and recycling organizations
                work toward a common goal, communities have more
                opportunities to manage waste thoughtfully.
              </p>

              <Link
                to="/register"
                className="mt-7 inline-flex items-center gap-2 font-bold text-emerald-400 transition hover:text-emerald-300"
              >
                Join the community
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <article className="glass-card rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:translate-y-6">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-800/80 text-emerald-400 border border-slate-700/60 shadow-sm">
                  <MapPin className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-white">
                  Cleaner neighborhoods
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Encourage residents to take part in identifying waste
                  concerns in their communities.
                </p>
              </article>

              <article className="glass-card rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-800/80 text-teal-400 border border-slate-700/60 shadow-sm">
                  <Recycle className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-white">
                  Responsible recycling
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Promote awareness of recyclable materials and responsible
                  waste handling.
                </p>
              </article>

              <article className="glass-card rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:translate-y-6">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-800/80 text-sky-400 border border-slate-700/60 shadow-sm">
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-white">
                  Community participation
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Give residents and waste management teams a shared
                  starting point for cooperation.
                </p>
              </article>

              <article className="glass-card rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-800/80 text-amber-400 border border-slate-700/60 shadow-sm">
                  <Sprout className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-white">
                  A sustainable future
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Support everyday choices that contribute to a more
                  environmentally responsible city.
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* Call to action */}
        <section className="px-5 pb-20 sm:px-8 sm:pb-24">
          <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-emerald-950/60 to-slate-900 border border-emerald-500/30 px-6 py-12 text-center sm:px-12 sm:py-16 shadow-2xl shadow-emerald-500/10">
            <div className="pointer-events-none absolute -right-12 -top-24 h-64 w-64 rounded-full border-[40px] border-white/5" />
            <div className="pointer-events-none absolute -bottom-28 -left-12 h-64 w-64 rounded-full border-[40px] border-white/5" />

            <div className="relative mx-auto max-w-2xl">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 shadow-lg shadow-emerald-500/20">
                <Leaf className="h-7 w-7" />
              </div>
              <h2 className="mt-6 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                Be part of a cleaner Addis Ababa.
              </h2>
              <p className="mt-4 leading-7 text-slate-300">
                Take the first step toward more responsible waste management.
                Explore EcoBin and discover how you can participate.
              </p>
              <Link
                to="/register"
                className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-8 py-3.5 font-bold text-slate-950 shadow-xl shadow-emerald-500/25 transition hover:bg-emerald-400 active:scale-95"
              >
                Get Started Today
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 px-5 py-8 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 text-center sm:flex-row sm:text-left">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 group-hover:scale-105 transition-transform">
              <Recycle className="h-5 w-5" />
            </div>
            <div>
              <span className="block font-extrabold text-white">
                EcoBin
              </span>
              <span className="text-xs text-slate-400">
                Smarter Waste Management
              </span>
            </div>
          </Link>

          <p className="text-sm text-slate-400">
            © {new Date().getFullYear()} EcoBin. Building a cleaner future
            together.
          </p>

          <div className="flex items-center gap-4 text-sm font-medium text-slate-400">
            <Link to="/login" className="transition hover:text-emerald-400">
              Sign In
            </Link>
            <Link to="/register" className="transition hover:text-emerald-400">
              Register
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
