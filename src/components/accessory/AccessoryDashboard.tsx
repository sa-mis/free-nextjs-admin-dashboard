import { useEffect, useState } from 'react';
import { accessoryAPI } from '@/services/accessory';
import { BoxIcon, ArrowDownIcon, ArrowUpIcon, LayersIcon, ListIcon } from '@/icons';

export default function AccessoryDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    accessoryAPI.getAccessoryDashboard().then(res => {
      setStats(res.data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div>Loading dashboard...</div>;
  if (!stats) return <div>No dashboard data</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Accessory Dashboard</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow p-5 flex items-center gap-4">
          <BoxIcon className="w-10 h-10 text-blue-500 bg-blue-100 rounded-full p-2" />
          <div>
            <div className="text-2xl font-bold">{stats.total}</div>
            <div className="text-gray-500 text-sm">Total Accessories</div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow p-5 flex items-center gap-4">
          <LayersIcon className="w-10 h-10 text-green-500 bg-green-100 rounded-full p-2" />
          <div>
            <div className="text-2xl font-bold">{stats.totalStock}</div>
            <div className="text-gray-500 text-sm">Total Stock</div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow p-5 flex items-center gap-4">
          <ArrowDownIcon className="w-10 h-10 text-red-500 bg-red-100 rounded-full p-2" />
          <div>
            <div className="text-2xl font-bold">{stats.belowMin}</div>
            <div className="text-gray-500 text-sm">Below Min Stock</div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow p-5 flex items-center gap-4">
          <ArrowUpIcon className="w-10 h-10 text-yellow-500 bg-yellow-100 rounded-full p-2" />
          <div>
            <div className="text-2xl font-bold">{stats.aboveMax}</div>
            <div className="text-gray-500 text-sm">Above Max Stock</div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div className="bg-white rounded-xl shadow p-5">
          <div className="flex items-center gap-2 mb-2">
            <ListIcon className="w-5 h-5 text-blue-400" />
            <h3 className="font-semibold">By Status</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {stats.byStatus.map((s: any) => (
              <span key={s.status} className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium">
                {s.status}: <span className="ml-1 font-bold">{s.count}</span>
              </span>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-xl shadow p-5">
          <div className="flex items-center gap-2 mb-2">
            <ListIcon className="w-5 h-5 text-green-400" />
            <h3 className="font-semibold">Top Assigned Accessories</h3>
          </div>
          <ul className="divide-y divide-gray-100">
            {stats.topAssigned.map((a: any) => (
              <li key={a.accessory_id} className="py-2 flex justify-between text-sm">
                <span>Accessory ID: <span className="font-semibold">{a.accessory_id}</span></span>
                <span className="text-gray-500">{a.assignments} assignments</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow p-5 mt-6">
        <div className="flex items-center gap-2 mb-2">
          <ListIcon className="w-5 h-5 text-indigo-400" />
          <h3 className="font-semibold">Recent Stock Movements</h3>
        </div>
        <ul className="divide-y divide-gray-100">
          {stats.recentMovements.map((m: any) => (
            <li key={m.id} className="py-2 flex flex-wrap justify-between text-sm">
              <span>Accessory ID: <span className="font-semibold">{m.accessory_id}</span></span>
              <span>Type: <span className="font-semibold">{m.movement_type}</span></span>
              <span>Qty: <span className="font-semibold">{m.quantity}</span></span>
              <span>Date: <span className="font-semibold">{m.movement_date}</span></span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
} 