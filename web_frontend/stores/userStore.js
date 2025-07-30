import { create } from 'zustand'

const useUserStore = create((set) => ({
  user: null,
  token: null,
  loading: true,
  openMenu: false,

  setUser: (userData) => {
    set({ user: userData })
  },

  setToken: (userToken) => {
    set({ token: userToken })
    localStorage.setItem('token', userToken)
  },

  setLoading: (loading) => {
    set({ loading: loading })
  },

  toggleMenu: () => {
    set((state) => ({ openMenu: !state.openMenu }))
  },

  logout: () => {
    localStorage.removeItem('token')
    set({ user: null, token: null, openMenu: false })
  },
}))

export default useUserStore
