import React, { useEffect, useState } from 'react';
import { AdminLayout } from '../../layouts/AdminLayout';
import { adminService } from '../../services/adminService';
import { User } from '../../types';
import { Building2, Mail, Phone, MapPin, AlertCircle, ShieldCheck } from 'lucide-react';

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
        setError(err.response?.data?.error || 'Failed to load recycling organization partners.');
      } finally {
        setLoading(false);
      }
    };
    fetchRecyclers();
  }, []);

  return (
    <AdminLayout title="Recycling Partner Organizations">
      <div className="space-y-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">Licensed Recycling Partners</h2>
            <p className="text-sm text-slate-400">Verified material recovery facilities and processing plants in Addis Ababa.</p>
          </div>
          <span className="px-4 py-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/30 text-xs font-bold">
            Total Partners: {recyclers.length}
          </span>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500" />
          </div>
        ) : recyclers.length === 0 ? (
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-12 text-center text-slate-400">
            No recycling organizations registered in system.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recyclers.map((r) => (
              <div
                key={r.id}
                className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-6 shadow-lg space-y-4 hover:border-purple-500/40 transition"
              >
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-400">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base">{r.name}</h3>
                    <span className="text-xs text-purple-400 font-medium">Licensed Facility</span>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-emerald-400 flex-shrink-0" /> {r.email}
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-teal-400 flex-shrink-0" /> {r.phone || 'N/A'}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-amber-400 flex-shrink-0" /> Location: {r.subCity || 'Akaki Kality, Addis Ababa'}
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
