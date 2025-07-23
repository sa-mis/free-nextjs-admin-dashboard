import { useEffect, useState } from 'react';
import { accessoryAPI } from '@/services/accessory';

interface Accessory {
  id: number;
  accessory_tag: string;
  name: string;
  description?: string;
  category_name?: string;
  brand_name?: string;
  model_name?: string;
  vendor_name?: string;
  serial_number?: string;
  purchase_date?: string;
  purchase_price?: number;
  status: string;
  stock_quantity: number;
  min_stock?: number;
  max_stock?: number;
  location?: string;
  notes?: string;
}

function formatDate(date?: string) {
  return date ? new Date(date).toLocaleDateString() : '-';
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
    const res = await accessoryAPI.getAccessories({ page: pagination.page, limit: pagination.limit });
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
      await accessoryAPI.deleteAccessory(id);
      fetchData();
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="table-auto w-full text-sm">
        <thead>
          <tr>
            <th>Tag</th>
            <th>Name</th>
            <th>Description</th>
            <th>Category</th>
            <th>Brand</th>
            <th>Model</th>
            <th>Vendor</th>
            <th>Serial #</th>
            <th>Purchase Date</th>
            <th>Purchase Price</th>
            <th>Status</th>
            <th>Stock</th>
            <th>Min Stock</th>
            <th>Max Stock</th>
            <th>Location</th>
            <th>Notes</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan={17}>Loading...</td></tr>
          ) : data.length === 0 ? (
            <tr><td colSpan={17}>No data</td></tr>
          ) : data.map(row => (
            <tr key={row.id}>
              <td>{row.accessory_tag}</td>
              <td>{row.name}</td>
              <td>{row.description || '-'}</td>
              <td>{row.category_name || '-'}</td>
              <td>{row.brand_name || '-'}</td>
              <td>{row.model_name || '-'}</td>
              <td>{row.vendor_name || '-'}</td>
              <td>{row.serial_number || '-'}</td>
              <td>{formatDate(row.purchase_date)}</td>
              <td>{row.purchase_price ?? '-'}</td>
              <td>{row.status}</td>
              <td>{row.stock_quantity}</td>
              <td>{row.min_stock ?? '-'}</td>
              <td>{row.max_stock ?? '-'}</td>
              <td>{row.location || '-'}</td>
              <td>{row.notes || '-'}</td>
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