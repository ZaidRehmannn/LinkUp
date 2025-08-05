import { create } from "zustand";

const usePostStore = create((set) => ({
    editPostId: null,

    setEditPostId: (postId) => {
        set({ editPostId: postId })
    }
}))

export default usePostStore
