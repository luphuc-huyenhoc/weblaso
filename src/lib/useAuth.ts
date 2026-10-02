'use client';

import { useState, useEffect, useCallback } from 'react';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: 'USER' | 'ADMIN';
  isActive: boolean;
  subscription: {
    planType: string;
    status: string;
    endDate?: string;
  } | null;
  entitlements: string[];
}

export function useAuth() {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);

  const refreshAuth = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      if (data?.authenticated && data?.user) {
        setAuthenticated(true);
        setUser(data.user);
      } else {
        setAuthenticated(false);
        setUser(null);
      }
    } catch {
      setAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshAuth();
  }, [refreshAuth]);

  const isVip = Boolean(
    user?.role === 'ADMIN' ||
    user?.entitlements?.includes('advanced_interpretation') ||
    user?.subscription?.status === 'ACTIVE'
  );

  return { loading, authenticated, user, isVip, refreshAuth };
}
