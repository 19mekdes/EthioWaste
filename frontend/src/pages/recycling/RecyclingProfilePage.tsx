
import React from 'react';
import { RecyclingLayout } from '../../layouts/RecyclingLayout';
import { useAuth } from '../../contexts/AuthContext';
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
} from 'lucide-react';

export const RecyclingProfilePage: React.FC = () => {
  const { user } = useAuth();

  return (
    <RecyclingLayout title="Facility Profile">
      <div className="mx-auto max-w-3xl space-y-8">
        <div className="border-b border-slate-200 pb-5">
          <h2 className="text-xl font-bold text-slate-800">
            Organization Information
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            View your recycling facility's account and contact details.
          </p>
        </div>

        <section>
          <div className="flex items-center gap-4 border-b border-slate-200 pb-6">
            <div className="shrink-0 rounded-xl bg-emerald-50 p-4 text-emerald-700">
              <Building2 className="h-9 w-9" />
            </div>

            <div className="min-w-0">
              <h3 className="break-words text-xl font-bold text-slate-800">
                {user?.name || 'Recycling Organization'}
              </h3>

              <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">
                <ShieldCheck className="h-3.5 w-3.5" />
                Licensed Recycling Facility
              </span>
            </div>
          </div>

          <div className="mt-2 grid grid-cols-1 gap-x-10 sm:grid-cols-2">
            <div className="border-b border-slate-200 py-5">
              <span className="flex items-center gap-2 text-sm text-slate-500">
                <Mail className="h-4 w-4 text-emerald-700" />
                Account Email
              </span>
              <p className="mt-2 break-words font-medium text-slate-800">
                {user?.email || 'N/A'}
              </p>
            </div>

            <div className="border-b border-slate-200 py-5">
              <span className="flex items-center gap-2 text-sm text-slate-500">
                <Phone className="h-4 w-4 text-emerald-700" />
                Contact Phone
              </span>
              <p className="mt-2 font-medium text-slate-800">
                {user?.phone || 'N/A'}
              </p>
            </div>

            <div className="border-b border-slate-200 py-5">
              <span className="flex items-center gap-2 text-sm text-slate-500">
                <MapPin className="h-4 w-4 text-emerald-700" />
                Plant Location
              </span>
              <p className="mt-2 font-medium text-slate-800">
                {user?.subCity || 'Akaki Kality Sub-City, Addis Ababa'}
              </p>
            </div>

            <div className="border-b border-slate-200 py-5">
              <span className="flex items-center gap-2 text-sm text-slate-500">
                <ShieldCheck className="h-4 w-4 text-emerald-700" />
                License & Certification
              </span>
              <p className="mt-2 font-medium text-slate-800">
                EPA-AA-REC-88402
              </p>
            </div>
          </div>
        </section>
      </div>
    </RecyclingLayout>
  );
};
