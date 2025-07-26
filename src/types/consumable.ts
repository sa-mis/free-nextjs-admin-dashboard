// Consumable main type
export interface Consumable {
  id: number;
  consumable_tag: string;
  name: string;
  description?: string;
  category_id?: number;
  category_name?: string;
  brand_id?: number;
  brand_name?: string;
  model_id?: number;
  model_name?: string;
  vendor_id?: number;
  vendor_name?: string;
  unit?: string;
  purchase_price?: number;
  status: ConsumableStatus;
  stock_quantity: number;
  min_stock?: number;
  max_stock?: number;
  location?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
  // For dashboard/table compatibility
  code: string;
  category: string;
  stock: number;
}

export type ConsumableStatus = 'active' | 'out_of_stock' | 'discontinued';

export interface ConsumableAssignment {
  id: number;
  consumable_id: number;
  assigned_to_type: 'asset' | 'user' | 'location';
  assigned_to_id: number;
  quantity: number;
  assigned_date?: string;
  status: 'assigned' | 'used' | 'returned';
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ConsumableStockMovement {
  id: number;
  consumable_id: number;
  movement_type: 'in' | 'out' | 'adjustment';
  quantity: number;
  reference?: string;
  movement_date?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

// For paginated API responses
export interface ConsumableListResponse {
  data: Consumable[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
} 