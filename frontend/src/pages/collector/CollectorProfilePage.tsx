import React from 'react';
import { CollectorLayout } from '../../layouts/CollectorLayout';
import { useAuth } from '../../contexts/AuthContext';
import { User, Truck, Phone, Mail, Shield, MapPin } from 'lucide-react';

export const CollectorProfilePage: React.FC = () => {
  const { user } = useAuth();

  return (
    <CollectorLayout title="Collector Profile">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex items-center gap-4 border-b border-slate-700 pb-6">
            <div className="p-4 rounded-2xl bg-blue-500/10 text-blue-400">
              <Truck className="w-10 h-10" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{user?.name || 'Collector'}</h2>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/30">
                Municipal Waste Collector
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-700/40 space-y-1">
              <span className="text-xs text-slate-400 flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-emerald-400" /> Email Address
              </span>
              <p className="font-semibold text-white">{user?.email || 'N/A'}</p>
            </div>

            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-700/40 space-y-1">
              <span className="text-xs text-slate-400 flex items-center gap-1.5">
                <Phone className="w-4 h-4 text-teal-400" /> Contact Phone
              </span>
              <p className="font-semibold text-white">{user?.phone || 'N/A'}</p>
            </div>

            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-700/40 space-y-1">
              <span className="text-xs text-slate-400 flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-cyan-400" /> Assigned Vehicle #
              </span>
              <p className="font-semibold text-white">{user?.vehicleNumber || 'AA-C-4092'}</p>
            </div>

            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-700/40 space-y-1">
              <span className="text-xs text-slate-400 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-amber-400" /> Sub-City Operating Zone
              </span>
              <p className="font-semibold text-white">{user?.subCity || 'Addis Ababa Central Zone'}</p>
            </div>
          </div>
        </div>
      </div>
    </CollectorLayout>
  );
};
