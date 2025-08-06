import { useEffect, useRef, useState } from "react";
import useUserStore from '../stores/userStore'
import usePostStore from "@/stores/postStore";

export const useCreatePost = () => {
    const user = useUserStore(state => state.user);
    const token = useUserStore(state => state.token);
    const [content, setcontent] = useState("");
    const [preview, setpreview] = useState(null);
    const [media, setmedia] = useState({
        image: null,
        video: null
    });
    const [loading, setloading] = useState(false);

    const handleMediaChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const fileType = file.type;

            // Clean up previous preview URL if it exists
            if (preview && preview.startsWith('blob:')) {
                URL.revokeObjectURL(preview);
            }

            if (fileType.startsWith("image/")) {
                setmedia({ image: file, video: null });

                const reader = new FileReader();
                reader.onload = () => {
                    setpreview(reader.result);
                };
                reader.readAsDataURL(file);
            } else if (fileType.startsWith("video/")) {
                setmedia({ image: null, video: file });

                const videoURL = URL.createObjectURL(file);
                setpreview(videoURL);
            }
        }
    };

    const resetToDefault = () => {
        setcontent("");
        // Clean up preview URL before resetting
        if (preview && preview.startsWith('blob:')) {
            URL.revokeObjectURL(preview);
        }
        setpreview(null);
        setmedia({
            image: null,
            video: null
        })
    };

    const textareaRef = useRef(null);
    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = `${textarea.scrollHeight}px`;
        }
    }, [content]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (preview && preview.startsWith('blob:')) {
                URL.revokeObjectURL(preview);
            }
        };
    }, [preview]);

    return {
        user,
        token,
        content,
        setcontent,
        preview,
        setpreview,
        media,
        setmedia,
        loading,
        setloading,
        handleMediaChange,
        textareaRef,
        resetToDefault
    }
};

export const useEditPost = () => {
    const token = useUserStore(state => state.token);
    const setEditPostId = usePostStore(state => state.setEditPostId);
    const [content, setcontent] = useState("");
    const [preview, setpreview] = useState(null);
    const [media, setmedia] = useState({
        image: null,
        video: null
    });
    const [removeMedia, setremoveMedia] = useState(false);
    const [loading, setloading] = useState(false);

    const handleRemoveMedia = () => {
        setpreview(null);
        setmedia({
            image: null,
            video: null,
        });
        setremoveMedia(true);
    };

    const handleMediaChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const fileType = file.type;

            // Clean up previous preview URL if it exists
            if (preview && preview.startsWith('blob:')) {
                URL.revokeObjectURL(preview);
            }

            if (fileType.startsWith("image/")) {
                setmedia({ image: file, video: null });

                const reader = new FileReader();
                reader.onload = () => {
                    setpreview(reader.result);
                };
                reader.readAsDataURL(file);
            } else if (fileType.startsWith("video/")) {
                setmedia({ image: null, video: file });

                const videoURL = URL.createObjectURL(file);
                setpreview(videoURL);
            }
        }
    };

    const textareaRef = useRef(null);
    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = `${textarea.scrollHeight}px`;
        }
    }, [content]);

    const initialLoad = (caption, image, video) => {
        setcontent(caption || "");
        setmedia({
            image: image || null,
            video: video || null
        });

        if (image) {
            setpreview(image);
        } else if (video) {
            setpreview(video);
        } else {
            setpreview(null);
        }
    };

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (preview && preview.startsWith('blob:')) {
                URL.revokeObjectURL(preview);
            }
        };
    }, [preview]);

    return {
        token,
        setEditPostId,
        content,
        setcontent,
        preview,
        media,
        textareaRef,
        handleMediaChange,
        initialLoad,
        removeMedia,
        setremoveMedia,
        handleRemoveMedia,
        loading,
        setloading
    }
};