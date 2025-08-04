import { create } from "zustand";

const usePostStore = create((set) => ({
    editPost: false,

    setEditPost: (value) => {
        set({ editPost: value })
    }
}))

export default usePostStore
