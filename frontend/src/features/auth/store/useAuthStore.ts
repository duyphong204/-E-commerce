import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthUser } from '../schemas/auth.schema';

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  setAuth: (user: AuthUser, token?: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      setAuth: (user, token) => {
        if (token) {
          localStorage.setItem('userToken', token);
        }
        localStorage.setItem('userInfo', JSON.stringify(user));
        set({ user, token: token || localStorage.getItem('userToken') });
      },
      logout: () => {
        localStorage.removeItem('userToken');
        localStorage.removeItem('userInfo');
        set({ user: null, token: null });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
