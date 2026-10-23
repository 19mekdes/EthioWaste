
import React from 'react';
import { CollectorLayout } from '../../layouts/CollectorLayout';
import { useAuth } from '../../contexts/AuthContext';
import { Truck, Phone, Mail, MapPin } from 'lucide-react';

export const CollectorProfilePage: React.FC = () => {
  const { user } = useAuth();

  return (
    <CollectorLayout title="Collector Profile">
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="space-y-6 rounded-xl border border-slate-100 bg-white p-6 shadow-sm sm:p-8">
          {/* Collector identity */}
          <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
            <div className="rounded-2xl bg-emerald-50 p-4 text-emerald-700">
              <Truck className="h-10 w-10" />
            </div>

            <div className="min-w-0">
              <h2 className="break-words text-2xl font-bold text-slate-800">
                {user?.name || 'Collector'}
              </h2>
              <span className="mt-2 inline-flex rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800">
                Municipal Waste Collector
              </span>
            </div>
          </div>

          {/* Profile information */}
          <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
            <div className="space-y-2 rounded-xl border border-slate-100 bg-[#F8FAF8] p-4">
              <span className="flex items-center gap-2 text-xs font-medium text-slate-500">
                <Mail className="h-4 w-4 text-emerald-700" />
                Email Address
              </span>
              <p className="break-words font-semibold text-slate-800">
                {user?.email || 'N/A'}
              </p>
            </div>

            <div className="space-y-2 rounded-xl border border-slate-100 bg-[#F8FAF8] p-4">
              <span className="flex items-center gap-2 text-xs font-medium text-slate-500">
                <Phone className="h-4 w-4 text-emerald-700" />
                Contact Phone
              </span>
              <p className="break-words font-semibold text-slate-800">
                {user?.phone || 'N/A'}
              </p>
            </div>

            <div className="space-y-2 rounded-xl border border-slate-100 bg-[#F8FAF8] p-4">
              <span className="flex items-center gap-2 text-xs font-medium text-slate-500">
                <Truck className="h-4 w-4 text-emerald-700" />
                Assigned Vehicle #
              </span>
              <p className="break-words font-semibold text-slate-800">
                {user?.vehicleNumber || 'AA-C-4092'}
              </p>
            </div>

            <div className="space-y-2 rounded-xl border border-slate-100 bg-[#F8FAF8] p-4">
              <span className="flex items-center gap-2 text-xs font-medium text-slate-500">
                <MapPin className="h-4 w-4 text-emerald-700" />
                Sub-City Operating Zone
              </span>
              <p className="break-words font-semibold text-slate-800">
                {user?.subCity || 'Addis Ababa Central Zone'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </CollectorLayout>
  );
};
