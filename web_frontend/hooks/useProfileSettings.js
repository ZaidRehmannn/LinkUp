import { useState, useEffect } from 'react'
import useUserStore from '../stores/userStore'

export const useProfileForm = () => {
    const user = useUserStore(state => state.user);
    const setUser = useUserStore(state => state.setUser);
    const token = useUserStore(state => state.token);

    const [isUserReady, setIsUserReady] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        bio: "",
        image: null,
        followers: null,
        following: null,
        createdAt: null
    });

    const [successMessageDetails, setSuccessMessageDetails] = useState(null);
    const [errorMessageDetails, setErrorMessageDetails] = useState(null);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    };

    const formatAccountDate = (dateString) => {
        if (!dateString) return "Unknown";
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch (error) {
            return "Unknown";
        }
    };

    useEffect(() => {
        if (!user) return;

        setForm({
            firstName: user?.firstName || "",
            lastName: user?.lastName || "",
            username: user?.username || "",
            email: user?.email || "",
            bio: user?.bio ?? "No Bio Added",
            image: user?.profilePic ?? null,
            followers: user?.followers,
            following: user?.following,
            createdAt: user?.createdAt
        });

        setIsUserReady(true);
    }, [user]);

    return {
        token,
        setUser,
        isUserReady,
        isEditing,
        setIsEditing,
        form,
        setForm,
        successMessageDetails,
        setSuccessMessageDetails,
        errorMessageDetails,
        setErrorMessageDetails,
        handleChange,
        formatAccountDate
    };
};

export const useProfilePicture = () => {
    const [picturePreview, setPicturePreview] = useState(null);

    const [successMessagePicture, setSuccessMessagePicture] = useState(null);
    const [errorMessagePicture, setErrorMessagePicture] = useState(null);

    const handleFileChange = (e, form, setForm) => {
        const file = e.target.files[0];
        if (file) {
            setForm({ ...form, image: file })
            const reader = new FileReader();
            reader.onload = () => {
                setPicturePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return {
        picturePreview,
        setPicturePreview,
        successMessagePicture,
        setSuccessMessagePicture,
        errorMessagePicture,
        setErrorMessagePicture,
        handleFileChange
    };
};

export const usePasswordManagement = () => {
    const [showPasswordFields, setShowPasswordFields] = useState(false);
    const [passwords, setPasswords] = useState({
        oldPassword: "",
        newPassword: ""
    });

    const [passwordVisibility, setPasswordVisibility] = useState({
        oldPassword: false,
        newPassword: false
    });

    const [successMessagePassword, setSuccessMessagePassword] = useState(null);
    const [errorMessagePassword, setErrorMessagePassword] = useState(null);

    const handlePasswordChange = (e) => {
        setPasswords({ ...passwords, [e.target.name]: e.target.value })
    };

    const togglePasswordVisibility = (field) => {
        setPasswordVisibility((prev) => ({
            ...prev,
            [field]: !prev[field],
        }));
    };

    return {
        showPasswordFields,
        setShowPasswordFields,
        passwords,
        setPasswords,
        passwordVisibility,
        successMessagePassword,
        setSuccessMessagePassword,
        errorMessagePassword,
        setErrorMessagePassword,
        handlePasswordChange,
        togglePasswordVisibility
    };
};