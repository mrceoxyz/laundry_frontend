'use client';

import { useState, useEffect } from 'react';
import { useRequireAuth } from '@/src/hooks/useRequireAuth';
import { useAuth } from '@/src/context/AuthContext';
import { Button } from '@/src/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/Card';
import { Input } from '@/src/components/ui/Input';
import { Label } from '@/src/components/ui/Label';
import { User, Mail, Phone, MapPin, Save } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user, updateUser, logout } = useAuth();
  useRequireAuth();

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        phone: user.profile?.phone || '',
        address: user.profile?.address || '',
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateUser(formData);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="container mx-auto p-6 max-w-2xl mt-15">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold mb-6 text-gray-100 dark:text-gray-100"
      >
        My Profile
      </motion.h1>

      {/* Account Info */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="mb-6 dark:bg-gray-300/30 border-0 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-100 dark:text-gray-100">Account Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-gray-500 dark:text-gray-600" />
              <div>
                <p className="text-sm text-gray-600 dark:text-green-400">Username</p>
                <p className="font-semibold text-gray-100 dark:text-gray-100">{user.username}</p>
              </div>
            </div>
            <div>
              <div
                className={`px-3 py-1 rounded-full text-sm inline-block ${
                  user.role === 'admin'
                    ? 'bg-green-100 text-green-800 dark:bg-green-700/30 dark:text-green-300'
                    : 'bg-green-100 text-green-800 dark:bg-green-700/30 dark:text-green-300'
                }`}
              >
                {user.role === 'admin' ? 'Administrator' : 'Customer'}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Edit Profile Form */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Card className="mb-6 dark:bg-gray-300/30 border-0 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-100 dark:text-gray-100">Edit Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first_name">First Name</Label>
                  <Input
                    id="first_name"
                    value={formData.first_name}
                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last_name">Last Name</Label>
                  <Input
                    id="last_name"
                    value={formData.last_name}
                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-green-500 dark:text-green-400" />
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-gray-500 dark:text-green-400" />
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    disabled={loading}
                  />
                </div>
              </div>

              {user.role === 'customer' && (
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <div className="flex items-start gap-2">
                    <MapPin className="h-5 w-5 text-gray-500 dark:text-green-400 mt-2" />
                    <textarea
                      id="address"
                      className="flex-1 p-2 rounded-md dark:bg-gray-300/20 border-0 dark:text-gray-100 dark:border-gray-600"
                      rows={3}
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      disabled={loading}
                    />
                  </div>
                </div>
              )}

              <Button type="submit" className="w-full cursor-pointer bg-green-500 flex items-center justify-center gap-2" disabled={loading}>
                <Save className="h-4 w-4" />
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      {/* Account Actions */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <Card className="dark:bg-gray-300/30 border-0 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-100 dark:text-gray-100">Account Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <Button variant="destructive" onClick={logout} className="w-full bg-blue-400 cursor-pointer">
              Logout
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
