import { useEffect, useState } from 'react';
import { getAccessories, deleteAccessory } from '@/services/accessory';

interface Accessory {
  id: number;
  accessory_tag: string;
  name: string;
  status: string;
  stock_quantity: number;
  // ...other fields
}

export default function AccessoryTable({ onEdit, onAssign, onStockMovement }: {
  onEdit: (accessory: Accessory) => void;
  onAssign: (accessory: Accessory) => void;
  onStockMovement: (accessory: Accessory) => void;
}) {
  const [data, setData] = useState<Accessory[]>([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    const res = await getAccessories({ page: pagination.page, limit: pagination.limit });
    setData(res.data);
    setPagination(prev => ({ ...prev, total: res.pagination.total }));
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [pagination.page, pagination.limit]);

  const handleDelete = async (id: number) => {
    if (window.confirm('Delete this accessory?')) {
      await deleteAccessory(id);
      fetchData();
    }
  };

  return (
    <div>
      <table className="table-auto w-full">
        <thead>
          <tr>
            <th>Tag</th>
            <th>Name</th>
            <th>Status</th>
            <th>Stock</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan={5}>Loading...</td></tr>
          ) : data.length === 0 ? (
            <tr><td colSpan={5}>No data</td></tr>
          ) : data.map(row => (
            <tr key={row.id}>
              <td>{row.accessory_tag}</td>
              <td>{row.name}</td>
              <td>{row.status}</td>
              <td>{row.stock_quantity}</td>
              <td>
                <button onClick={() => onEdit(row)}>Edit</button>
                <button onClick={() => handleDelete(row.id)}>Delete</button>
                <button onClick={() => onAssign(row)}>Assign</button>
                <button onClick={() => onStockMovement(row)}>Stock</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-between items-center mt-2">
        <button disabled={pagination.page === 1} onClick={() => setPagination(p => ({ ...p, page: p.page - 1 }))}>Prev</button>
        <span>Page {pagination.page} of {Math.ceil(pagination.total / pagination.limit)}</span>
        <button disabled={pagination.page * pagination.limit >= pagination.total} onClick={() => setPagination(p => ({ ...p, page: p.page + 1 }))}>Next</button>
      </div>
    </div>
  );
} 