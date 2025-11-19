/**
 * Authentication Store
 * Manages user authentication state using Zustand
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  username: string;
  nuid: string;
  role: 'ADMIN' | 'STAFF';
  name: string;
  nickname?: string;
  position?: string;
  email: string;
  phone?: string;
  shift?: string;
  department: string;
  permissions: string[];
  requirePasswordReset: boolean;
  firstLogin: boolean;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  requirePasswordReset: boolean;
  
  // Actions
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  checkAuth: () => Promise<void>;
}

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      requirePasswordReset: false,

      login: async (username: string, password: string) => {
        set({ isLoading: true });
        
        try {
          const response = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Login failed');
          }

          const data = await response.json();
          
          set({
            user: data.user,
            token: data.token,
            isAuthenticated: true,
            requirePasswordReset: data.requirePasswordReset || data.user.requirePasswordReset,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: async () => {
        const { token } = get();
        
        try {
          if (token) {
            await fetch(`${API_BASE}/auth/logout`, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            });
          }
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            requirePasswordReset: false,
          });
        }
      },

      changePassword: async (currentPassword: string, newPassword: string) => {
        const { token } = get();
        
        if (!token) {
          throw new Error('Not authenticated');
        }

        const response = await fetch(`${API_BASE}/auth/change-password`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ currentPassword, newPassword }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || 'Password change failed');
        }

        const data = await response.json();
        
        // Update user state to remove password reset requirement
        set((state) => ({
          requirePasswordReset: false,
          user: state.user ? {
            ...state.user,
            requirePasswordReset: false,
            firstLogin: false,
          } : null,
        }));

        return data;
      },

      setUser: (user: User | null) => {
        set({ user, isAuthenticated: !!user });
      },

      setToken: (token: string | null) => {
        set({ token });
      },

      checkAuth: async () => {
        const { token } = get();
        
        if (!token) {
          set({ isAuthenticated: false, user: null });
          return;
        }

        try {
          const response = await fetch(`${API_BASE}/auth/verify`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            throw new Error('Invalid token');
          }

          const data = await response.json();
          
          set({
            isAuthenticated: data.valid,
            user: data.user,
          });
        } catch (error) {
          set({
            isAuthenticated: false,
            user: null,
            token: null,
          });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
