import { create } from 'zustand';

const usePostStore = create((set) => ({
    posts: [],
    editPostId: null,

    setPosts: (newPosts) => {
        set({ posts: newPosts });
    },

    // for load more posts button
    addPosts: (newPosts) => {
        set((state) => ({
            posts: [...state.posts, ...newPosts]
        }));
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
