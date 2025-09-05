import { create } from 'zustand';
import axios from '@/lib/axios';

const useUserStore = create((set) => ({
  user: null,
  token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
  loading: true,
  openMenu: false,

  setUser: (userData) => set({ user: userData }),

  setToken: (userToken) => {
    localStorage.setItem('token', userToken);
    set({ token: userToken });
  },

  setLoading: (loading) => set({ loading }),

  toggleMenu: () => set((state) => ({ openMenu: !state.openMenu })),
  
  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null, openMenu: false });
  },

  initAuth: async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      set({ user: null, token: null, loading: false });
      return;
    }

    try {
      const { data } = await axios.get('/api/profile/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      set({ user: data.user, token, loading: false });
    } catch (error) {
      console.error('Auth failed:', error.response?.data?.message);
      localStorage.removeItem('token');
      set({ user: null, token: null, loading: false });
    }
  },
}));

export default useUserStore;
