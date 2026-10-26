
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
    color: 'bg-emerald-50 text-emerald-700',
  },
  {
    title: 'Waste Collectors',
    description:
      'Support organized waste collection and keep track of assigned collection activities.',
    icon: Truck,
    color: 'bg-sky-50 text-sky-700',
  },
  {
    title: 'Recycling Organizations',
    description:
      'Support the responsible handling of recyclable materials and help reduce waste.',
    icon: Building2,
    color: 'bg-violet-50 text-violet-700',
  },
  {
    title: 'City Administrators',
    description:
      'Coordinate waste management activities and support better-informed decisions.',
    icon: ShieldCheck,
    color: 'bg-amber-50 text-amber-700',
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
    <div className="min-h-screen bg-[#F8FAF8] text-slate-800 font-sans">
      {/* Navigation */}
      <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/95 backdrop-blur-md">
        <nav
          className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:px-8"
          aria-label="Main navigation"
        >
          <Link to="/" className="flex shrink-0 items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm">
              <Recycle className="h-6 w-6" />
            </div>
            <div>
              <span className="block text-lg font-extrabold tracking-tight text-slate-900 sm:text-xl">
                EcoBin
              </span>
              <span className="hidden text-xs text-slate-500 sm:block">
                Smarter Waste Management
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-2 sm:gap-4">
            <Link
              to="/login"
              className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 transition hover:text-emerald-700 sm:px-4"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 sm:px-5"
            >
              Get Started
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </nav>
      </header>

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-b from-[#EAF5ED] via-[#F8FAF8] to-[#F8FAF8]">
          <div className="pointer-events-none absolute -right-24 -top-20 h-80 w-80 rounded-full bg-emerald-100/70 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-lime-100/60 blur-3xl" />

          <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 py-20 sm:px-8 sm:py-28 lg:grid-cols-2 lg:gap-16 lg:py-32">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-4 py-2 text-sm font-semibold text-emerald-800 shadow-sm">
                <Leaf className="h-4 w-4" />
                Building a cleaner Addis Ababa
              </div>

              <h1 className="max-w-2xl text-4xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                A cleaner city starts with{' '}
                <span className="text-emerald-600">smarter waste management.</span>
              </h1>

              <p className="mt-6 max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
                EcoBin brings citizens, waste collectors, recycling
                organizations, and city administrators together to support
                more organized waste management and a greener urban future.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-4 font-bold text-white shadow-lg shadow-emerald-600/20 transition hover:-translate-y-0.5 hover:bg-emerald-700"
                >
                  Get Started
                  <ArrowRight className="h-5 w-5" />
                </Link>

                <a
                  href="#how-it-works"
                  className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-4 font-semibold text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50"
                >
                  Discover How It Works
                </a>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-slate-500">
                <span className="inline-flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  Community focused
                </span>
                <span className="inline-flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  Sustainability minded
                </span>
              </div>
            </div>

            {/* Recycling facility photo */}
            <div className="relative mx-auto w-full max-w-lg">
              <img
                src="/images/ecobin-recycling-facility.png"
                alt="Workers sorting recyclable materials at a recycling facility"
                className="relative h-[320px] w-full rounded-3xl object-cover shadow-xl sm:h-[420px]"
              />
            </div>
          </div>
        </section>

        {/* Stakeholders */}
        <section className="px-5 py-20 sm:px-8 sm:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <span className="text-sm font-bold uppercase tracking-widest text-emerald-700">
                One platform, shared purpose
              </span>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                Waste management works better together
              </h2>
              <p className="mt-4 leading-7 text-slate-600">
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
                    className="group rounded-2xl border border-slate-200 bg-white p-6 transition duration-200 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-900/5"
                  >
                    <div
                      className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl ${item.color}`}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-slate-600">
                      {item.description}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* New section 1: How it works */}
        <section
          id="how-it-works"
          className="border-y border-slate-100 bg-slate-50 px-5 py-20 sm:px-8 sm:py-24"
        >
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto mb-14 max-w-2xl text-center">
              <span className="text-sm font-bold uppercase tracking-widest text-emerald-700">
                A simpler approach
              </span>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                How EcoBin works
              </h2>
              <p className="mt-4 leading-7 text-slate-600">
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
                      <div className="absolute left-[4.5rem] top-9 hidden h-px w-[calc(100%-3rem)] bg-emerald-200 md:block" />
                    )}

                    <div className="relative mb-6 flex items-center gap-4">
                      <div className="flex h-[4.5rem] w-[4.5rem] shrink-0 items-center justify-center rounded-2xl border border-emerald-100 bg-white text-emerald-700 shadow-sm">
                        <Icon className="h-8 w-8" />
                      </div>
                      <span className="text-sm font-extrabold tracking-widest text-emerald-700">
                        STEP {step.number}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-slate-900">
                      {step.title}
                    </h3>
                    <p className="mt-3 max-w-sm text-sm leading-7 text-slate-600">
                      {step.description}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* New section 2: Why it matters */}
        <section className="px-5 py-20 sm:px-8 sm:py-24">
          <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2 lg:gap-20">
            <div>
              <span className="text-sm font-bold uppercase tracking-widest text-emerald-700">
                Why it matters
              </span>
              <h2 className="mt-3 text-3xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-4xl">
                Small actions can help create cleaner communities.
              </h2>
              <p className="mt-5 leading-8 text-slate-600">
                Responsible waste management takes cooperation. When
                residents, collection teams, and recycling organizations
                work toward a common goal, communities have more
                opportunities to manage waste thoughtfully.
              </p>

              <Link
                to="/register"
                className="mt-7 inline-flex items-center gap-2 font-bold text-emerald-700 transition hover:text-emerald-800"
              >
                Join the community
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <article className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-6 sm:translate-y-6">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-white text-emerald-700 shadow-sm">
                  <MapPin className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  Cleaner neighborhoods
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Encourage residents to take part in identifying waste
                  concerns in their communities.
                </p>
              </article>

              <article className="rounded-2xl border border-lime-100 bg-lime-50/70 p-6">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-white text-lime-700 shadow-sm">
                  <Recycle className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  Responsible recycling
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Promote awareness of recyclable materials and responsible
                  waste handling.
                </p>
              </article>

              <article className="rounded-2xl border border-sky-100 bg-sky-50/70 p-6 sm:translate-y-6">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-white text-sky-700 shadow-sm">
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  Community participation
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Give residents and waste management teams a shared
                  starting point for cooperation.
                </p>
              </article>

              <article className="rounded-2xl border border-amber-100 bg-amber-50/70 p-6">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-white text-amber-700 shadow-sm">
                  <Sprout className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  A sustainable future
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Support everyday choices that contribute to a more
                  environmentally responsible city.
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* Call to action */}
        <section className="px-5 pb-20 sm:px-8 sm:pb-24">
          <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl bg-emerald-700 px-6 py-12 text-center sm:px-12 sm:py-16">
            <div className="pointer-events-none absolute -right-12 -top-24 h-64 w-64 rounded-full border-[40px] border-white/5" />
            <div className="pointer-events-none absolute -bottom-28 -left-12 h-64 w-64 rounded-full border-[40px] border-white/5" />

            <div className="relative mx-auto max-w-2xl">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-white">
                <Leaf className="h-7 w-7" />
              </div>
              <h2 className="mt-6 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                Be part of a cleaner Addis Ababa.
              </h2>
              <p className="mt-4 leading-7 text-emerald-50">
                Take the first step toward more responsible waste management.
                Explore EcoBin and discover how you can participate.
              </p>
              <Link
                to="/register"
                className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 font-bold text-emerald-800 shadow-sm transition hover:bg-emerald-50"
              >
                Get Started Today
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-slate-50 px-5 py-8 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 text-center sm:flex-row sm:text-left">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
              <Recycle className="h-5 w-5" />
            </div>
            <div>
              <span className="block font-extrabold text-slate-900">
                EcoBin
              </span>
              <span className="text-xs text-slate-500">
                Smarter Waste Management
              </span>
            </div>
          </Link>

          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} EcoBin. Building a cleaner future
            together.
          </p>

          <div className="flex items-center gap-4 text-sm font-medium text-slate-600">
            <Link to="/login" className="transition hover:text-emerald-700">
              Sign In
            </Link>
            <Link to="/register" className="transition hover:text-emerald-700">
              Register
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
