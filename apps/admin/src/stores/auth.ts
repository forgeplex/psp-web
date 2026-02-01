import { create } from 'zustand';
import type { UserProfile } from '@psp/api';

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  setUser: (user: UserProfile | null) => void;
  login: (user: UserProfile, accessToken: string, refreshToken: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: !!localStorage.getItem('psp_access_token'),

  setUser: (user) => set({ user, isAuthenticated: !!user }),

  login: (user, accessToken, refreshToken) => {
    localStorage.setItem('psp_access_token', accessToken);
    localStorage.setItem('psp_refresh_token', refreshToken);
    set({ user, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem('psp_access_token');
    localStorage.removeItem('psp_refresh_token');
    set({ user: null, isAuthenticated: false });
  },
}));
