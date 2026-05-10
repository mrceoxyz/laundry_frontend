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
import Image from 'next/image';
import logo from '@/src/img/logo.png';

export default function LoginPage() {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(username, password);
    } catch (err: any) {
      setError(err.message || 'Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 bg-linear-to-br from-indigo-500/10 via-purple-500/10 to-cyan-500/10 dark:from-indigo-500/20 dark:via-purple-500/20 dark:to-cyan-500/20" />

      <Card className="w-full max-w-md border-none shadow-lg bg-white text-gray-900">
        <CardHeader className="space-y-1 text-center">
          {/* Brand */}
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-xl">
            <Image src={logo} alt="Logo" width={200} height={200} />
          </div>

          <CardTitle className="text-2xl font-bold tracking-tight">
            Welcome back
          </CardTitle>
          <p className="text-sm text-muted-foreground text-indigo-500">
            Sign in to manage your laundry orders
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

            {/* Username */}
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
                required
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
              />
            </div>

            {/* Submit */}
            <Button type="submit" variant='secondary' className="w-full bg-indigo-400 hover:bg-indigo-600 transition" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </Button>

            {/* Footer */}
            <p className="text-center text-sm text-muted-foreground">
              Don’t have an account?{' '}
              <Link
                href="/register"
                className="font-medium text-indigo-500 hover:underline"
              >
                Create one
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
