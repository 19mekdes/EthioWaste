
import React from 'react';
import { Link } from 'react-router-dom';
import {
  Recycle,
  Trash2,
  Truck,
  Building2,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Leaf,
  MapPin,
  ClipboardList,
  Sprout,
} from 'lucide-react';

const services = [
  {
    icon: Trash2,
    title: 'For Citizens',
    description:
      'Report waste in your neighborhood, request collections, and help keep your community clean.',
    link: 'Create an account',
    color: 'emerald',
  },
  {
    icon: Truck,
    title: 'For Collectors',
    description:
      'Manage collection requests, organize assigned tasks, and track waste collection activities.',
    link: 'Join the platform',
    color: 'teal',
  },
  {
    icon: Building2,
    title: 'For Recycling Organizations',
    description:
      'Connect with recyclable materials and coordinate recycling activities more efficiently.',
    link: 'Explore the platform',
    color: 'cyan',
  },
  {
    icon: ShieldCheck,
    title: 'For City Administrators',
    description:
      'Oversee waste reports, coordinate services, and use platform data to support decisions.',
    link: 'Sign in to continue',
    color: 'amber',
  },
];

const colorStyles: Record<string, string> = {
  emerald: 'bg-emerald-400/10 text-emerald-400',
  teal: 'bg-teal-400/10 text-teal-400',
  cyan: 'bg-cyan-400/10 text-cyan-400',
  amber: 'bg-amber-400/10 text-amber-400',
};

const steps = [
  {
    number: '01',
    icon: ClipboardList,
    title: 'Report the waste',
    description:
      'Citizens submit waste reports or collection requests through the platform.',
  },
  {
    number: '02',
    icon: Truck,
    title: 'Coordinate collection',
    description:
      'Relevant teams can review requests and coordinate collection activities.',
  },
  {
    number: '03',
    icon: Sprout,
    title: 'Support a cleaner city',
    description:
      'Better coordination helps communities work toward cleaner public spaces and responsible recycling.',
  },
];

export const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-100">
      <h1 className="bg-red-600 p-4 text-white">
  TEST: NEW HOMEPAGE
</h1>
      {/* Navigation */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <Link to="/" className="flex shrink-0 items-center gap-3">
            <div className="rounded-xl bg-emerald-400 p-2.5">
              <Recycle className="h-6 w-6 text-slate-950" />
            </div>

            <div>
              <span className="text-lg font-extrabold tracking-tight text-white sm:text-xl">
                EcoSmart <span className="text-emerald-400">Addis</span>
              </span>
              <span className="hidden text-xs text-slate-400 sm:block">
                Smart Waste Management
              </span>
            </div>
          </Link>

          <nav className="flex items-center gap-2 sm:gap-5">
            <a
              href="#services"
              className="hidden text-sm font-medium text-slate-300 transition hover:text-emerald-400 sm:inline"
            >
              Services
            </a>

            <a
              href="#how-it-works"
              className="hidden text-sm font-medium text-slate-300 transition hover:text-emerald-400 sm:inline"
            >
              How It Works
            </a>

            <Link
              to="/login"
              className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-200 transition hover:text-emerald-400"
            >
              Sign In
            </Link>

            <Link
              to="/register"
              className="rounded-lg bg-emerald-400 px-4 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-emerald-300"
            >
              Get Started
            </Link>
          </nav>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="relative isolate overflow-hidden">
          <div className="pointer-events-none absolute -right-40 -top-20 -z-10 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />
          <div className="pointer-events-none absolute -left-40 top-40 -z-10 h-80 w-80 rounded-full bg-teal-500/10 blur-3xl" />

          <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 py-20 sm:px-8 sm:py-28 lg:grid-cols-2 lg:gap-16">
            <div>
              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/5 px-4 py-2 text-sm font-medium text-emerald-300">
                <MapPin className="h-4 w-4" />
                Building a cleaner Addis Ababa
              </div>

              <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
                A smarter way to manage{' '}
                <span className="text-emerald-400">waste.</span>
              </h1>

              <p className="mt-6 max-w-xl text-base leading-8 text-slate-300 sm:text-lg">
                Connecting citizens, waste collectors, recycling organizations,
                and city administrators through one platform for better waste
                management and cleaner communities.
              </p>

              <div className="mt-9 flex flex-wrap gap-4">
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-400 px-6 py-3.5 font-bold text-slate-950 transition hover:bg-emerald-300"
                >
                  Get Started
                  <ArrowRight className="h-5 w-5" />
                </Link>

                <a
                  href="#how-it-works"
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-700 px-6 py-3.5 font-semibold text-white transition hover:border-emerald-400/50 hover:bg-white/5"
                >
                  Learn How It Works
                </a>
              </div>

              <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-400">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  Easier reporting
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  Better coordination
                </span>
              </div>
            </div>

            {/* Visual panel */}
            <div className="relative mx-auto w-full max-w-lg">
              <div className="absolute -inset-4 rounded-3xl bg-emerald-400/10 blur-2xl" />

              <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl sm:p-8">
                <div className="flex items-center justify-between border-b border-white/10 pb-5">
                  <div>
                    <p className="text-sm text-slate-400">Our shared goal</p>
                    <h2 className="mt-1 text-xl font-bold text-white">
                      Cleaner communities
                    </h2>
                  </div>

                  <div className="rounded-2xl bg-emerald-400/10 p-3">
                    <Leaf className="h-7 w-7 text-emerald-400" />
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  <div className="flex items-start gap-4 rounded-2xl border border-white/5 bg-white/[0.03] p-4">
                    <div className="rounded-xl bg-emerald-400/10 p-3">
                      <Trash2 className="h-6 w-6 text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">
                        Report waste
                      </h3>
                      <p className="mt-1 text-sm leading-6 text-slate-400">
                        Help identify waste that needs attention in your area.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 rounded-2xl border border-white/5 bg-white/[0.03] p-4">
                    <div className="rounded-xl bg-teal-400/10 p-3">
                      <Truck className="h-6 w-6 text-teal-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">
                        Coordinate services
                      </h3>
                      <p className="mt-1 text-sm leading-6 text-slate-400">
                        Help collection teams manage requests and tasks.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 rounded-2xl border border-white/5 bg-white/[0.03] p-4">
                    <div className="rounded-xl bg-cyan-400/10 p-3">
                      <Recycle className="h-6 w-6 text-cyan-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">
                        Encourage recycling
                      </h3>
                      <p className="mt-1 text-sm leading-6 text-slate-400">
                        Support more responsible handling of recyclable waste.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 rounded-xl border border-emerald-400/20 bg-emerald-400/5 p-4 text-center">
                  <p className="text-sm font-medium text-emerald-300">
                    Better coordination. Cleaner surroundings. Shared
                    responsibility.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services */}
        <section
          id="services"
          className="border-y border-white/5 bg-slate-900/60 px-5 py-20 sm:px-8 sm:py-24"
        >
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-400">
                One connected platform
              </p>

              <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                Designed for everyone involved
              </h2>

              <p className="mt-4 leading-7 text-slate-400">
                Different roles, one shared mission: making waste management
                more organized and effective.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {services.map((service) => {
                const Icon = service.icon;

                return (
                  <article
                    key={service.title}
                    className="group flex flex-col rounded-2xl border border-slate-800 bg-slate-950/70 p-6 transition duration-300 hover:-translate-y-1 hover:border-emerald-400/30"
                  >
                    <div
                      className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl ${colorStyles[service.color]}`}
                    >
                      <Icon className="h-6 w-6" />
                    </div>

                    <h3 className="text-lg font-bold text-white">
                      {service.title}
                    </h3>

                    <p className="mt-3 flex-1 text-sm leading-7 text-slate-400">
                      {service.description}
                    </p>

                    <Link
                      to={
                        service.color === 'amber' ? '/login' : '/register'
                      }
                      className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-emerald-400 transition hover:text-emerald-300"
                    >
                      {service.link}
                      <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                    </Link>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section
          id="how-it-works"
          className="px-5 py-20 sm:px-8 sm:py-24"
        >
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto mb-14 max-w-2xl text-center">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-400">
                Simple and connected
              </p>

              <h2 className="mt-4 text-3xl font-extrabold text-white sm:text-4xl">
                How it works
              </h2>

              <p className="mt-4 leading-7 text-slate-400">
                A coordinated approach helps communities report waste and
                organize collection activities.
              </p>
            </div>

            <div className="grid gap-10 md:grid-cols-3 md:gap-8">
              {steps.map((step) => {
                const Icon = step.icon;

                return (
                  <article key={step.number} className="relative text-center">
                    <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10">
                      <Icon className="h-7 w-7 text-emerald-400" />
                    </div>

                    <p className="text-sm font-bold tracking-widest text-emerald-400">
                      STEP {step.number}
                    </p>

                    <h3 className="mt-3 text-xl font-bold text-white">
                      {step.title}
                    </h3>

                    <p className="mx-auto mt-3 max-w-sm leading-7 text-slate-400">
                      {step.description}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* Call to action */}
        <section className="px-5 pb-20 sm:px-8 sm:pb-24">
          <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl border border-emerald-400/20 bg-gradient-to-br from-emerald-400/10 via-slate-900 to-teal-400/5 px-6 py-12 text-center sm:px-12 sm:py-16">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-400/10">
              <Recycle className="h-7 w-7 text-emerald-400" />
            </div>

            <h2 className="mx-auto mt-6 max-w-2xl text-3xl font-extrabold text-white sm:text-4xl">
              A cleaner city starts with collective action.
            </h2>

            <p className="mx-auto mt-4 max-w-xl leading-7 text-slate-400">
              Join the platform and take part in building a more organized,
              responsible approach to waste management.
            </p>

            <Link
              to="/register"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-emerald-400 px-6 py-3.5 font-bold text-slate-950 transition hover:bg-emerald-300"
            >
              Join EcoSmart Addis
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-slate-950 px-5 py-8 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Recycle className="h-5 w-5 text-emerald-400" />
            <span className="font-bold text-white">EcoSmart Addis</span>
          </Link>

          <p className="text-sm leading-6 text-slate-500">
            Working together for cleaner communities and responsible waste
            management.
          </p>

          <div className="flex gap-5 text-sm text-slate-400">
            <Link to="/login" className="hover:text-emerald-400">
              Sign In
            </Link>
            <Link to="/register" className="hover:text-emerald-400">
              Register
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
