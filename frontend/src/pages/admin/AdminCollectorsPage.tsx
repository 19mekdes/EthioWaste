import React, { useEffect, useState } from 'react';
import { AdminLayout } from '../../layouts/AdminLayout';
import { adminService } from '../../services/adminService';
import { User } from '../../types';
import { Truck, Phone, Mail, MapPin, AlertCircle } from 'lucide-react';

export const AdminCollectorsPage: React.FC = () => {
  const [collectors, setCollectors] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCollectors = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await adminService.getCollectors();
        setCollectors(data);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to load collectors fleet.');
      } finally {
        setLoading(false);
      }
    };
    fetchCollectors();
  }, []);

  return (
    <AdminLayout title="Municipal Collector Fleets">
      <div className="space-y-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">Collector Personnel & Vehicles</h2>
            <p className="text-sm text-slate-400">Registered municipal waste pickup operators in Addis Ababa.</p>
          </div>
          <span className="px-4 py-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/30 text-xs font-bold">
            Total Collectors: {collectors.length}
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
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
          </div>
        ) : collectors.length === 0 ? (
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-12 text-center text-slate-400">
            No collectors registered in system. You can change a user's role to COLLECTOR under Users.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {collectors.map((c) => (
              <div
                key={c.id}
                className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-6 shadow-lg space-y-4 hover:border-blue-500/40 transition"
              >
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-400">
                    <Truck className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base">{c.name}</h3>
                    <span className="text-xs text-blue-400 font-medium">Vehicle: {c.vehicleNumber || 'AA-C-4092'}</span>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-emerald-400 flex-shrink-0" /> {c.email}
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-teal-400 flex-shrink-0" /> {c.phone || 'N/A'}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-amber-400 flex-shrink-0" /> Sub-City: {c.subCity || 'Addis Ababa Central'}
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
