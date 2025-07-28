import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export function usePageAuth(requiredPermission?: string) {
  const { isAuthenticated, loading, permissions } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [loading, isAuthenticated, router]);

  const hasPermission = requiredPermission ? permissions.includes(requiredPermission) : true;

  return {
    loading,
    isAuthenticated,
    hasPermission,
  };
} 