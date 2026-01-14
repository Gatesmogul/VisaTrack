import { create } from "zustand";
import {getMyProfile, syncUser} from '../services/user.api';

type User = {
  id: string;
  email: string;
  onboardingCompleted: boolean;
};

type AuthState = {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  loadUser: () => Promise<void>;

};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  setUser: (user) => set({ user, loading: false }),

  loadUser: async () => {
      try {
        const user = await getMyProfile();
        set({ user, loading: false });
      } catch {
        set({ user: null, loading: false });
      }
    }
}));
