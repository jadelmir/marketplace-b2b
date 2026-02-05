export interface Supplier {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  description: string;
  logo?: string;
  rating: number;
  totalReviews: number;
  createdAt: string;
  companyName?: string;
  contactName?: string;
  businessAddress?: string;
}

export interface Product {
  id: string;
  supplier_id?: string;
  supplierId?: string;
  name: string;
  description: string;
  category_id?: string;
  category?: string;
  category_name?: string;
  subcategory_id?: string;
  subcategory?: string;
  subcategory_name?: string;
  price: number | string;
  stock?: number;
  sku?: string;
  image_url?: string;
  is_active?: number | boolean;
  created_at?: string;
  updated_at?: string;
  createdAt?: string;
  updatedAt?: string;
  unit?: string;
  moq?: number;
  availability?: number;
  status?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  supplierId: string;
}

export interface Order {
  id: string;
  buyerId: string;
  supplierId: string;
  supplierName: string;
  items: OrderItem[];
  status: 'pending' | 'confirmed' | 'rejected' | 'completed';
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  unit: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  image?: string;
  subcategories?: Subcategory[];
}

export interface Subcategory {
  id: string;
  name: string;
  icon: string;
  image?: string;
}

// Supplier Portal Types
export interface SupplierUser {
  id: string;
  email: string;
  name?: string;
  password?: string; // Only on client for login, not stored
  companyName?: string;
  contactName?: string;
  phone?: string;
  businessAddress?: string;
  businessLicense?: string;
  logo?: string;
  description?: string;
  specialties?: string[]; // Category IDs they specialize in
  createdAt?: string;
  updatedAt?: string;
}

export interface SupplierProduct {
  id: string;
  supplierId: string;
  name: string;
  description: string;
  category: string; // Category ID
  subcategory: string; // Subcategory name
  price: number;
  unit: string; // kg, pieces, liters, boxes, etc.
  moq: number; // Minimum Order Quantity
  stock: number; // Current availability
  sku?: string;
  images?: string[];
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface SupplierDiscount {
  id: string;
  supplierId: string;
  productId: string;
  type: 'fixed' | 'percentage'; // Fixed amount or percentage
  value: number; // Discount amount or percentage
  originalPrice: number;
  newPrice: number;
  minQuantity?: number; // Minimum quantity to apply discount
  startDate: string;
  endDate: string;
  code?: string;
  description?: string;
  status: 'active' | 'scheduled' | 'expired';
  createdAt: string;
  updatedAt: string;
}

export interface SupplierOrder {
  id: string;
  supplierId: string;
  buyerId: string;
  buyerName: string;
  buyerEmail?: string;
  items: SupplierOrderItem[];
  status: 'new' | 'accepted' | 'rejected' | 'ready_for_shipment' | 'shipped' | 'fulfilled';
  totalPrice: number;
  deliveryAddress?: string;
  specialInstructions?: string;
  rejectionReason?: string;
  rejectionNote?: string;
  trackingNumber?: string;
  createdAt: string;
  updatedAt: string;
  acceptedAt?: string;
  shippedAt?: string;
  fulfilledAt?: string;
}

export interface SupplierOrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unit: string;
  pricePerUnit: number;
  totalPrice: number;
  discountApplied?: number;
}

export interface StockHistory {
  id: string;
  productId: string;
  supplierId: string;
  previousStock: number;
  newStock: number;
  change: number;
  reason: 'new_shipment' | 'stock_adjustment' | 'sale' | 'damaged_return' | 'other';
  notes?: string;
  createdAt: string;
}
