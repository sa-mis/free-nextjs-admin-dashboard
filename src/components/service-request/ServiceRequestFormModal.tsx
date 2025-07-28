import { useState, useEffect } from 'react';
import { XIcon } from '@/icons';
import { serviceRequestAPI, serviceCategoryAPI } from '@/services/serviceRequest';

interface ServiceRequestFormModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: any;
}

export default function ServiceRequestFormModal({
  open,
  onClose,
  onSuccess,
  initialData
}: ServiceRequestFormModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category_id: '',
    priority: 'medium',
    location: '',
    asset_id: '',
    due_date: ''
  });
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [assets, setAssets] = useState<any[]>([]);

  useEffect(() => {
    if (open) {
      loadCategories();
      loadAssets();
      if (initialData) {
        setFormData({
          title: initialData.title || '',
          description: initialData.description || '',
          category_id: initialData.category_id || '',
          priority: initialData.priority || 'medium',
          location: initialData.location || '',
          asset_id: initialData.asset_id || '',
          due_date: initialData.due_date ? new Date(initialData.due_date).toISOString().split('T')[0] : ''
        });
      } else {
        setFormData({
          title: '',
          description: '',
          category_id: '',
          priority: 'medium',
          location: '',
          asset_id: '',
          due_date: ''
        });
      }
    }
  }, [open, initialData]);

  const loadCategories = async () => {
    try {
      const res = await serviceCategoryAPI.getServiceCategories({ limit: 100 });
      setCategories(res.data.categories || []);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const loadAssets = async () => {
    try {
      // This would typically load from asset API
      setAssets([]);
    } catch (error) {
      console.error('Error loading assets:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (initialData) {
        await serviceRequestAPI.updateServiceRequest(initialData.id, formData);
      } else {
        await serviceRequestAPI.createServiceRequest(formData);
      }
      onSuccess();
    } catch (error: any) {
      console.error('Error saving service request:', error);
      alert(error.response?.data?.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            {initialData ? 'แก้ไขรายการแจ้งซ่อม' : 'สร้างรายการแจ้งซ่อมใหม่'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XIcon className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              หัวข้อ <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="กรอกหัวข้อแจ้งซ่อม"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              รายละเอียด <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="กรอกรายละเอียดการแจ้งซ่อม"
            />
          </div>

          {/* Category and Priority */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                หมวดหมู่
              </label>
              <select
                name="category_id"
                value={formData.category_id}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">เลือกหมวดหมู่</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ความสำคัญ
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="low">ต่ำ</option>
                <option value="medium">ปานกลาง</option>
                <option value="high">สูง</option>
                <option value="urgent">เร่งด่วน</option>
              </select>
            </div>
          </div>

          {/* Location and Asset */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                สถานที่
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="กรอกสถานที่"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ทรัพย์สิน
              </label>
              <select
                name="asset_id"
                value={formData.asset_id}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">เลือกทรัพย์สิน</option>
                {assets.map(asset => (
                  <option key={asset.id} value={asset.id}>
                    {asset.name} - {asset.asset_number}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Due Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              วันที่กำหนดเสร็จ
            </label>
            <input
              type="date"
              name="due_date"
              value={formData.due_date}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'กำลังบันทึก...' : (initialData ? 'อัปเดต' : 'สร้าง')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 