import { useEffect, useState } from 'react';
import { userAPI } from '@/services/user';
import { UserCircleIcon, UsersIcon, ShieldIcon, CheckCircleIcon } from '@/icons';

export default function UserDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    userAPI.getUserDashboard().then(res => {
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
      <h2 className="text-xl font-bold">User Dashboard</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow p-5 flex items-center gap-4">
          <UsersIcon className="w-10 h-10 text-blue-500 bg-blue-100 rounded-full p-2" />
          <div>
            <div className="text-2xl font-bold">{stats.total || 0}</div>
            <div className="text-gray-500 text-sm">Total Users</div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow p-5 flex items-center gap-4">
          <CheckCircleIcon className="w-10 h-10 text-green-500 bg-green-100 rounded-full p-2" />
          <div>
            <div className="text-2xl font-bold">{stats.active || 0}</div>
            <div className="text-gray-500 text-sm">Active Users</div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow p-5 flex items-center gap-4">
          <ShieldIcon className="w-10 h-10 text-purple-500 bg-purple-100 rounded-full p-2" />
          <div>
            <div className="text-2xl font-bold">{stats.roles || 0}</div>
            <div className="text-gray-500 text-sm">Total Roles</div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow p-5 flex items-center gap-4">
          <UserCircleIcon className="w-10 h-10 text-yellow-500 bg-yellow-100 rounded-full p-2" />
          <div>
            <div className="text-2xl font-bold">{stats.recentLogins || 0}</div>
            <div className="text-gray-500 text-sm">Recent Logins</div>
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
            <CheckCircleIcon className="w-5 h-5 text-green-400" />
            <h3 className="font-semibold">Recent Activity</h3>
          </div>
          <div className="space-y-2">
            {stats.recentActivity?.map((activity: any) => (
              <div key={activity.id} className="text-sm">
                <span className="font-medium">{activity.username}</span>
                <span className="text-gray-500"> - {activity.action}</span>
                <span className="text-gray-400 text-xs ml-2">{activity.timestamp}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 