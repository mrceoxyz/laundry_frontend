/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { useRequireAuth } from '@/src/hooks/useRequireAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';
import { Label } from '@/src/components/ui/Label';
import { Textarea } from '@/src/components/ui/TextArea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/src/components/ui/Tabs';
import { PageFade, SectionFade } from '@/src/components/ui/Motion';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/src/components/ui/Dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/components/ui/Select';
import {
  Package,
  FileText,
  CreditCard,
  MessageSquare,
  Users,
  UserCog,
  TrendingUp,
  Plus,
  Edit,
  Trash2,
  Receipt as ReceiptIcon,
  Eye,
  EyeIcon,
} from 'lucide-react';
import {
  orderAPI,
  invoiceAPI,
  paymentAPI,
  feedbackAPI,
  customerAPI,
  staffAPI,
  garmentTypeAPI,
  serviceTypeAPI,
  receiptAPI,
} from '@/src/lib/api';
import type {
  Order,
  Invoice,
  Payment,
  Feedback,
  Customer,
  Staff,
  GarmentType,
  ServiceType,
  Receipt,
} from '@/src/types/index';
import toast, { Toaster } from 'react-hot-toast';
import { formatCurrency } from '@/src/lib/format';
import { generateInvoicePDF } from '@/src/lib/pdf/generateInvoice';


const BUSINESS_BANK_DETAILS = {
    bank_name: 'XXXXXXXXXXX',
    account_name: 'Elite Laundry Services',
    account_number: 'XXXXXXXXXXX',
  };
  

export default function AdminDashboard() {
  useRequireAuth('admin');

  const [orders, setOrders] = useState<Order[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [garmentTypes, setGarmentTypes] = useState<GarmentType[]>([]);
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([]);
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
    averageRating: 0,
  });

  const [editingItem, setEditingItem] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<string>('');
  const [selectedReceipt, setSelectedReceipt] = useState<Receipt | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  

  const loadData = async () => {
    try {
      const [
        ordersRes,
        invoicesRes,
        paymentsRes,
        feedbacksRes,
        customersRes,
        staffRes,
        garmentTypesRes,
        serviceTypesRes,
        receiptsRes,
        orderStats,
        feedbackStats,
      ] = await Promise.all([
        orderAPI.getAll(),
        invoiceAPI.getAll(),
        paymentAPI.getAll(),
        feedbackAPI.getAll(),
        customerAPI.getAll(),
        staffAPI.getAll(),
        garmentTypeAPI.getAll(),
        serviceTypeAPI.getAll(),
        receiptAPI.getAll(),
        orderAPI.getStatistics(),
        feedbackAPI.getStatistics(),
      ]);

      setOrders(ordersRes.data);
      setInvoices(invoicesRes.data);
      setPayments(paymentsRes.data);
      setFeedbacks(feedbacksRes.data);
      setCustomers(customersRes.data);
      setStaff(staffRes.data);
      setGarmentTypes(garmentTypesRes.data);
      setServiceTypes(serviceTypesRes.data);
      setReceipts(receiptsRes.data);
      console.log(ordersRes.data);
      
      setStats({
        totalOrders: orderStats.data.total_orders,
        pendingOrders: orderStats.data.pending_orders,
        totalRevenue: orderStats.data.total_revenue,
        averageRating: feedbackStats.data.average_rating,
      });
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);


  const openDialog = (type: string, item?: any) => {
    setDialogType(type);
    setEditingItem(item || null);
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditingItem(null);
    setDialogType('');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: any = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });

    try {
      switch (dialogType) {
        case 'customer':
          if (editingItem) {
            await customerAPI.update(editingItem.id, data);
            toast.success('Customer updated successfully');
          } else {
            await customerAPI.create(data);
            toast.success('Customer added successfully');
          }
          break;
        case 'staff':
          if (editingItem) {
            await staffAPI.update(editingItem.id, data);
            toast.success('Staff updated successfully');
          } else {
            await staffAPI.create(data);
            toast.success('Staff added successfully');
          }
          break;
        case 'garment':
          if (editingItem) {
            await garmentTypeAPI.update(editingItem.id, data);
            toast.success('Garment updated successfully');
          } else {
            await garmentTypeAPI.create(data);
            toast.success('Garment added successfully');
            }
          break;
        case 'service':
          if (editingItem) {
            await serviceTypeAPI.update(editingItem.id, data);
            toast.success('Service updated successfully');
          } else {
            await serviceTypeAPI.create(data);
            toast.success('Service added successfully');
            }
          break;
        case 'payment':
          if (editingItem) {
            await paymentAPI.update(editingItem.id, data);
            toast.success('Payment updated successfully');
          } else {
            await paymentAPI.create(data);
            toast.success('Payment added successfully');
            }
          break;
      }
      closeDialog();
      loadData();
    } catch (error) {
      // console.error('Error saving:', error);
      toast.error('Error saving data');
    }
  };

  const handleDelete = async (type: string, id: number) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      switch (type) {
        case 'customer':
          await customerAPI.delete(id);
          toast.success('Customer deleted successfully');
          break;
        case 'staff':
          await staffAPI.delete(id);
          toast.success('Staff deleted successfully');
          break;
        case 'garment':
          await garmentTypeAPI.delete(id);
          toast.success('Garment deleted successfully');
          break;
        case 'service':
          await serviceTypeAPI.delete(id);
          toast.success('Service deleted successfully');
          break;
        case 'order':
          await orderAPI.delete(id);
          toast.success('Order deleted successfully');
          break;
        case 'payment':
          await paymentAPI.delete(id);
          toast.success('Payment deleted successfully');
          break;
      }
      loadData();
    } catch (error) {
      // console.error('Error deleting:', error);
      toast.error('Error deleting data');
    }
  };

  const viewOrder = async (orderId: number) => {
    try{
      const response = await orderAPI.getOne(orderId);
      console.log(response.data);
      
      setSelectedOrder(response.data)
    }catch (error) {
      toast.error('Order not found');
    }
  }

  const updateOrderStatus = async (orderId: number, status: string) => {
    try {
      await orderAPI.update(orderId, status);
      toast.success('Customer notified via SMS!');
      loadData();
    } catch (error) {
      toast.error('Error updating order:');
    }
  };

  const assignOrderStaff = async (
    orderId: number,
    staffId: number | null,
    type: 'washer' | 'ironer'
  ) => {
    try {
      await orderAPI.assignStaff(orderId, staffId, type);
      toast.success(
        `${type === 'washer' ? 'Washer' : 'Ironer'} assigned successfully`
      );
      loadData();
    } catch (error) {
      toast.error('Failed to assign staff');
    }
  };


  const updatePaymentStatus = async (paymentId: number, status: string) => {
    try {
      await paymentAPI.update(paymentId, status);
      toast.success('Payment status updated successfully');
      loadData();
    } catch (error) {
      toast.error('Error updating payment:');
    }
  };

  const viewReceipt = async (paymentId: number) => {
    try {
      const response = await paymentAPI.getReceipt(paymentId);
      setSelectedReceipt(response.data);
    } catch (error) {
      console.error('Error loading receipt:', error);
      toast.error('Receipt not found');
    }
  };

  const printReceipt = () => {
    if (!selectedReceipt) return;
    const printWindow = window.open('', '', 'height=600,width=800');
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Receipt ${selectedReceipt.receipt_number}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { text-align: center; }
            .receipt-container { max-width: 600px; margin: 0 auto; }
            .receipt-header { text-align: center; margin-bottom: 20px; }
            .receipt-details { margin: 20px 0; }
            .detail-row { display: flex; justify-between; padding: 8px 0; border-bottom: 1px solid #eee; }
            .detail-label { font-weight: bold; }
            .total-row { font-weight: bold; font-size: 1.2em; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="receipt-container">
            <div class="receipt-header">
              <h1>PAYMENT RECEIPT</h1>
              <p><strong>Receipt #: ${selectedReceipt.receipt_number}</strong></p>
              <p>Date: ${new Date(selectedReceipt.generated_date).toLocaleString()}</p>
            </div>
            <div class="receipt-details">
              <h3>Customer Information</h3>
              <div class="detail-row">
                <span class="detail-label">Customer:</span>
                <span>${selectedReceipt.invoice_details?.customer_name || 'N/A'}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Order Number:</span>
                <span>${selectedReceipt.invoice_details?.order_number || 'N/A'}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Invoice Number:</span>
                <span>${selectedReceipt.invoice_details?.invoice_number || 'N/A'}</span>
              </div>
              
              <h3 style="margin-top: 20px;">Payment Details</h3>
              <div class="detail-row">
                <span class="detail-label">Payment Method:</span>
                <span>${selectedReceipt.payment_details?.method || 'N/A'}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Transaction Reference:</span>
                <span>${selectedReceipt.payment_details?.reference || 'N/A'}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Payment Date:</span>
                <span>${new Date(selectedReceipt.payment_details?.date || '').toLocaleString()}</span>
              </div>
              
              <h3 style="margin-top: 20px;">Amount Details</h3>
              <div class="detail-row">
                <span class="detail-label">Total Amount:</span>
                <span>${formatCurrency(selectedReceipt.invoice_details?.total_amount || 0)}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Amount Paid (This Payment):</span>
                <span>${formatCurrency(selectedReceipt.payment_details?.amount || 0)}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Total Paid:</span>
                <span>${formatCurrency(selectedReceipt.invoice_details?.amount_paid || 0)}</span>
              </div>
              <div class="detail-row total-row">
                <span class="detail-label">Balance Due:</span>
                <span>${formatCurrency(selectedReceipt.invoice_details?.balance_due || 0)}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Payment Status:</span>
                <span>${selectedReceipt.invoice_details?.payment_status || 'N/A'}</span>
              </div>
              <h3 style="margin-top: 20px;">Bank Transfer Details</h3>
              <div class="detail-row">
                <span class="detail-label">Bank Name:</span>
                <span>${BUSINESS_BANK_DETAILS.bank_name}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Account Name:</span>
                <span>${BUSINESS_BANK_DETAILS.account_name}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Account Number:</span>
                <span>${BUSINESS_BANK_DETAILS.account_number}</span>
              </div>
            </div>
            <div style="text-align: center; margin-top: 40px;">
              <p>Thank you for your patronage!</p>
              <p style="font-size: 0.9em; color: #666;">This is a computer-generated receipt and does not require a signature.</p>
            </div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const q = searchQuery.toLowerCase();

  const filteredOrders = orders.filter(o =>
    o.order_number?.toLowerCase().includes(q) ||
    o.customer_name?.toLowerCase().includes(q) ||
    o.service_name?.toLowerCase().includes(q) ||
    o.status?.toLowerCase().includes(q)
  );

  const filteredInvoices = invoices.filter(i =>
    i.invoice_number?.toLowerCase().includes(q) ||
    i.customer_name?.toLowerCase().includes(q) ||
    i.payment_status?.toLowerCase().includes(q)
  );

  const filteredPayments = payments.filter(p =>
    p.invoice_number?.toLowerCase().includes(q) ||
    p.payment_method?.toLowerCase().includes(q) ||
    p.status?.toLowerCase().includes(q)
  );

  const filteredReceipts = receipts.filter(r =>
    r.receipt_number?.toLowerCase().includes(q)
  );

  const filteredCustomers = customers.filter(c =>
    c.name?.toLowerCase().includes(q) ||
    c.phone?.toLowerCase().includes(q) ||
    c.email?.toLowerCase().includes(q)
  );

  const filteredStaff = staff.filter(s =>
    s.name?.toLowerCase().includes(q) ||
    s.role?.toLowerCase().includes(q) ||
    s.phone?.toLowerCase().includes(q) ||
    s.account_number?.toLowerCase().includes(q)
  );

  const filteredFeedbacks = feedbacks.filter(f =>
    f.customer_name?.toLowerCase().includes(q) ||
    f.order_number?.toLowerCase().includes(q) ||
    f.comment?.toLowerCase().includes(q)
  );


  return (
    <PageFade>
      <Toaster />
      <div className="container mx-auto px-4 py-8 max-w-7xl mt-16">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">
          Admin Dashboard
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage operations, payments, staff, and system settings
        </p>
      </div>

      {/* Statistics Cards */}
      <SectionFade>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <Card className="transition hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalOrders}</div>
              <p className="text-xs text-muted-foreground">{stats.pendingOrders} pending</p>
            </CardContent>
          </Card>

          <Card className="transition hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">{formatCurrency(stats.totalRevenue)}</div>
            </CardContent>
          </Card>

          <Card className="transition hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.averageRating}/5</div>
              <p className="text-xs text-muted-foreground">From {feedbacks.length} reviews</p>
            </CardContent>
          </Card>

          <Card className="transition hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{customers.length}</div>
            </CardContent>
          </Card>
      </div>
      </SectionFade>

      {/* Tabs for different sections */}
      <SectionFade>
        <Tabs defaultValue="orders" className="space-y-6" onValueChange={() => setSearchQuery('')}>
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="invoices">Invoices</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="receipts">Receipts</TabsTrigger>
            <TabsTrigger value="feedback">Feedback</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
            <TabsTrigger value="staff">Staff</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Orders Tab */}
          <TableSearch
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Searchs by number, customer, service, invoice number, name, account number or status"
          />
          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Orders Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Order #</th>
                        <th className="text-left p-2">Customer</th>
                        <th className="text-left p-2">Service</th>
                        <th className="text-left p-2">Total</th>
                        <th className="text-left p-2">Status</th>
                        <th className='text-left p-2'>Washer</th>
                        <th className='text-left p-2'>Ironer</th>
                        <th className="text-left p-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders.map((order) => (
                        <tr key={order.id} className="border-b">
                          <td className="p-2">{order.order_number}</td>
                          <td className="p-2">{order.customer_name}</td>
                          <td className="p-2 capitalize">{order.service_name}</td>
                          <td className="p-2 text-green-400">{formatCurrency(order.total_amount)}</td>
                          <td className="p-2">
                            <select
                              className="border bg-gray-600 rounded px-2 py-1 text-sm"
                              value={order.status}
                              onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                            >
                              <option value="pending">Pending</option>
                              <option value="processing">Processing</option>
                              <option value="ready">Ready</option>
                              <option value="delivered">Delivered</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </td>
                          {/* <td className="p-2">
                            <select
                              className="border rounded px-2 py-1 text-sm bg-gray-700 w-full"
                              value={order.assigned_staff || ''}
                              onChange={(e) =>
                                assignOrderStaff(
                                  order.id,
                                  e.target.value ? Number(e.target.value) : null
                                )
                              }
                            >
                              <option value="">Unassigned</option>
                              {staff
                                .filter((s) => s.is_active)
                                .map((member) => (
                                  <option key={member.id} value={member.id}>
                                    {member.name} ({member.role})
                                  </option>
                                ))}
                            </select>

                            {order.assigned_staff_name && (
                              <p className="text-xs text-muted-foreground mt-1">
                                Currently: {order.assigned_staff_name}
                              </p>
                            )}
                          </td> */}
                          <td>
                            <select
                            className="border bg-gray-600 rounded px-2 py-1 text-sm"
                              value={order.assigned_washer || ''}
                              onChange={(e) =>
                                assignOrderStaff(
                                  order.id,
                                  e.target.value ? Number(e.target.value) : null,
                                  'washer'
                                )
                              }
                            >
                              <option value="">Unassigned</option>
                              {staff
                                .filter((s) => s.role === 'washer' && s.is_active)
                                .map((washer) => (
                                  <option key={washer.id} value={washer.id}>
                                    {washer.name}
                                  </option>
                                ))}
                            </select>
                            {/* {order.assigned_washer_name && (
                              <p className="text-xs text-muted-foreground mt-1">
                                Currently: {order.assigned_washer_name}
                              </p>
                            )} */}
                          </td>
                          <td>
                            <select
                              value={order.assigned_ironer || ''}
                              onChange={(e) =>
                                assignOrderStaff(
                                  order.id,
                                  e.target.value ? Number(e.target.value) : null,
                                  'ironer'
                                )
                              }
                              className="border bg-gray-600 rounded px-2 py-1 text-sm"
                            >
                              <option value="">Unassigned</option>
                              {staff
                                .filter((s) => s.role === 'ironer' && s.is_active)
                                .map((ironer) => (
                                  <option key={ironer.id} value={ironer.id}>
                                    {ironer.name}
                                  </option>
                                ))}
                            </select>
                            {/* {order.assigned_ironer_name && (
                              <p className="text-xs text-muted-foreground mt-1">
                                Currently: {order.assigned_ironer_name}
                              </p>
                            )} */}
                          </td>

                          <td className="p-2">
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDelete('order', order.id)}
                            >
                              <Trash2 className="h-4 w-4 text-gray-200 cursor-pointer" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => viewOrder(order.id)}
                            >
                              <EyeIcon className="h-4 w-4 text-gray-200 cursor-pointer" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Continue with other tabs in next artifact... */}
        {/* Invoices Tab */}
        {/* <TableSearch
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search invoices by number, customer or status"
          /> */}
          <TabsContent value="invoices">
            <Card>
              <CardHeader>
                <CardTitle>Invoices</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Invoice #</th>
                        <th className="text-left p-2">Order #</th>
                        <th className="text-left p-2">Customer</th>
                        <th className="text-left p-2">Total</th>
                        <th className="text-left p-2">Paid</th>
                        <th className="text-left p-2">Balance</th>
                        <th className="text-left p-2">Status</th>
                        <th className="text-left p-2">Due Date</th>
                        <th className="text-left p-2">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredInvoices.map((invoice) => (
                        <tr key={invoice.id} className="border-b">
                          <td className="p-2">{invoice.invoice_number}</td>
                          <td className="p-2">{invoice.order_details?.order_number}</td>
                          <td className="p-2">{invoice.customer_name}</td>
                          <td className="p-2 text-green-400">
                            {formatCurrency(invoice.total_amount || invoice.order_details?.total_amount || 0)}
                          </td>
                          <td className="p-2">{formatCurrency(invoice.amount_paid)}</td>
                          <td className="p-2 text-red-400">{formatCurrency(invoice.balance_due)}</td>
                          <td className="p-2">
                            <span
                              className={`px-2 py-1 rounded text-xs ${
                                invoice.payment_status === 'paid'
                                  ? 'bg-green-100 text-green-800'
                                  : invoice.payment_status === 'partial'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {invoice.payment_status}
                            </span>
                          </td>
                          <td className="p-2">{new Date(invoice.due_date).toLocaleDateString()}</td>
                          {/* <td className="p-2">
                            <Button
                              variant="outline"
                              onClick={() => generateInvoicePDF(invoice)}
                            >
                              Print Invoice
                            </Button>
                          </td> */}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payments Tab */}
          {/* <TableSearch
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search payments by invoice number"
          /> */}
          <TabsContent value="payments">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Payments</CardTitle>
                <Button onClick={() => openDialog('payment')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Payment
                </Button>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Invoice #</th>
                        <th className="text-left p-2">Amount</th>
                        <th className="text-left p-2">Method</th>
                        <th className="text-left p-2">Status</th>
                        <th className="text-left p-2">Date</th>
                        <th className="text-left p-2">Receipt</th>
                        <th className="text-left p-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPayments.map((payment) => (
                        <tr key={payment.id} className="border-b">
                          <td className="p-2">{payment.invoice_number}</td>
                          <td className="p-2 text-green-400">{formatCurrency(payment.amount)}</td>
                          <td className="p-2 capitalize">{payment.payment_method}</td>
                          <td className="p-2">
                            <select
                              className="border rounded px-2 py-1 text-sm bg-gray-700"
                              value={payment.status}
                              onChange={(e) => updatePaymentStatus(payment.id, e.target.value)}
                            >
                              <option value="pending">Pending</option>
                              <option value="completed">Completed</option>
                              <option value="failed">Failed</option>
                            </select>
                          </td>
                          <td className="p-2">{new Date(payment.payment_date).toLocaleDateString()}</td>
                          <td className="p-2">
                            {payment.has_receipt && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => viewReceipt(payment.id)}
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Button>
                            )}
                          </td>
                          <td className="p-2 space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openDialog('payment', payment)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDelete('payment', payment.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Receipts Tab */}
          {/* <TableSearch
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search receipts by number"
          /> */}
          <TabsContent value="receipts">
            <Card>
              <CardHeader>
                <CardTitle>Receipts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Receipt #</th>
                        <th className="text-left p-2">Payment Amount</th>
                        <th className="text-left p-2">Generated Date</th>
                        <th className="text-left p-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredReceipts.map((receipt) => (
                        <tr key={receipt.id} className="border-b">
                          <td className="p-2">{receipt.receipt_number}</td>
                          <td className="p-2 text-green-400">
                            {formatCurrency(receipt.payment_details?.amount || 0)}
                          </td>
                          <td className="p-2">
                            {new Date(receipt.generated_date).toLocaleDateString()}
                          </td>
                          <td className="p-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedReceipt(receipt)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Feedback Tab */}
          {/* <TableSearch
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search feedbacks by, customer"
          /> */}
          <TabsContent value="feedback">
            <Card>
              <CardHeader>
                <CardTitle>Customer Feedback</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredFeedbacks.map((feedback) => (
                    <div key={feedback.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="font-semibold">{feedback.customer_name}</div>
                          <div className="text-sm text-gray-600">Order: {feedback.order_number}</div>
                        </div>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <span
                              key={i}
                              className={i < feedback.rating ? 'text-yellow-400' : 'text-gray-300'}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-700">{feedback.comment}</p>
                      <div className="text-xs text-gray-500 mt-2">
                        {new Date(feedback.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Customers Tab */}
          {/* <TableSearch
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search customer by number, name..."
          /> */}
          <TabsContent value="customers">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Customers</CardTitle>
                <Button onClick={() => openDialog('customer')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Customer
                </Button>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Name</th>
                        <th className="text-left p-2">Email</th>
                        <th className="text-left p-2">Phone</th>
                        <th className="text-left p-2">Address</th>
                        <th className="text-left p-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCustomers.map((customer) => (
                        <tr key={customer.id} className="border-b">
                          <td className="p-2">{customer.name}</td>
                          <td className="p-2">{customer.email}</td>
                          <td className="p-2">{customer.phone}</td>
                          <td className="p-2">{customer.address}</td>
                          <td className="p-2 space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openDialog('customer', customer)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDelete('customer', customer.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Staff Tab */}
          {/* <TableSearch
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search staffs by account number, name or status"
          /> */}
          <TabsContent value="staff">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Staff Management</CardTitle>
                <Button onClick={() => openDialog('staff')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Staff
                </Button>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Name</th>
                        <th className="text-left p-2">Role</th>
                        <th className="text-left p-2">Phone</th>
                        <th className="text-left p-2">Account Number</th>
                        <th className="text-left p-2">Status</th>
                        <th className="text-left p-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredStaff.map((member) => (
                        <tr key={member.id} className="border-b">
                          <td className="p-2">{member.name}</td>
                          <td className="p-2 capitalize">{member.role}</td>
                          <td className="p-2">{member.phone}</td>
                          <td className="p-2">{member.account_number || 'N/A'}</td>
                          <td className="p-2">
                            <span
                              className={`px-2 py-1 rounded text-xs ${
                                member.is_active
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {member.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="p-2 space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openDialog('staff', member)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDelete('staff', member.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Garment Types</CardTitle>
                  <Button onClick={() => openDialog('garment')}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {garmentTypes.map((garment) => (
                      <div
                        key={garment.id}
                        className="flex justify-between items-center p-2 border rounded"
                      >
                        <div>
                          <div className="font-semibold capitalize">
                            {garment.name.replace('_', ' ')}
                          </div>
                          <div className="text-sm text-green-400">
                            {formatCurrency(garment.base_price)}
                          </div>
                        </div>
                        <div className="space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openDialog('garment', garment)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete('garment', garment.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Service Types</CardTitle>
                  <Button onClick={() => openDialog('service')}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {serviceTypes.map((service) => (
                      <div
                        key={service.id}
                        className="flex justify-between items-center p-2 border rounded"
                      >
                        <div>
                          <div className="font-semibold capitalize">{service.name}</div>
                          <div className="text-sm text-green-400">
                            Multiplier: {service.price_multiplier}x
                          </div>
                        </div>
                        <div className="space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openDialog('service', service)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete('service', service.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </SectionFade>

      {/* Receipt Dialog */}
      <Dialog open={!!selectedReceipt} onOpenChange={() => setSelectedReceipt(null)}>
        <DialogContent className="max-w-2xl bg-gray-600/80">
          <DialogHeader>
            <DialogTitle>Receipt Details</DialogTitle>
          </DialogHeader>
          {selectedReceipt && (
            <div className="space-y-4">
              <div className="text-center border-b pb-4">
                <h2 className="text-2xl font-bold">PAYMENT RECEIPT</h2>
                <p className="text-lg font-semibold">{selectedReceipt.receipt_number}</p>
                <p className="text-sm text-gray-300">
                  {new Date(selectedReceipt.generated_date).toLocaleString()}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-semibold">Customer:</p>
                  <p>{selectedReceipt.invoice_details?.customer_name}</p>
                </div>
                <div>
                  <p className="font-semibold">Order:</p>
                  <p>{selectedReceipt.invoice_details?.order_number}</p>
                </div>
                <div>
                  <p className="font-semibold">Payment Method:</p>
                  <p>{selectedReceipt.payment_details?.method}</p>
                </div>
                <div>
                  <p className="font-semibold">Amount Paid:</p>
                  <p className="text-lg font-bold text-green-500">
                    {formatCurrency(selectedReceipt.payment_details?.amount || 0)}
                  </p>
                </div>
                <div>
                  <p className="font-semibold">Balance Due:</p>
                  <p className="text-lg text-red-600">
                    {formatCurrency(selectedReceipt.invoice_details?.balance_due || 0)}
                  </p>
                </div>
                <div>
                  <p className="font-semibold">Status:</p>
                  <p className="capitalize">{selectedReceipt.invoice_details?.payment_status}</p>
                </div>
              </div>
              <Button onClick={printReceipt} className="w-full bg-green-600/30 cursor-pointer hover:bg-green-300/60">
                Print Receipt
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Order View Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden bg-gray-800/60">
          <DialogHeader className="border-b pb-3">
            <DialogTitle>Order Details</DialogTitle>
          </DialogHeader>

          {selectedOrder && (
            <div className="overflow-y-auto max-h-[75vh] pr-2 space-y-6">
              {/* Order Summary */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Order Number</p>
                  <p className="font-semibold">{selectedOrder.order_number}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className="capitalize font-semibold">{selectedOrder.status}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Customer</p>
                  <p>{selectedOrder.customer_name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Service</p>
                  <p className="capitalize">{selectedOrder.service_name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Washer</p>
                  <p className="font-semibold">
                    {selectedOrder.assigned_washer_name || 'Unassigned'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Ironer</p>
                  <p className="font-semibold">
                    {selectedOrder.assigned_ironer_name || 'Unassigned'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Created</p>
                  <p>{new Date(selectedOrder.created_at).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Amount</p>
                  <p className="font-bold text-green-500">
                    {formatCurrency(selectedOrder.total_amount)}
                  </p>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t pt-4" />

              {/* Order Items */}
              <div>
                <h3 className="font-semibold mb-3">Order Items</h3>
                <div className="space-y-2">
                  {selectedOrder.items?.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center border rounded p-3"
                    >
                      <div>
                        <p className="font-medium capitalize">
                          {item.garment_name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">
                          {formatCurrency(item.total_price || 0)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatCurrency(item.unit_price || 0)} each
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer Actions */}
              <div className="pt-4 border-t">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setSelectedOrder(null)}
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>



      {/* CRUD Dialog - will be completed in next part */}

      {/* CRUD Dialog */}
      <Dialog open={dialogOpen} onOpenChange={closeDialog}>
        <DialogContent className="max-w-md bg-gray-800/50">
          <DialogHeader>
            <DialogTitle>
              {editingItem ? 'Edit' : 'Add'} {dialogType}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            {dialogType === 'customer' && (
              <>
                <div className=''>
                    <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      name="name"
                      defaultValue={editingItem?.name}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      defaultValue={editingItem?.email}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      defaultValue={editingItem?.phone}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Textarea
                      id="address"
                      name="address"
                      defaultValue={editingItem?.address}
                      required
                    />
                  </div>
                </div>
              </>
            )}

            {dialogType === 'staff' && (
              <>
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    defaultValue={editingItem?.name}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="role">Role</Label>
                  <Select name="role" defaultValue={editingItem?.role || 'washer'}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="washer">Washer</SelectItem>
                      <SelectItem value="ironer">Ironer</SelectItem>
                      <SelectItem value="delivery">Delivery</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    defaultValue={editingItem?.phone}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="account_number">Account Number</Label>
                  <Input
                    id="account_number"
                    name="account_number"
                    defaultValue={editingItem?.account_number}
                  />
                </div>
              </>
            )}

            {dialogType === 'payment' && (
              <>
                <div>
                  <Label htmlFor="invoice">Invoice</Label>
                  <Select name="invoice" defaultValue={editingItem?.invoice?.toString()}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select invoice" />
                    </SelectTrigger>
                    <SelectContent>
                      {invoices.map((inv) => (
                        <SelectItem key={inv.id} value={inv.id.toString()}>
                          {inv.invoice_number} - {formatCurrency(inv.balance_due)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    id="amount"
                    name="amount"
                    type="number"
                    step="0.01"
                    defaultValue={editingItem?.amount}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="payment_method">Payment Method</Label>
                  <Select name="payment_method" defaultValue={editingItem?.payment_method || 'cash'}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="card">Card</SelectItem>
                      <SelectItem value="transfer">Transfer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="transaction_reference">Transaction Reference</Label>
                  <Input
                    id="transaction_reference"
                    name="transaction_reference"
                    defaultValue={editingItem?.transaction_reference}
                  />
                </div>
                <div>
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    defaultValue={editingItem?.notes}
                  />
                </div>
              </>
            )}
            {dialogType === 'garment' && (
              <>
                <div>
                  <Label htmlFor="name">Garment Type</Label>
                  <Select name="name" defaultValue={editingItem?.name || 'native_wear'}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="native_wear">Native Wears</SelectItem>
                      <SelectItem value="english_wear">English Wears</SelectItem>
                      <SelectItem value="bed_sheet">Bed Sheet</SelectItem>
                      <SelectItem value="agbada">Agbada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="base_price">Base Price (₦)</Label>
                  <Input
                    id="base_price"
                    name="base_price"
                    type="number"
                    step="0.01"
                    defaultValue={editingItem?.base_price}
                    required
                    placeholder="e.g., 1500.00"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    defaultValue={editingItem?.description}
                    placeholder="Optional description of this garment type"
                    rows={3}
                  />
                </div>
              </>
            )}

            {dialogType === 'service' && (
              <>
                <div>
                  <Label htmlFor="name">Service Type</Label>
                  <Select name="name" defaultValue={editingItem?.name || 'regular'}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="regular">Regular</SelectItem>
                      <SelectItem value="express">Express</SelectItem>
                    </SelectContent>
                  </Select>
                  {/* <Input
                    id="name"
                    name="name"
                    type="text"
                    step="0.1"
                    defaultValue={editingItem?.name || 'regular'}
                    required
                    placeholder="e.g., 1.0 for regular, 2.0 for express"
                  /> */}
                </div>
                <div>
                  <Label htmlFor="price_multiplier">Price Multiplier</Label>
                  <Input
                    id="price_multiplier"
                    name="price_multiplier"
                    type="number"
                    step="0.1"
                    defaultValue={editingItem?.price_multiplier || '1.0'}
                    required
                    placeholder="e.g., 1.0 for regular, 2.0 for express"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    1.0 = standard price, 2.0 = double price, etc.
                  </p>
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    defaultValue={editingItem?.description}
                    placeholder="Optional description of this service type"
                    rows={3}
                  />
                </div>
              </>
            )}
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={closeDialog}>
                Cancel
              </Button>
              <Button type="submit" className='bg-green-600'>Save</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
    </PageFade>
  );
}

function TableSearch({
  value,
  onChange,
  placeholder = 'Search...'
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="mb-4">
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}
