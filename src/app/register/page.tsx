/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { useAuth } from '@/src/context/AuthContext';
import { Button } from '@/src/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/Card';
import { Input } from '@/src/components/ui/Input';
import { Label } from '@/src/components/ui/Label';
import Link from 'next/link';
import { Loader2, Package } from 'lucide-react';
import { authAPI } from '@/src/lib/auth';
import logo from '@/src/img/logo.png';
import Image from 'next/image';

export default function RegisterPage() {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password2: '',
    first_name: '',
    last_name: '',
    role: 'customer' as 'customer' | 'admin',
    phone: '',
    address: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [emailAvailable, setEmailAvailable] = useState<boolean | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const checkUsername = async (username: string) => {
    if (username.length < 3) return;
    try {
      const exists = await authAPI.checkUsername(username);
      setUsernameAvailable(!exists);
    } catch (err) {
      console.error(err);
    }
  };

  const checkEmail = async (email: string) => {
    if (!email.includes('@')) return;
    try {
      const exists = await authAPI.checkEmail(email);
      setEmailAvailable(!exists);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.password2) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);
    try {
      await register(formData);
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 bg-linear-to-br from-indigo-500/10 via-purple-500/10 to-cyan-500/10 dark:from-indigo-500/20 dark:via-purple-500/20 dark:to-cyan-500/20" />

      <Card className="w-full max-w-2xl border-border/60 shadow-xl bg-white text-gray-900">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-xl">
            <Image src={logo} alt="Logo" width={200} height={200} />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">Create an Account</CardTitle>
          <p className="text-sm text-muted-foreground text-indigo-500">
            Register for our laundry service
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Error */}
            {error && (
              <div className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {error}
              </div>
            )}

            {/* Name fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first_name">First Name</Label>
                <Input
                  id="first_name"
                  name="first_name"
                  placeholder="John"
                  value={formData.first_name}
                  onChange={handleChange}
                  disabled={loading}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name">Last Name</Label>
                <Input
                  id="last_name"
                  name="last_name"
                  placeholder="Doe"
                  value={formData.last_name}
                  onChange={handleChange}
                  disabled={loading}
                  required
                />
              </div>
            </div>

            {/* Username */}
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                placeholder="johndoe"
                value={formData.username}
                onChange={(e) => {
                  handleChange(e);
                  checkUsername(e.target.value);
                }}
                disabled={loading}
                required
              />
              {usernameAvailable === false && (
                <p className="text-sm text-destructive">Username is already taken</p>
              )}
              {usernameAvailable === true && (
                <p className="text-sm text-green-500">Username is available</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={(e) => {
                  handleChange(e);
                  checkEmail(e.target.value);
                }}
                disabled={loading}
                required
              />
              {emailAvailable === false && (
                <p className="text-sm text-destructive">Email is already registered</p>
              )}
              {emailAvailable === true && (
                <p className="text-sm text-green-500">Email is available</p>
              )}
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="08012345678"
                value={formData.phone}
                onChange={handleChange}
                disabled={loading}
                required
              />
            </div>

            {/* Password */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Min. 8 characters"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={loading}
                  required
                  minLength={8}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password2">Confirm Password</Label>
                <Input
                  id="password2"
                  name="password2"
                  type="password"
                  placeholder="Re-enter password"
                  value={formData.password2}
                  onChange={handleChange}
                  disabled={loading}
                  required
                  minLength={8}
                />
              </div>
            </div>

            {/* Role selection */}
            <div className="space-y-2">
              <Label htmlFor="role">Account Type</Label>
              <select
                id="role"
                name="role"
                className="w-full p-2 border rounded-md dark:bg-background dark:text-foreground"
                value={formData.role}
                onChange={handleChange}
                disabled={loading}
              >
                <option value="customer">Customer</option>
                <option value="admin">Admin/Staff</option>
              </select>
            </div>

            {/* Address for customers */}
            {formData.role === 'customer' && (
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <textarea
                  id="address"
                  name="address"
                  className="w-full p-2 border rounded-md dark:bg-background dark:text-foreground"
                  rows={3}
                  placeholder="Your delivery address"
                  value={formData.address}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
            )}

            {/* Submit */}
            <Button type="submit" className="w-full bg-indigo-400 hover:bg-indigo-600 transition" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </Button>

            {/* Footer */}
            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link
                href="/login"
                className="font-medium text-indigo-500 hover:underline"
              >
                Login here
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
