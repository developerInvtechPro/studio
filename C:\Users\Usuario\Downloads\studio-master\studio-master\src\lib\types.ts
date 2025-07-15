

export interface Product {
  id: number;
  name: string;
  price: number;
  categoryId: number;
  imageUrl: string | null;
  imageHint: string | null;
  unitOfMeasureSale: string | null;
  unitOfMeasurePurchase: string | null;
  isActive: boolean;
  taxRate: number;
  stock: number;
  cost_price: number | null;
}

export interface Category {
  id: number;
  name: string;
  iconName: string;
}

export interface OrderItem {
  id: number; // This is the order_items.id
  product: Product;
  quantity: number;
  price_at_time: number;
}

export interface Table {
  id: number;
  name: string;
  status: 'available' | 'occupied' | 'reserved';
}

export interface User {
  id: number;
  username: string;
  password?: string;
  role: 'admin' | 'cashier';
}

export interface Shift {
  id: number;
  userId: number;
  startTime: string;
  endTime?: string | null;
  startingCash: number;
  endingCash?: number | null;
  isActive: boolean;
}

export interface Customer {
  id: number;
  name: string;
  rtn: string | null;
  phone: string | null;
  address: string | null;
}

export interface Order {
    id: number;
    shift_id: number;
    table_id: number | null;
    customer_id: number | null;
    customer_name: string | null;
    subtotal: number;
    tax_amount: number;
    discount_percentage: number;
    discount_amount: number;
    total_amount: number;
    status: 'pending' | 'completed' | 'cancelled' | 'suspended';
    created_at: string;
    items: OrderItem[];
    order_type: 'dine-in' | 'take-away' | 'delivery';
    invoice_number: string | null;
    cai_id: number | null;
}

export interface PaymentMethod {
    id: number;
    name: string;
    type: 'cash' | 'card' | 'transfer' | 'other';
}

export type Payment = {
    paymentMethodId: number;
    amount: number;
};

export interface CompletedOrderInfo {
  id: number;
  customer_name: string | null;
  total_amount: number;
  created_at: string;
  invoice_number: string | null;
}

export interface CompanyInfo {
    id: number;
    name: string | null;
    rtn: string | null;
    address: string | null;
    phone: string | null;
    email: string | null;
    website: string | null;
}

export interface CaiRecord {
    id: number;
    cai: string;
    range_start: string;
    range_end: string;
    current_invoice_number: string | null;
    issue_date: string;
    expiration_date: string;
    status: 'active' | 'pending' | 'inactive';
}

export interface Supplier {
    id: number;
    name: string;
    rtn: string | null;
    phone: string | null;
    address: string | null;
    email: string | null;
}

export interface FullInvoiceData {
    order: Order;
    companyInfo: CompanyInfo;
    caiRecord: CaiRecord;
    customer: Customer | null;
    payments: { name: string; amount: number }[];
}


export interface PurchaseInvoiceItem {
    id: number; // This is a temporary ID for the frontend
    product: Product;
    quantity: number;
    cost: number;
}

export interface PurchaseInvoice {
    id?: number;
    supplier: Supplier;
    invoiceNumber: string | null;
    invoiceDate: Date;
    items: PurchaseInvoiceItem[];
    totalAmount: number;
}
