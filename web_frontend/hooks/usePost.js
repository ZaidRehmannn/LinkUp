import { useState } from "react";
import useUserStore from '../stores/userStore'

export const useCreatePost = () => {
    const user = useUserStore(state => state.user);
    const token = useUserStore(state => state.token);
    const [content, setcontent] = useState(null);
    const [preview, setpreview] = useState(null);
    const [media, setmedia] = useState({
        image: null,
        video: null
    });
    const [loading, setloading] = useState(false);
    const [successMessage, setsuccessMessage] = useState("");
    const [errorMessage, seterrorMessage] = useState("");

    const handleMediaChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const fileType = file.type;

            if (fileType.startsWith("image/")) {
                setmedia({ ...media, image: file })

                const reader = new FileReader();
                reader.onload = () => {
                    setpreview(reader.result);
                };
                reader.readAsDataURL(file);
            } else if (fileType.startsWith("video/")) {
                setmedia({ ...media, video: file })

                const videoURL = URL.createObjectURL(file);
                setpreview(videoURL);
            }
        }
    };

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
        successMessage,
        setsuccessMessage,
        errorMessage,
        seterrorMessage
    }
};