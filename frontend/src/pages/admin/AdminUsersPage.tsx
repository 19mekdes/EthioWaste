import React, { useEffect, useState } from 'react';
import { AdminLayout } from '../../layouts/AdminLayout';
import { adminService } from '../../services/adminService';
import { User } from '../../types';
import { Users, Search, Shield, ShieldAlert, Award, AlertCircle } from 'lucide-react';

export const AdminUsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminService.getAllUsers();
      setUsers(data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load platform users.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId: string, newRole: string) => {
    if (!window.confirm(`Are you sure you want to change user role to ${newRole}?`)) return;
    try {
      await adminService.updateUserRole(userId, newRole);
      fetchUsers();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to update user role.');
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      (u.phone && u.phone.includes(search));

    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <AdminLayout title="Platform User Management">
      <div className="space-y-6 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white">Registered Accounts Directory</h2>
            <p className="text-sm text-slate-400">Manage user authorization roles across Citizens, Collectors, and Recyclers.</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search name, email..."
                className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full sm:w-auto bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="ALL">All Roles</option>
              <option value="CITIZEN">Citizen</option>
              <option value="COLLECTOR">Collector</option>
              <option value="RECYCLING_ORGANIZATION">Recycling Org</option>
              <option value="MUNICIPAL_ADMIN">Municipal Admin</option>
            </select>
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500" />
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-12 text-center text-slate-400">
            No users match the search filter.
          </div>
        ) : (
          <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl overflow-hidden shadow-xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900/80 border-b border-slate-700 text-slate-400 text-xs uppercase tracking-wider">
                  <th className="p-4">User Name</th>
                  <th className="p-4">Email / Phone</th>
                  <th className="p-4">Sub-City Zone</th>
                  <th className="p-4">Eco-Points</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Role Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/60 text-sm text-slate-200">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-700/30 transition">
                    <td className="p-4 font-bold text-white flex items-center gap-3">
                      <div className="p-2 rounded-full bg-slate-700 text-amber-400 font-bold text-xs w-8 h-8 flex items-center justify-center">
                        {u.name.substring(0, 2).toUpperCase()}
                      </div>
                      <span>{u.name}</span>
                    </td>
                    <td className="p-4 text-xs text-slate-300">
                      <div>{u.email}</div>
                      <div className="text-slate-500 mt-0.5">{u.phone || 'N/A'}</div>
                    </td>
                    <td className="p-4 text-xs text-slate-300">{u.subCity || 'Addis Ababa'}</td>
                    <td className="p-4 font-bold text-amber-400">{u.ecoPoints || 0} pts</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        u.role === 'MUNICIPAL_ADMIN' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' :
                        u.role === 'COLLECTOR' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30' :
                        u.role === 'RECYCLING_ORGANIZATION' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/30' :
                        'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="p-4">
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                        className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-100 focus:outline-none"
                      >
                        <option value="CITIZEN">CITIZEN</option>
                        <option value="COLLECTOR">COLLECTOR</option>
                        <option value="RECYCLING_ORGANIZATION">RECYCLING_ORGANIZATION</option>
                        <option value="MUNICIPAL_ADMIN">MUNICIPAL_ADMIN</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};
