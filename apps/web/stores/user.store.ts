// User store - manages user profile and stats
import { create } from 'zustand';
import { User } from '@/services/supabase';

interface UserState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  updateUserStats: (stats: Partial<User>) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  isLoading: false,
  error: null,

  setUser: (user) => set({ user, error: null }),
  
  setLoading: (isLoading) => set({ isLoading }),
  
  setError: (error) => set({ error, isLoading: false }),
  
  updateUserStats: (stats) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...stats } : null,
    })),
  
  clearUser: () =>
    set({
      user: null,
      isLoading: false,
      error: null,
    }),
}));
