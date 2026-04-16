import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Role = 'patient' | 'doctor' | 'admin' | null;

interface AuthState {
  isAuthenticated: boolean;
  userRole: Role;
  login: (role: Role) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      userRole: null,
      login: (role) => set({ isAuthenticated: true, userRole: role }),
      logout: () => set({ isAuthenticated: false, userRole: null }),
    }),
    { name: 'auth-storage' }
  )
);
