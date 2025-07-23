import { useEffect, useState } from 'react';

interface Notification {
  id: number;
  title: string;
  message: string;
  is_read: boolean;
  sent_at: string;
}

export default function NotificationDropdown() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetch('/api/notifications?user_id=me')
      .then(res => res.json())
      .then(res => setNotifications(res.data || []));
  }, []);

  const markAsRead = async (id: number) => {
    await fetch(`/api/notifications/${id}`, { method: 'PATCH', body: JSON.stringify({ is_read: true }), headers: { 'Content-Type': 'application/json' } });
    setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: true } : n));
  };

  return (
    <div className="relative">
      <button onClick={() => setOpen(o => !o)} className="relative">
        <span>🔔</span>
        {notifications.some(n => !n.is_read) && <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full text-xs px-1">{notifications.filter(n => !n.is_read).length}</span>}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded p-2 z-50">
          <h3 className="font-bold mb-2">Notifications</h3>
          {notifications.length === 0 ? (
            <div className="text-gray-500">No notifications</div>
          ) : notifications.map(n => (
            <div key={n.id} className={`p-2 mb-1 rounded ${n.is_read ? 'bg-gray-100' : 'bg-blue-100'}`}
              onClick={() => markAsRead(n.id)}
              style={{ cursor: 'pointer' }}
            >
              <div className="font-semibold">{n.title}</div>
              <div className="text-sm">{n.message}</div>
              <div className="text-xs text-gray-400">{new Date(n.sent_at).toLocaleString()}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 