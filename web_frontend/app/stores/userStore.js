import { create } from 'zustand'

const useUserStore = create((set) => ({
  user: null,
  token: null,

  setUser: (userData) => {
    set({ user: userData })
  },

  setToken: (userToken) => {
    set({ token: userToken })
    localStorage.setItem('token', userToken)
  },
}))

export default useUserStore
