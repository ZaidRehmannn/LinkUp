import { create } from 'zustand';

const usePostStore = create((set) => ({
    posts: [],
    editPostId: null,

    setPosts: (newPosts) => {
        set((state) => ({ posts: [...newPosts, ...state.posts] }))
    },

    addPost: (post) => {
        set((state) => ({ posts: [post, ...state.posts] }))
    },

    removePost: (postId) => {
        set((state) => ({ posts: state.posts.filter(p => p._id !== postId) }))
    },

    updatePost: (updatedPost) => {
        set((state) => ({ posts: state.posts.map(p => p._id === updatedPost._id ? updatedPost : p) }))
    },

    setEditPostId: (postId) => {
        set({ editPostId: postId })
    }
}));

export default usePostStore;
