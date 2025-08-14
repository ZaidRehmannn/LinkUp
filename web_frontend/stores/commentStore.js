import { create } from 'zustand';

const useCommentStore = create((set) => ({
    commentCounts: {},

    setCommentCount: (postId, count) => set((state) => ({
        commentCounts: {
            ...state.commentCounts,
            [postId]: count
        }
    })),

    incrementCommentCount: (postId) => set((state) => ({
        commentCounts: {
            ...state.commentCounts,
            [postId]: (state.commentCounts[postId] || 0) + 1
        }
    })),

    decrementCommentCount: (postId) => set((state) => ({
        commentCounts: {
            ...state.commentCounts,
            [postId]: Math.max((state.commentCounts[postId] || 0) - 1, 0)
        }
    })),

    clearCommentCounts: () => {
        set({ commentCounts: {} })
    }
}));

export default useCommentStore;