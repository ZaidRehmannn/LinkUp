'use client'

import React from 'react'
import { useProfileForm, useProfilePicture, usePasswordManagement } from '@/hooks/useProfileSettings'
import { profileSettingsService } from '@/services/profileSettingsService'
import ProfilePictureSection from '@/components/profileSettings/ProfilePictureSection'
import ProfileDetailsSection from '@/components/profileSettings/ProfileDetailsSection'
import PasswordSection from '@/components/profileSettings/PasswordSection'

const Page = () => {
    const {
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
    } = useProfileForm();

    const {
        picturePreview,
        setPicturePreview,
        successMessagePicture,
        setSuccessMessagePicture,
        errorMessagePicture,
        setErrorMessagePicture,
        handleFileChange
    } = useProfilePicture();

    const {
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
    } = usePasswordManagement();

    const submitProfileDetails = async () => {
        setSuccessMessageDetails("");
        setErrorMessageDetails("");

        if (!form.firstName || !form.lastName || !form.username || !form.email) {
            setErrorMessageDetails("All fields are required except bio!");
            return;
        }

        try {
            const result = await profileSettingsService.updateProfileDetails({
                firstName: form.firstName,
                lastName: form.lastName,
                username: form.username,
                email: form.email,
                bio: form.bio,
            }, token);

            if (result.success) {
                const updatedUser = result.user;
                setUser(updatedUser);
                setForm({
                    firstName: updatedUser.firstName,
                    lastName: updatedUser.lastName,
                    username: updatedUser.username,
                    email: updatedUser.email,
                    bio: updatedUser.bio,
                });

                setSuccessMessageDetails(result.message);
                setIsEditing(false);
            } else {
                setErrorMessageDetails(result.message);
            }
        } catch (error) {
            console.error("Profile Details Error: ", error);
            setErrorMessageDetails("Something went wrong!");
        }
    };

    const submitProfilePicture = async () => {
        setSuccessMessagePicture("");
        setErrorMessagePicture("");

        if (form.image) {
            try {
                const result = await profileSettingsService.uploadProfilePicture(form.image, token);

                if (result.success) {
                    const updatedUser = result.user;
                    setUser(updatedUser);
                    setForm(prev => ({ ...prev, image: updatedUser.profilePic }));

                    setPicturePreview(null);
                    setSuccessMessagePicture(result.message);
                } else {
                    setErrorMessagePicture(result.message);
                }
            } catch (error) {
                console.error("Profile Picture Error: ", error.response?.data || error.message);
                setErrorMessagePicture(error.response?.data?.message || "Something went wrong!");
            }
        }
    };

    const handlePictureRemove = async () => {
        setSuccessMessagePicture("");
        setErrorMessagePicture("");

        try {
            const result = await profileSettingsService.removeProfilePicture(token);

            if (result.success) {
                const updatedUser = result.user;
                setUser(updatedUser);
                setForm(prev => ({ ...prev, image: null }));

                setSuccessMessagePicture(result.message);
            } else {
                setErrorMessagePicture(result.message);
            }
        } catch (error) {
            console.error("Profile Picture Error: ", error);
            setErrorMessagePicture("Something went wrong!");
        }
    };

    const submitNewPassword = async () => {
        setSuccessMessagePassword("");
        setErrorMessagePassword("");

        if (!passwords.oldPassword || !passwords.newPassword) {
            setErrorMessagePassword("All fields are required!");
            return;
        }

        try {
            const result = await profileSettingsService.changePassword({
                oldPassword: passwords.oldPassword,
                newPassword: passwords.newPassword
            }, token);

            if (result.success) {
                setSuccessMessagePassword(result.message);
                setShowPasswordFields(false);
                setPasswords({
                    oldPassword: "",
                    newPassword: ""
                });
            }
        } catch (error) {
            console.error("Change Password Error: ", error);

            if (error.response && error.response.data && error.response.data.message) {
                setErrorMessagePassword(error.response.data.message);
            } else {
                setErrorMessagePassword("Something went wrong!");
            }
        }
    };

    if (!isUserReady) {
        return (
            <main className="min-h-[calc(100vh-8rem)] flex justify-center items-center">
                <p className="text-blue-600 font-bold text-xl">Loading profile...</p>
            </main>
        );
    }

    return (
        <main className="px-6 md:px-20 py-10 pt-28 max-w-8xl mx-auto">
            <h1 className="text-4xl font-bold text-blue-600 mb-6">Profile Settings</h1>

            <div className="flex flex-col lg:flex-row gap-14">
                <ProfilePictureSection
                    form={form}
                    setForm={setForm}
                    picturePreview={picturePreview}
                    setPicturePreview={setPicturePreview}
                    handleFileChange={handleFileChange}
                    submitProfilePicture={submitProfilePicture}
                    handlePictureRemove={handlePictureRemove}
                    successMessagePicture={successMessagePicture}
                    errorMessagePicture={errorMessagePicture}
                />

                <div className="flex-1 space-y-6">
                    <ProfileDetailsSection
                        form={form}
                        isEditing={isEditing}
                        setIsEditing={setIsEditing}
                        handleChange={handleChange}
                        submitProfileDetails={submitProfileDetails}
                        successMessageDetails={successMessageDetails}
                        errorMessageDetails={errorMessageDetails}
                        formatAccountDate={formatAccountDate}
                    />

                    <PasswordSection
                        showPasswordFields={showPasswordFields}
                        setShowPasswordFields={setShowPasswordFields}
                        passwords={passwords}
                        passwordVisibility={passwordVisibility}
                        handlePasswordChange={handlePasswordChange}
                        togglePasswordVisibility={togglePasswordVisibility}
                        submitNewPassword={submitNewPassword}
                        successMessagePassword={successMessagePassword}
                        errorMessagePassword={errorMessagePassword}
                    />
                </div>
            </div>
        </main>
    )
}

export default Page