import { useEffect, useState } from 'react';
import { roleAPI } from '@/services/role';
import { ShieldIcon, UsersIcon, CheckCircleIcon, ListIcon } from '@/icons';

export default function RoleDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    roleAPI.getRoleDashboard().then(res => {
      setStats(res.data);
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });
  }, []);

  if (loading) return <div>Loading dashboard...</div>;
  if (!stats) return <div>No dashboard data</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Role Dashboard</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow p-5 flex items-center gap-4">
          <ShieldIcon className="w-10 h-10 text-blue-500 bg-blue-100 rounded-full p-2" />
          <div>
            <div className="text-2xl font-bold">{stats.total || 0}</div>
            <div className="text-gray-500 text-sm">Total Roles</div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow p-5 flex items-center gap-4">
          <UsersIcon className="w-10 h-10 text-green-500 bg-green-100 rounded-full p-2" />
          <div>
            <div className="text-2xl font-bold">{stats.totalUsers || 0}</div>
            <div className="text-gray-500 text-sm">Total Users</div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow p-5 flex items-center gap-4">
          <CheckCircleIcon className="w-10 h-10 text-purple-500 bg-purple-100 rounded-full p-2" />
          <div>
            <div className="text-2xl font-bold">{stats.totalPermissions || 0}</div>
            <div className="text-gray-500 text-sm">Total Permissions</div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow p-5 flex items-center gap-4">
          <ListIcon className="w-10 h-10 text-yellow-500 bg-yellow-100 rounded-full p-2" />
          <div>
            <div className="text-2xl font-bold">{stats.activeRoles || 0}</div>
            <div className="text-gray-500 text-sm">Active Roles</div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div className="bg-white rounded-xl shadow p-5">
          <div className="flex items-center gap-2 mb-2">
            <UsersIcon className="w-5 h-5 text-blue-400" />
            <h3 className="font-semibold">Users by Role</h3>
          </div>
          <div className="space-y-2">
            {stats.usersByRole?.map((role: any) => (
              <div key={role.role_name} className="flex justify-between items-center">
                <span className="text-sm text-gray-600">{role.role_name || 'No Role'}</span>
                <span className="text-sm font-semibold">{role.count}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-xl shadow p-5">
          <div className="flex items-center gap-2 mb-2">
            <ShieldIcon className="w-5 h-5 text-green-400" />
            <h3 className="font-semibold">Top Permissions</h3>
          </div>
          <div className="space-y-2">
            {stats.topPermissions?.map((permission: any) => (
              <div key={permission.permission_name} className="flex justify-between items-center">
                <span className="text-sm text-gray-600">{permission.permission_name}</span>
                <span className="text-sm font-semibold">{permission.count} roles</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 