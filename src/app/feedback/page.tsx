/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useState, useEffect } from 'react';
import { useRequireAuth } from '@/src/hooks/useRequireAuth';
import { Button } from '@/src/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/Card';
import { Label } from '@/src/components/ui/Label';
import { Star } from 'lucide-react';
import { feedbackAPI, orderAPI, customerAPI } from '@/src/lib/api';
import { Order, Customer } from '@/src/types';
import { motion } from 'framer-motion';
import { formatCurrency } from '@/src/lib/format';
import toast from 'react-hot-toast';

export default function FeedbackPage() {
  const { user } = useRequireAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<number | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<number | null>(null);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    loadCustomers();
  }, []);

  useEffect(() => {
    if (selectedCustomer) loadCustomerOrders(selectedCustomer);
  }, [selectedCustomer]);

  const loadCustomers = async () => {
    try {
      const customersData = await customerAPI.getAll();
      setCustomers(customersData.data);

      // Auto-select the logged-in customer
      if (user) {
        const currentCustomer = customersData.data.find(
          (c) => c.id === user.id || c.email === user.email
        );
        if (currentCustomer) setSelectedCustomer(currentCustomer.id);
      }
    } catch (error) {
      console.error('Error loading customers:', error);
    }
  };

  const loadCustomerOrders = async (customerId: number) => {
    try {
      const ordersData = await orderAPI.getAll();
      const customerOrders = ordersData.data.filter(
        (o) => o.customer === customerId && o.status === 'delivered'
      );
      setOrders(customerOrders);
    } catch (error) {
      console.error('Error loading orders:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer || !selectedOrder || rating === 0 || !comment.trim()) {
      alert('Please fill all fields');
      return;
    }

    setLoading(true);
    try {
      await feedbackAPI.create({
        customer: selectedCustomer,
        order: selectedOrder,
        rating,
        comment,
      });
      setShowSuccess(true);
      setRating(0);
      setComment('');
      setSelectedOrder(null);
      toast.success('Feedback submitted successfully');
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast.error('Error submitting feedback');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-2xl mt-15">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold mb-6 text-gray-100 dark:text-gray-100"
      >
        Submit Feedback
      </motion.h1>

      {showSuccess && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 dark:bg-green-900 dark:text-green-300"
        >
          Thank you for your feedback! We appreciate your input.
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="dark:bg-gray-300/30 border-0">
          <CardHeader>
            <CardTitle className="text-gray-100 dark:text-gray-100">Rate Your Experience</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Customer Selector */}
              <div>
                <Label>Select Customer</Label>
                <select
                  className="w-full mt-2 p-2 border rounded-md dark:bg-gray-300/30 dark:text-gray-100 dark:border-gray-600"
                  value={selectedCustomer || ''}
                  onChange={(e) => {
                    setSelectedCustomer(parseInt(e.target.value));
                    setSelectedOrder(null);
                  }}
                  required
                >
                  <option value="">Choose a customer</option>
                  {customers.map((c) => (
                    <option className='text-gray-800' key={c.id} value={c.id}>
                      {c.name} - {c.email}
                    </option>
                  ))}
                </select>
              </div>

              {/* Order Selector */}
              {selectedCustomer && (
                <div>
                  <Label>Select Completed Order</Label>
                  <select
                    className="w-full mt-2 p-2 border rounded-md dark:bg-gray-300/30 dark:text-gray-500 dark:border-gray-600"
                    value={selectedOrder || ''}
                    onChange={(e) => setSelectedOrder(parseInt(e.target.value))}
                    required
                  >
                    <option value="">Choose an order</option>
                    {orders.length === 0 ? (
                      <option disabled>No completed orders available</option>
                    ) : (
                      orders.map((o) => (
                        <option className='text-gray-800' key={o.id} value={o.id}>
                          {o.order_number} - {formatCurrency(o.total_amount)} (
                          {new Date(o.created_at).toLocaleDateString()})
                        </option>
                      ))
                    )}
                  </select>
                  {orders.length === 0 && (
                    <p className="text-sm text-gray-300 mt-1">
                      This customer has no completed orders yet.
                    </p>
                  )}
                </div>
              )}

              {/* Rating Stars */}
              <div>
                <Label>Rating</Label>
                <div className="flex gap-2 mt-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        className={`h-10 w-10 ${
                          star <= (hoveredRating || rating)
                            ? 'fill-green-400 text-green-400'
                            : 'text-gray-300 dark:text-gray-600'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                {rating > 0 && (
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                    {rating === 1 && "Poor - We're sorry to hear that"}
                    {rating === 2 && 'Fair - We can do better'}
                    {rating === 3 && 'Good - Thank you!'}
                    {rating === 4 && "Very Good - We're glad you're satisfied"}
                    {rating === 5 && 'Excellent - Thank you for the amazing feedback!'}
                  </p>
                )}
              </div>

              {/* Comment Box */}
              <div>
                <Label>Your Comments</Label>
                <textarea
                  className="w-full mt-2 p-3 border rounded-md dark:bg-gray-300/30 dark:text-gray-100 dark:border-gray-600"
                  rows={6}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Tell us about your experience with our laundry service..."
                  required
                />
                <p className="text-sm text-gray-300 dark:text-gray-300 mt-1">{comment.length}/500 characters</p>
              </div>

              <Button type="submit" className="w-full bg-green-500" disabled={loading}>
                {loading ? 'Submitting...' : 'Submit Feedback'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      {/* Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Card className="mt-6 dark:bg-gray-300/30 border-0">
          <CardHeader>
            <CardTitle className="text-gray-100 dark:text-gray-100">Why Your Feedback Matters</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-gray-700 dark:text-gray-300">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">•</span>
                Helps us improve our service quality
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">•</span>
                Enables us to recognize outstanding staff members
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">•</span>
                Guides our business decisions and improvements
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">•</span>
                Shows us what were doing right
              </li>
            </ul>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
