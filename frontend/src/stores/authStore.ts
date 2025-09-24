import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuth: (user: User, token: string, rememberMe?: boolean) => void;
  clearAuth: () => void;
  setLoading: (loading: boolean) => void;
  checkTokenExpiration: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      setAuth: (user: User, token: string, rememberMe: boolean = false) => {
        set({ user, token, isAuthenticated: true });
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(user));
          
          // Set expiration time based on remember me
          const expirationTime = rememberMe 
            ? Date.now() + (30 * 24 * 60 * 60 * 1000) // 30 days
            : Date.now() + (24 * 60 * 60 * 1000); // 24 hours
          
          localStorage.setItem('tokenExpiration', expirationTime.toString());
          localStorage.setItem('rememberMe', rememberMe.toString());
        }
      },
      clearAuth: () => {
        set({ user: null, token: null, isAuthenticated: false });
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          localStorage.removeItem('tokenExpiration');
          localStorage.removeItem('rememberMe');
        }
      },
      setLoading: (loading: boolean) => set({ isLoading: loading }),
      
      // Check if token is expired and clear auth if needed
      checkTokenExpiration: () => {
        if (typeof window !== 'undefined') {
          const expirationTime = localStorage.getItem('tokenExpiration');
          if (expirationTime && Date.now() > parseInt(expirationTime)) {
            get().clearAuth();
          }
        }
      },
    }),
    {
      name: 'wms-auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        // Check token expiration when the store is rehydrated
        if (state && typeof window !== 'undefined') {
          const expirationTime = localStorage.getItem('tokenExpiration');
          if (expirationTime && Date.now() > parseInt(expirationTime)) {
            state.clearAuth();
          }
        }
      },
    }
  )
);

