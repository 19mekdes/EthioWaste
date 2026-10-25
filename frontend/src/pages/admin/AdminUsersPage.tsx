
import React, { useEffect, useState } from 'react';
import { AdminLayout } from '../../layouts/AdminLayout';
import { adminService } from '../../services/adminService';
import { User } from '../../types';
import { Search, AlertCircle } from 'lucide-react';

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
      await fetchUsers();
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
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Registered Accounts Directory</h2>
            <p className="mt-1 text-sm text-slate-500">
              Manage user authorization roles across Citizens, Collectors, and Recyclers.
            </p>
          </div>

          <div className="flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search name, email..."
                aria-label="Search users by name, email, or phone"
                className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-9 pr-4 text-xs text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />
            </div>

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              aria-label="Filter users by role"
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-xs text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 sm:w-auto"
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
          <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-emerald-500" />
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500 shadow-sm sm:p-12">
            No users match the search filter.
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                    <th scope="col" className="p-4 font-semibold">User Name</th>
                    <th scope="col" className="p-4 font-semibold">Email / Phone</th>
                    <th scope="col" className="p-4 font-semibold">Sub-City Zone</th>
                    <th scope="col" className="p-4 font-semibold">Eco-Points</th>
                    <th scope="col" className="p-4 font-semibold">Role</th>
                    <th scope="col" className="p-4 font-semibold">Role Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="transition hover:bg-emerald-50/40">
                      <td className="p-4">
                        <div className="flex items-center gap-3 font-semibold text-slate-800">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-xs font-bold text-emerald-700">
                            {u.name.substring(0, 2).toUpperCase()}
                          </div>
                          <span>{u.name}</span>
                        </div>
                      </td>
                      <td className="p-4 text-xs text-slate-600">
                        <div>{u.email}</div>
                        <div className="mt-0.5 text-slate-400">{u.phone || 'N/A'}</div>
                      </td>
                      <td className="p-4 text-xs text-slate-600">
                        {u.subCity || 'Addis Ababa'}
                      </td>
                      <td className="p-4 font-semibold text-emerald-700">
                        {u.ecoPoints || 0} pts
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${
                            u.role === 'MUNICIPAL_ADMIN'
                              ? 'border-amber-200 bg-amber-50 text-amber-800'
                              : u.role === 'COLLECTOR'
                                ? 'border-blue-200 bg-blue-50 text-blue-800'
                                : u.role === 'RECYCLING_ORGANIZATION'
                                  ? 'border-purple-200 bg-purple-50 text-purple-800'
                                  : 'border-emerald-200 bg-emerald-50 text-emerald-800'
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="p-4">
                        <select
                          value={u.role}
                          aria-label={`Change role for ${u.name}`}
                          onChange={(e) => handleRoleChange(u.id, e.target.value)}
                          className="rounded-lg border border-slate-300 bg-white px-2.5 py-2 text-xs text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
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
          </div>
        )}
      </div>
    </AdminLayout>
  );
};
