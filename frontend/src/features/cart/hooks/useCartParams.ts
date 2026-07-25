import { useEffect, useMemo } from 'react';
import { useAuthStore } from '@/features/auth';

const GUEST_ID_KEY = 'guestId';

function generateId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function useCartParams(): { userId?: string; guestId?: string } {
  const { user } = useAuthStore();

  useEffect(() => {
    if (!user && !localStorage.getItem(GUEST_ID_KEY)) {
      localStorage.setItem(GUEST_ID_KEY, generateId());
    }
  }, [user]);

  return useMemo(() => {
    if (user?._id) {
      return { userId: user._id };
    }
    const guestId = localStorage.getItem(GUEST_ID_KEY) || generateId();
    return { guestId };
  }, [user]);
}
