export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  created_at: string;
}

export interface Staff {
  id: number;
  name: string;
  role: 'washer' | 'ironer' | 'delivery' | 'manager';
  phone: string;
  account_number?: string;
  is_active: boolean;
  created_at: string;
}

export interface GarmentType {
  id: number;
  name: 'native_wear' | 'english_wear' | 'bed_sheet' | 'agbada';
  base_price: number;
  description: string;
}

export interface ServiceType {
  id: number;
  name: 'regular' | 'express';
  price_multiplier: string;
  description: string;
}

export interface OrderItem {
  id?: number;
  garment_type: number;
  garment_name?: string;
  quantity: number;
  unit_price?: number;
  total_price?: number;
}

export interface Order {
  id: number;
  customer: number;
  customer_name?: string;
  order_number: string;
  service_type: number;
  service_name?: string;
  delivery_type: 'pickup' | 'byself';
  delivery_fee: string;
  subtotal: number;
  total_amount: number;
  status: 'pending' | 'processing' | 'ready' | 'delivered' | 'cancelled';
  created_at: string;
  updated_at: string;
  notes: string;
  items?: OrderItem[];
   /* === STAFF ASSIGNMENTS === */
  assigned_washer: number | null;
  assigned_washer_name?: string;

  assigned_ironer: number | null;
  assigned_ironer_name?: string;

}

export type InvoiceType =
  | 'INVOICE'      // normal unpaid invoice
  | 'RECEIPT'      // paid invoice
  | 'PROFORMA'     // quotation-style
  | 'CREDIT_NOTE'; // refund / adjustment

export interface Invoice {
  id: number;
  order: number;
  order_details?: Order;
  customer_name?: string;
  invoice_number: string;
  issued_date: string;
  due_date: string;
  payment_status: 'unpaid' | 'partial' | 'paid';
  amount_paid: number;
  balance_due: number;
  total_amount?: number;
}

export interface InvoicePDFPayload {
  invoice_number: string;
  type: InvoiceType;
  status: 'paid' | 'unpaid' | 'partial';
  customer: {
    customer_name: string;
    customer_phone: string;
  };
  items: {
    name: string;
    quantity: number;
    total: number;
  }[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  amount_paid?: number;
  balance?: number;
  created_at: string;
}


export interface Payment {
  id: number;
  invoice: number;
  invoice_number?: string;
  amount: number;
  payment_method: 'cash' | 'card' | 'transfer';
  status: 'pending' | 'completed' | 'failed';
  transaction_reference: string;
  payment_date: string;
  notes: string;
  has_receipt?: boolean;
}

export interface Feedback {
  id: number;
  customer: number;
  customer_name?: string;
  order: number;
  order_number?: string;
  rating: number;
  comment: string;
  created_at: string;
}

export interface Receipt {
  id: number;
  payment: number;
  receipt_number: string;
  generated_date: string;
  payment_details?: {
    amount: number;
    method: string;
    status: string;
    date: string;
    reference: string;
  };
  invoice_details?: {
    invoice_number: string;
    order_number: string;
    customer_name: string;
    total_amount: number;
    amount_paid: number | undefined;
    balance_due: number;
    payment_status: string;
  };
}

export interface Feedback {
  id: number;
  customer: number;
  customer_name?: string;
  order: number;
  order_number?: string;
  rating: number;
  comment: string;
  created_at: string;
}
