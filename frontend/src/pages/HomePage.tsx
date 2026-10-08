import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Recycle, 
  Trash2, 
  Truck, 
  Building2, 
  Award, 
  MapPin, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2,
  Leaf
} from 'lucide-react';

export const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      {/* Navigation Bar */}
      <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-tr from-emerald-500 to-teal-400 p-2.5 rounded-xl shadow-lg shadow-emerald-500/20">
              <Recycle className="h-6 w-6 text-slate-950 font-bold" />
            </div>
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-teal-200 bg-clip-text text-transparent">
                EcoSmart Addis
              </span>
              <span className="block text-xs text-slate-400 font-medium">Smart Waste & Recycling Platform</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link 
              to="/login"
              className="text-sm font-semibold text-slate-300 hover:text-white px-4 py-2 rounded-lg transition"
            >
              Sign In
            </Link>
            <Link 
              to="/register"
              className="text-sm font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-5 py-2.5 rounded-xl shadow-lg shadow-emerald-500/25 transition transform hover:-translate-y-0.5"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-24 px-6 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-8">
            <Leaf className="w-4 h-4" /> Addis Ababa Smart City Initiative
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight mb-6 leading-tight">
            Transforming Waste Management with <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">Smart Technology</span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-300 mb-10 max-w-3xl mx-auto leading-relaxed">
            Connecting citizens, municipal collectors, recycling facilities, and city admins in real-time to build a cleaner, greener, and sustainable Addis Ababa.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl shadow-xl shadow-emerald-500/25 transition transform hover:-translate-y-0.5"
            >
              Report Waste / Request Pickup <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl border border-slate-700 transition"
            >
              Access Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section className="py-16 px-6 bg-slate-900/50 border-t border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Empowering Every Stakeholder</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Our end-to-end digital ecosystem streamlines municipal waste operations and rewards citizen participation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-slate-800/60 border border-slate-700/60 p-6 rounded-2xl flex flex-col hover:border-emerald-500/40 transition">
              <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl w-fit mb-4">
                <Trash2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Citizens</h3>
              <p className="text-slate-400 text-sm mb-4 flex-1">
                Report illegal waste dump sites with GPS tagging and photos, request bulk waste collection, and earn redeemable Eco-Points.
              </p>
              <ul className="text-xs text-slate-300 space-y-2">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Interactive Addis Ababa Map</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Real-time status tracking</li>
              </ul>
            </div>

            <div className="bg-slate-800/60 border border-slate-700/60 p-6 rounded-2xl flex flex-col hover:border-emerald-500/40 transition">
              <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl w-fit mb-4">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Collectors</h3>
              <p className="text-slate-400 text-sm mb-4 flex-1">
                Accept assigned pickup tasks, update collection progress in real time, and route directly to verified recycling centers.
              </p>
              <ul className="text-xs text-slate-300 space-y-2">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Task dispatch alerts</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Optimized route details</li>
              </ul>
            </div>

            <div className="bg-slate-800/60 border border-slate-700/60 p-6 rounded-2xl flex flex-col hover:border-emerald-500/40 transition">
              <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl w-fit mb-4">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Recycling Orgs</h3>
              <p className="text-slate-400 text-sm mb-4 flex-1">
                Log incoming recyclable shipments, record exact material weights (Plastic, Glass, Metal, Organic), and track processing capacity.
              </p>
              <ul className="text-xs text-slate-300 space-y-2">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Material categorization</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Digital audit trails</li>
              </ul>
            </div>

            <div className="bg-slate-800/60 border border-slate-700/60 p-6 rounded-2xl flex flex-col hover:border-emerald-500/40 transition">
              <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl w-fit mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Municipal Admin</h3>
              <p className="text-slate-400 text-sm mb-4 flex-1">
                Manage user access, verify waste reports, dispatch collectors, monitor recycling metrics, and manage city center locations.
              </p>
              <ul className="text-xs text-slate-300 space-y-2">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> City-wide analytics</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Automated dispatcher</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-slate-950 border-t border-slate-800 py-8 px-6 text-center text-slate-500 text-sm">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-slate-400 font-semibold">
            <Recycle className="w-5 h-5 text-emerald-400" /> Smart West Management & Recycling Platform
          </div>
          <div>
            © {new Date().getFullYear()} Addis Ababa Environmental Protection Authority. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};
