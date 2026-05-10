import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';

export const useRequireAuth = (requiredRole?: 'admin' | 'customer') => {
  const { user, loading, isAuthenticated, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    } else if (!loading && requiredRole === 'admin' && !isAdmin) {
      router.push('/order');
    }
  }, [loading, isAuthenticated, isAdmin, requiredRole, router]);

  return { user, loading };
};