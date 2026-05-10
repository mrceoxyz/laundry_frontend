import axios from 'axios';
import { Customer, Feedback, GarmentType, Invoice, Order, Payment, Receipt, ServiceType, Staff } from '../types';

const API_BASE_URL = 'https://els-backend-12.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Customer API
export const customerAPI = {
  getAll: () => api.get<Customer[]>('/customers/'),
  getOne: (id: number) => api.get<Customer>(`/customers/${id}/`),
  create: (data: Partial<Customer>) => api.post<Customer>('/customers/', data),
  update: (id: number, data: Partial<Customer>) => api.put<Customer>(`/customers/${id}/`, data),
  delete: (id: number) => api.delete(`/customers/${id}/`),
};

// Staff API
export const staffAPI = {
  getAll: () => api.get<Staff[]>('/staff/'),
  getOne: (id: number) => api.get<Staff>(`/staff/${id}/`),
  create: (data: Partial<Staff>) => api.post<Staff>('/staff/', data),
  update: (id: number, data: Partial<Staff>) => api.patch<Staff>(`/staff/${id}/`, data),
  delete: (id: number) => api.delete(`/staff/${id}/`),
};

// Garment Type API
export const garmentTypeAPI = {
  getAll: () => api.get<GarmentType[]>('/garment-types/'),
  getOne: (id: number) => api.get<GarmentType>(`/garment-types/${id}/`),
  create: (data: Partial<GarmentType>) => api.post<GarmentType>('/garment-types/', data),
  update: (id: number, data: Partial<GarmentType>) => api.put<GarmentType>(`/garment-types/${id}/`, data),
  delete: (id: number) => api.delete(`/garment-types/${id}/`),
};

// Service Type API
export const serviceTypeAPI = {
  getAll: () => api.get<ServiceType[]>('/service-types/'),
  getOne: (id: number) => api.get<ServiceType>(`/service-types/${id}/`),
  create: (data: Partial<ServiceType>) => api.post<ServiceType>('/service-types/', data),
  update: (id: number, data: Partial<ServiceType>) => api.put<ServiceType>(`/service-types/${id}/`, data),
  delete: (id: number) => api.delete(`/service-types/${id}/`),
};

// Order API
export const orderAPI = {
  getAll: () => api.get<Order[]>('/orders/'),
  getOne: (id: number) => api.get<Order>(`/orders/${id}/`),
  create: (data: Partial<Order>) => api.post<Order>('/orders/', data),
  update: (id: number, data: string) => api.patch(`/orders/${id}/status/`, {
    status: data
  }),
  delete: (id: number) => api.delete(`/orders/${id}/`),
  getStatistics: () => api.get('/orders/statistics/'),
  assignStaff(
    orderId: number,
    staffId: number | null,
    type: 'washer' | 'ironer'
  ) {
    return api.patch(`/orders/${orderId}/assign-staff/`, {
      staff_id: staffId,
      type,
    });
  }
};

// Invoice API
export const invoiceAPI = {
  getAll: () => api.get<Invoice[]>('/invoices/'),
  getOne: (id: number) => api.get<Invoice>(`/invoices/${id}/`),
};

// Payment API
export const paymentAPI = {
  getAll: () => api.get<Payment[]>('/payments/'),
  getOne: (id: number) => api.get<Payment>(`/payments/${id}/`),
  create: (data: Partial<Payment>) => api.post<Payment>('/payments/', data),
  delete: (id: number) => api.delete(`/payments/${id}/`),
  update: (id: number, data: string) => api.patch(`/payments/${id}/`, {
    status: data
  }),
  getStatistics: () => api.get('/payments/statistics/'),
  getReceipt: (id: number) => api.get(`/payments/${id}/receipt/`),
};

// Feedback API
export const feedbackAPI = {
  getAll: () => api.get<Feedback[]>('/feedbacks/'),
  getOne: (id: number) => api.get<Feedback>(`/feedbacks/${id}/`),
  create: (data: Partial<Feedback>) => api.post<Feedback>('/feedbacks/', data),
  getStatistics: () => api.get('/feedbacks/statistics/'),
};


// Receipt API
export const receiptAPI = {
  getAll: () => api.get<Receipt[]>('/receipts/'),
  getOne: (id: number) => api.get<Receipt>(`/receipts/${id}/`),
};

export default api;