import React from 'react'
import { EyeOff, Eye } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const PasswordSection = ({
    showPasswordFields,
    setShowPasswordFields,
    passwords,
    passwordVisibility,
    handlePasswordChange,
    togglePasswordVisibility,
    submitNewPassword,
    successMessagePassword,
    errorMessagePassword
}) => {
    return (
        <div className="space-y-4">
            {!showPasswordFields ? (
                <Button 
                    className="block bg-blue-600 hover:bg-blue-700 cursor-pointer text-white" 
                    onClick={() => setShowPasswordFields(true)}
                >
                    Change Password
                </Button>
            ) : (
                <div className="flex flex-col lg:flex-row lg:items-center gap-5 w-full">
                    <div className="flex items-center gap-2">
                        <span className='font-semibold text-nowrap'>Old Password: </span>
                        <div className="flex items-center bg-gray-100 dark:bg-gray-300 border border-gray-300 dark:border-gray-500 rounded-md focus-within:ring-2 focus-within:ring-blue-500">
                            <Input
                                type={passwordVisibility.oldPassword ? "text" : "password"}
                                name="oldPassword"
                                value={passwords.oldPassword}
                                onChange={handlePasswordChange}
                                placeholder="Old Password"
                                className="bg-gray-100 dark:bg-gray-300 dark:placeholder:text-gray-500 text-black border-none focus:ring-0 focus:outline-none focus-visible:ring-0"
                                required
                            />
                            {passwordVisibility.oldPassword ? (
                                <Eye 
                                    className='text-blue-600 cursor-pointer mr-2.5' 
                                    onClick={() => togglePasswordVisibility("oldPassword")} 
                                />
                            ) : (
                                <EyeOff 
                                    className="text-blue-600 cursor-pointer mr-2.5" 
                                    onClick={() => togglePasswordVisibility("oldPassword")} 
                                />
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className='font-semibold text-nowrap'>New Password: </span>
                        <div className="flex items-center bg-gray-100 dark:bg-gray-300 border border-gray-300 dark:border-gray-500 rounded-md focus-within:ring-2 focus-within:ring-blue-500">
                            <Input
                                type={passwordVisibility.newPassword ? "text" : "password"}
                                id="newPassword"
                                name="newPassword"
                                value={passwords.newPassword}
                                onChange={handlePasswordChange}
                                placeholder="New Password"
                                className="bg-gray-100 dark:bg-gray-300 dark:placeholder:text-gray-500 text-black border-none focus:ring-0 focus:outline-none focus-visible:ring-0"
                                required
                            />
                            {passwordVisibility.newPassword ? (
                                <Eye 
                                    className='text-blue-600 cursor-pointer mr-2.5' 
                                    onClick={() => togglePasswordVisibility("newPassword")} 
                                />
                            ) : (
                                <EyeOff 
                                    className="text-blue-600 cursor-pointer mr-2.5" 
                                    onClick={() => togglePasswordVisibility("newPassword")} 
                                />
                            )}
                        </div>
                    </div>
                </div>
            )}

            {successMessagePassword && (
                <p className='text-green-600 font-semibold'>{successMessagePassword}</p>
            )}
            {errorMessagePassword && (
                <p className='text-red-600 font-semibold'>{errorMessagePassword}</p>
            )}

            {showPasswordFields && (
                <div className='flex items-center gap-4'>
                    <Button 
                        className="block bg-green-600 hover:bg-green-700 text-white cursor-pointer" 
                        onClick={submitNewPassword}
                    >
                        Save New Password
                    </Button>

                    <Button 
                        className="bg-red-600 hover:bg-red-700 text-white cursor-pointer" 
                        onClick={() => setShowPasswordFields(false)}
                    >
                        Cancel
                    </Button>
                </div>
            )}
        </div>
    );
};

export default PasswordSection;