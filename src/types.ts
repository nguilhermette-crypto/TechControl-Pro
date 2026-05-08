export type UserRole = 'admin' | 'tech' | 'cashier' | 'staff';

export interface UserProfile {
  uid: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: any;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  quantity: number;
  minQuantity: number;
  barcode: string;
  price: number;
  cost: number;
  updatedAt: any;
}

export interface StockMovement {
  id: string;
  productId: string;
  type: 'in' | 'out';
  quantity: number;
  reason: string;
  date: any;
  userId: string;
}

export interface SaleItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Sale {
  id: string;
  items: SaleItem[];
  total: number;
  paymentMethod: 'pix' | 'card' | 'cash' | 'installments';
  customerId?: string;
  date: any;
  profit: number;
  userId: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  createdAt: any;
}

export type OSStatus = 'analysis' | 'waiting_parts' | 'repairing' | 'finished' | 'delivered';

export interface DeviceInfo {
  brand: string;
  model: string;
  imei?: string;
  color: string;
}

export interface TechnicalEvaluation {
  issues: string[];
  notes?: string;
}

export interface ServiceOrder {
  id: string;
  customerId: string;
  customerName?: string;
  device: DeviceInfo;
  status: OSStatus;
  evaluation: TechnicalEvaluation;
  photos: string[];
  technicalReport?: string;
  total: number;
  createdAt: any;
  updatedAt: any;
}
