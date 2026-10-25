
import React, { useEffect, useState } from 'react';
import { AdminLayout } from '../../layouts/AdminLayout';
import { adminService } from '../../services/adminService';
import { User } from '../../types';
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  AlertCircle,
  ShieldCheck,
} from 'lucide-react';

export const AdminRecyclingOrgsPage: React.FC = () => {
  const [recyclers, setRecyclers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecyclers = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await adminService.getRecyclingOrgs();
        setRecyclers(data);
      } catch (err: any) {
        setError(
          err.response?.data?.error ||
            'Failed to load recycling organization partners.'
        );
      } finally {
        setLoading(false);
      }
    };
    fetchRecyclers();
  }, []);

  return (
    <AdminLayout title="Recycling Partner Organizations">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              Licensed Recycling Partners
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Verified material recovery facilities and processing plants in
              Addis Ababa.
            </p>
          </div>

          <span className="inline-flex w-fit items-center rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-700">
            Total Partners: {recyclers.length}
          </span>
        </div>

        {error && (
          <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-emerald-600" />
          </div>
        ) : recyclers.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-12">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
              <Building2 className="h-7 w-7" />
            </div>
            <h3 className="font-semibold text-slate-800">
              No recycling partners yet
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              No recycling organizations registered in system.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {recyclers.map((r) => (
              <div
                key={r.id}
                className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-emerald-300 hover:shadow-md sm:p-6"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-700">
                    <Building2 className="h-6 w-6" />
                  </div>

                  <div className="min-w-0">
                    <h3 className="break-words text-base font-bold text-slate-800">
                      {r.name}
                    </h3>
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      Licensed Facility
                    </span>
                  </div>
                </div>

                <div className="space-y-3 border-t border-slate-100 pt-4 text-sm text-slate-600">
                  <div className="flex min-w-0 items-start gap-2">
                    <Mail className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-700" />
                    <span className="break-all">{r.email}</span>
                  </div>

                  <div className="flex items-start gap-2">
                    <Phone className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-700" />
                    <span>{r.phone || 'N/A'}</span>
                  </div>

                  <div className="flex items-start gap-2">
                    <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-700" />
                    <span>
                      Location: {r.subCity || 'Akaki Kality, Addis Ababa'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};
