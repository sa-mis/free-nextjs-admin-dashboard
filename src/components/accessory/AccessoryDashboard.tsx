import { useEffect, useState } from 'react';
import { getAccessoryDashboard } from '@/services/accessory';

export default function AccessoryDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getAccessoryDashboard().then(res => {
      setStats(res.data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div>Loading dashboard...</div>;
  if (!stats) return <div>No dashboard data</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Accessory Dashboard</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-100 p-4 rounded">Total Accessories: {stats.total}</div>
        <div className="bg-gray-100 p-4 rounded">Total Stock: {stats.totalStock}</div>
        <div className="bg-gray-100 p-4 rounded">Below Min Stock: {stats.belowMin}</div>
        <div className="bg-gray-100 p-4 rounded">Above Max Stock: {stats.aboveMax}</div>
      </div>
      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold mb-2">By Status</h3>
        <ul>
          {stats.byStatus.map((s: any) => (
            <li key={s.status}>{s.status}: {s.count}</li>
          ))}
        </ul>
      </div>
      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold mb-2">Top Assigned Accessories</h3>
        <ul>
          {stats.topAssigned.map((a: any) => (
            <li key={a.accessory_id}>Accessory ID: {a.accessory_id} ({a.assignments} assignments)</li>
          ))}
        </ul>
      </div>
      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold mb-2">Recent Stock Movements</h3>
        <ul>
          {stats.recentMovements.map((m: any) => (
            <li key={m.id}>Accessory ID: {m.accessory_id}, Type: {m.movement_type}, Qty: {m.quantity}, Date: {m.movement_date}</li>
          ))}
        </ul>
      </div>
    </div>
  );
} 