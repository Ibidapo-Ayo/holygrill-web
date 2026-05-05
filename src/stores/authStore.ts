import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { setCookie, deleteCookie } from '@/lib/cookies';
import { loginApi, signupApi } from '@/lib/api/auth';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string | null;
  role: 'customer' | 'admin';
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, phone?: string) => Promise<void>;
  setUser: (user: AuthUser | null) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

/** Derive user initials from a display name (up to 2 letters). */
export function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const { token, user } = await loginApi(email, password);
          setCookie('hg_token', token);
          set({ user: user as AuthUser, token, isAuthenticated: true });
        } finally {
          set({ isLoading: false });
        }
      },

      signup: async (name, email, password, phone) => {
        set({ isLoading: true });
        try {
          const { token, user } = await signupApi(name, email, password, phone);
          setCookie('hg_token', token);
          set({ user: user as AuthUser, token, isAuthenticated: true });
        } finally {
          set({ isLoading: false });
        }
      },

      setUser: (user) => set({ user, isAuthenticated: !!user }),

      logout: () => {
        deleteCookie('hg_token');
        set({ user: null, token: null, isAuthenticated: false });
      },

      setLoading: (isLoading) => set({ isLoading }),
    }),
    { name: 'holy-grills-auth' }
  )
);
