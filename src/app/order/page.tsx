/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, useEffect } from 'react';
import { useRequireAuth } from '@/src/hooks/useRequireAuth';
import { Button } from '@/src/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/Card';
import { Label } from '@/src/components/ui/Label';
import { Plus, Minus, ShoppingCart } from 'lucide-react';
import { garmentTypeAPI, serviceTypeAPI, orderAPI, customerAPI, staffAPI } from '@/src/lib/api';
import { GarmentType, ServiceType, OrderItem, Customer, Staff} from '@/src/types';
import { motion } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import { formatCurrency } from '@/src/lib/format';

export default function OrderPage() {
  const { user } = useRequireAuth();

  const [garmentTypes, setGarmentTypes] = useState<GarmentType[]>([]);
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedService, setSelectedService] = useState<number | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<number | null>(null);
  const [deliveryType, setDeliveryType] = useState<'pickup' | 'byself'>('byself');
  const [orderItems, setOrderItems] = useState<{ [key: number]: number }>({});
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [assignedStaff, setAssignedStaff] = useState<number | null>(null);


  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [garments, services, customersData, staffData] = await Promise.all([
        garmentTypeAPI.getAll(),
        serviceTypeAPI.getAll(),
        customerAPI.getAll(),
        staffAPI.getAll(), // 👈 new
      ]);

      setGarmentTypes(garments.data);
      setServiceTypes(services.data);
      setCustomers(customersData.data);
      setStaffList(staffData.data);

      if (user) {
        const loggedInCustomer = customersData.data.find(
          (c) => c.id === user.id || c.email === user.email
        );
        if (loggedInCustomer) setSelectedCustomer(loggedInCustomer.id);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };


  const updateQuantity = (garmentId: number, change: number) => {
    setOrderItems(prev => {
      const current = prev[garmentId] || 0;
      const newQuantity = Math.max(0, current + change);
      if (newQuantity === 0) {
        const { [garmentId]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [garmentId]: newQuantity };
    });
  };

  const calculateTotal = () => {
    const serviceMultiplier =
      parseFloat(serviceTypes.find(s => s.id === selectedService)?.price_multiplier || '1.0');
    let subtotal = 0;
    Object.entries(orderItems).forEach(([garmentId, quantity]) => {
      const garment = garmentTypes.find(g => g.id === parseInt(garmentId));
      if (garment) subtotal += garment.base_price * serviceMultiplier * quantity;
    });
    const deliveryFee = deliveryType === 'pickup' ? 500 : 0;
    return { subtotal, deliveryFee, total: subtotal + deliveryFee };
  };

  const showOrderSuccessToast = (orderId: string) => {
    toast.custom(() => (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        className="bg-gray-900 dark:bg-gray-900 border border-green-200 dark:border-green-700 shadow-lg rounded-lg p-4 max-w-md w-full"
      >
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-800">
            <ShoppingCart className="h-5 w-5 text-green-600 dark:text-green-300" />
          </div>

          <div className="flex-1">
            <p className="font-semibold text-gray-100 dark:text-gray-100">
              Order Placed Successfully
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Your order has been received and is being processed.
            </p>

            <div className="mt-2 text-sm">
              <span className="text-gray-500 dark:text-gray-400">Order ID:</span>{' '}
              <span className="font-mono font-semibold text-green-600 dark:text-green-400">
                #{orderId}
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    ), { duration: 5000 });
  };

  const handleSubmit = async () => {
    if (!selectedCustomer || !selectedService || Object.keys(orderItems).length === 0) {
      alert('Please fill all required fields');
      return;
    }
    setLoading(true);
    try {
      const items: OrderItem[] = Object.entries(orderItems).map(([garmentId, quantity]) => ({
        garment_type: parseInt(garmentId),
        quantity,
      }));
      const response = await orderAPI.create({
        customer: selectedCustomer,
        service_type: selectedService,
        delivery_type: deliveryType,
        notes,
        items,
      });

      const orderId = response.data.order_number;

      setShowSuccess(true);
      showOrderSuccessToast(orderId);

      setTimeout(() => {
        setOrderItems({});
        setNotes('');
        setShowSuccess(false);
      }, 3000);
    } catch (err) {
      console.error(err);
      toast('Error creating order');
    } finally {
      setLoading(false);
    }
  };

  const { subtotal, deliveryFee, total } = calculateTotal();

  return (
    <div className="container mx-auto p-6 max-w-6xl mt-16 ">
      <Toaster />
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold mb-6 text-gray-100 dark:text-gray-100"
      >
        Create Laundry Order
      </motion.h1>

      {/* {showSuccess && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 dark:bg-green-900 dark:text-green-300"
        >
          Order created successfully! Invoice generated automatically.
        </motion.div>
      )} */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 space-y-6"
        >
          {/* Customer Card */}
          {/* <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-gray-100 dark:text-gray-100">Customer Information</CardTitle>
            </CardHeader>
            <CardContent>
              <Label>Select Customer</Label>
              <select
                className="w-full mt-2 p-2 border rounded-md dark:bg-gray-700 dark:text-gray-100"
                value={selectedCustomer || ''}
                onChange={(e) => setSelectedCustomer(parseInt(e.target.value))}
              >
                <option value="">Choose a customer</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} - {c.email}
                  </option>
                ))}
              </select>
            </CardContent>
          </Card> */}

          {/* Service Card */}
          <Card className="border">
            <CardHeader>
              <CardTitle className="text-gray-100 dark:text-gray-100">Service Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Service Type</Label>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  {serviceTypes.map((service) => (
                    <button
                      key={service.id}
                      onClick={() => setSelectedService(service.id)}
                      className={`cursor-pointer p-4 border rounded-lg font-semibold text-sm capitalize transition-colors duration-200 ${
                        selectedService === service.id
                          ? 'border-green-500 bg-green-700/30 dark:bg-green-700/30 dark:border-green-400'
                          : 'border dark:bg-gray-300/30'
                      }`}
                    >
                      {service.name} ({service.name === 'express' ? '2x Price' : 'Standard'})
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label>Delivery Type</Label>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <button
                    onClick={() => setDeliveryType('byself')}
                    className={`p-4 border rounded-lg transition-colors ${
                      deliveryType === 'byself'
                        ? 'border-green-500 bg-green-700/30 dark:bg-green-700/30 dark:border-green-400'
                        : 'border dark:bg-gray-300/30'
                    }`}
                  >
                    Pick Up Myself (Free)
                  </button>
                  <button
                    onClick={() => setDeliveryType('pickup')}
                    className={`p-4 border rounded-lg transition-colors ${
                      deliveryType === 'pickup'
                        ? 'border-green-500 bg-green-700/30 dark:bg-green-700/30 dark:border-green-400'
                        : 'border dark:bg-gray-300/30'
                    }`}
                  >
                    Home Delivery (₦500)
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Garment selection */}
          <Card className="shadow-lg border">
            <CardHeader>
              <CardTitle className="text-gray-100 dark:text-gray-100">Select Garments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {garmentTypes.map((g) => (
                  <div
                    key={g.id}
                    className="flex items-center justify-between p-4 rounded-lg dark:border-gray-600 dark:bg-gray-300/10"
                  >
                    <div>
                      <div className="font-semibold capitalize text-gray-100 dark:text-gray-100">
                        {g.name.replace('_', ' ')}
                      </div>
                      <div className="text-sm text-green-400 dark:text-green-400">
                        {formatCurrency(g.base_price)} per item
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="icon" className='cursor-pointer' onClick={() => updateQuantity(g.id, -1)}>
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-12 text-center font-semibold text-gray-100 dark:text-gray-100">
                        {orderItems[g.id] || 0}
                      </span>
                      <Button variant="outline" className='cursor-pointer' size="icon" onClick={() => updateQuantity(g.id, 1)}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4">
                <Label>Order Notes (Optional)</Label>
                <textarea
                  className="w-full mt-2 p-2 border rounded-md dark:bg-gray-300/30 dark:text-gray-100 dark:border-gray-600"
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any special instructions..."
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Right section - Order summary */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Card className="sticky top-6 border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-100 dark:text-gray-100">
                <ShoppingCart className="h-5 w-5" />
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-100 dark:text-gray-100">
                  <span>Subtotal:</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-100 dark:text-gray-100">
                  <span>Delivery Fee:</span>
                  <span>{formatCurrency(deliveryFee)}</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-bold text-lg text-gray-100 dark:text-green-400">
                  <span>Total:</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>

              <Button
                className="w-full bg-green-600 dark:bg-green-600 dark:text-gray-100 cursor-pointer"
                onClick={handleSubmit}
                disabled={loading || Object.keys(orderItems).length === 0}
              >
                {loading ? 'Creating Order...' : 'Place Order'}
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
