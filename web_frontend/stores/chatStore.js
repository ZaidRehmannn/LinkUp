import { create } from "zustand";

const useChatStore = create((set) => ({
    openChat_Users: [],
    minimizedChat_Users: [],

    toggleChat: (chat_User) => set((state) => {
        const isOpen = state.openChat_Users.find(user => user._id === chat_User._id);
        const isMinimized = state.minimizedChat_Users.find(user => user._id === chat_User._id);

        // if open then minimize it
        if (isOpen) {
            return {
                openChat_Users: state.openChat_Users.filter(user => user._id !== chat_User._id),
                minimizedChat_Users: [...state.minimizedChat_Users, chat_User]
            };
        }

        // if minimize then open it
        if (isMinimized) {
            return {
                minimizedChat_Users: state.minimizedChat_Users.filter(user => user._id !== chat_User._id),
                openChat_Users: [...state.openChat_Users, chat_User]
            };
        }

        // If neither open nor minimized, open a new chat window
        return {
            openChat_Users: [...state.openChat_Users, chat_User],
            minimizedChat_Users: state.minimizedChat_Users.filter(user => user._id !== chat_User._id)
        };
    }),

    closeChat: (chat_User) => set((state) => ({
        openChat_Users: state.openChat_Users.filter(user => user._id !== chat_User._id),
        minimizedChat_Users: state.minimizedChat_Users.filter(user => user._id !== chat_User._id)
    }))
}));

export default useChatStore;
