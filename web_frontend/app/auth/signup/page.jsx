'use client'

import React, { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import axios from '@/lib/axios.js'
import Link from 'next/link'
import { EyeOff, Eye } from 'lucide-react'
import Loader from '@/components/loader/Loader'

const page = () => {
    const token = localStorage.getItem('token');
    const [form, setform] = useState({
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const [loading, setloading] = useState(false);
    const [success, setsuccess] = useState("");
    const [error, seterror] = useState("");
    const [passwordVisibility, setpasswordVisibility] = useState({
        password: false,
        confirmPassword: false
    });

    const togglePasswordVisibility = (field) => {
        setpasswordVisibility((prev) => ({
            ...prev,
            [field]: !prev[field],
        }));
    };

    const handleChange = (e) => {
        setform({ ...form, [e.target.name]: e.target.value })
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setloading(true);
        setsuccess("");
        seterror("");

        if (form.password !== form.confirmPassword) {
            seterror("Passwords do not match!");
            setloading(false);
            return;
        }

        try {
            const payload = { ...form };
            delete payload.confirmPassword;

            const { data } = await axios.post("/api/user/register", payload);
            setsuccess(data.message);
            setform({
                firstName: "",
                lastName: "",
                username: "",
                email: "",
                password: "",
                confirmPassword: ""
            })
        } catch (error) {
            seterror(error.response?.data?.message || "Something went wrong");
        } finally {
            setloading(false);
        }
    };

    if (token) {
        return null;
    }

    return (
        <main className="flex items-center justify-center px-4 py-24">
            <form onSubmit={handleSubmit} className="dark:bg-gray-900 w-full max-w-md space-y-4 shadow-xl rounded-2xl p-6 border">
                <h2 className="text-2xl font-semibold text-blue-700 dark:text-blue-500">Create Account</h2>

                <div className="flex gap-4">
                    <div className="flex-1 bg-gray-100 dark:bg-gray-300 border border-gray-300 dark:border-gray-500 rounded-md focus-within:ring-2 focus-within:ring-blue-500">
                        <Input
                            id="firstName"
                            name="firstName"
                            placeholder="First Name"
                            value={form.firstName}
                            onChange={handleChange}
                            className="bg-gray-100 dark:bg-gray-300 dark:placeholder:text-gray-500 text-black border-none focus:ring-0 focus:outline-none focus-visible:ring-0"
                            required
                        />
                    </div>
                    <div className="flex-1 bg-gray-100 dark:bg-gray-300 border border-gray-300 dark:border-gray-500 rounded-md focus-within:ring-2 focus-within:ring-blue-500">
                        <Input
                            id="lastName"
                            name="lastName"
                            placeholder="Last Name"
                            value={form.lastName}
                            onChange={handleChange}
                            className="bg-gray-100 dark:bg-gray-300 dark:placeholder:text-gray-500 text-black border-none focus:ring-0 focus:outline-none focus-visible:ring-0"
                            required
                        />
                    </div>
                </div>

                <div className='bg-gray-100 dark:bg-gray-300 border border-gray-300 dark:border-gray-500 rounded-md focus-within:ring-2 focus-within:ring-blue-500'>
                    <Input
                        id="username"
                        name="username"
                        placeholder="Username"
                        value={form.username}
                        onChange={handleChange}
                        className="bg-gray-100 dark:bg-gray-300 dark:placeholder:text-gray-500 text-black border-none focus:ring-0 focus:outline-none focus-visible:ring-0"
                        required
                    />
                </div>

                <div className='bg-gray-100 dark:bg-gray-300 border border-gray-300 dark:border-gray-500 rounded-md focus-within:ring-2 focus-within:ring-blue-500'>
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={handleChange}
                        className="bg-gray-100 dark:bg-gray-300 dark:placeholder:text-gray-500 text-black border-none focus:ring-0 focus:outline-none focus-visible:ring-0"
                        required
                    />
                </div>

                <div className="flex items-center bg-gray-100 dark:bg-gray-300 border border-gray-300 dark:border-gray-500 rounded-md focus-within:ring-2 focus-within:ring-blue-500">
                    <Input
                        id="password"
                        name="password"
                        type={passwordVisibility.password ? "text" : "password"}
                        placeholder="Password"
                        value={form.password}
                        onChange={handleChange}
                        className="bg-gray-100 dark:bg-gray-300 dark:placeholder:text-gray-500 text-black border-none focus:ring-0 focus:outline-none focus-visible:ring-0"
                        required
                    />
                    {passwordVisibility.password ? (
                        <Eye className='text-blue-600 cursor-pointer mr-2.5' onClick={() => togglePasswordVisibility("password")} />
                    ) : (
                        <EyeOff className="text-blue-600 cursor-pointer mr-2.5" onClick={() => togglePasswordVisibility("password")} />
                    )}
                </div>

                <div className="flex items-center bg-gray-100 dark:bg-gray-300 border border-gray-300 dark:border-gray-500 rounded-md focus-within:ring-2 focus-within:ring-blue-500">
                    <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={passwordVisibility.confirmPassword ? "text" : "password"}
                        placeholder="Confirm Password"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        className="bg-gray-100 dark:bg-gray-300 dark:placeholder:text-gray-500 text-black border-none focus:ring-0 focus:outline-none focus-visible:ring-0"
                        required
                    />
                    {passwordVisibility.confirmPassword ? (
                        <Eye className='text-blue-600 dark:text-blue-500 cursor-pointer mr-2.5' onClick={() => togglePasswordVisibility("confirmPassword")} />
                    ) : (
                        <EyeOff className="text-blue-600 dark:text-blue-500 cursor-pointer mr-2.5" onClick={() => togglePasswordVisibility("confirmPassword")} />
                    )}
                </div>

                <Button type="submit" className="w-full bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white cursor-pointer" disabled={loading}>
                    {loading ? "Creating..." : "Sign Up"}
                </Button>

                {error && (
                    <p className="text-red-600 dark:text-red-500 text-sm text-center font-semibold">{error}</p>
                )}
                {success && (
                    <>
                        <p className="text-green-600 dark:text-green-500 text-sm text-center font-semibold">{success}</p>
                        <Loader title="Redirecting to Login..." path="/auth/login" />
                    </>
                )}

                <p className='text-xs text-gray-700 dark:text-gray-300'>
                    Already have an account? <Link href="/auth/login" className='text-blue-600 dark:text-blue-500 font-semibold cursor-pointer'>Click here to Login</Link>
                </p>
            </form>
        </main>
    )
}

export default page
