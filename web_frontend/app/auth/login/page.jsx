'use client'

import React, { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import axios from '@/lib/axios.js'
import Link from 'next/link'
import { EyeOff, Eye } from 'lucide-react'
import Loader from '@/components/loader/Loader'
import useUserStore from '@/stores/userStore'

const page = () => {
    const [form, setform] = useState({
        loginIdentifier: "",
        password: ""
    });

    const [loading, setloading] = useState(false);
    const [success, setsuccess] = useState(false);
    const [error, seterror] = useState("");
    const [passwordVisibility, setpasswordVisibility] = useState(false);
    const setToken = useUserStore(state => state.setToken);
    const setUser = useUserStore(state => state.setUser);

    const togglePasswordVisibility = () => {
        setpasswordVisibility(!passwordVisibility);
    };

    const handleChange = (e) => {
        setform({ ...form, [e.target.name]: e.target.value })
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setloading(true);
        setsuccess(false);
        seterror("");

        try {
            const { data } = await axios.post("/api/user/login", form);
            setToken(data.token);
            setUser(data.user);
            setform({
                loginIdentifier: "",
                password: ""
            })
            setsuccess(true);
        } catch (error) {
            seterror(error.response?.data?.message || "Something went wrong");
        } finally {
            setloading(false);
        }
    };

    return (
        <main className="flex items-center justify-center px-4 py-20">
            <form onSubmit={handleSubmit} className="dark:bg-gray-900 w-full max-w-md space-y-5 shadow-xl rounded-2xl p-8 border">
                <h2 className="text-2xl font-semibold text-blue-700 dark:text-blue-500">Welcome Back!</h2>

                <div className='bg-gray-100 dark:bg-gray-300 border border-gray-300 dark:border-gray-500 rounded-md focus-within:ring-2 focus-within:ring-blue-500'>
                    <Input
                        id="loginIdentifier"
                        name="loginIdentifier"
                        placeholder="Email or username"
                        value={form.loginIdentifier}
                        onChange={handleChange}
                        className="bg-gray-100 dark:bg-gray-300 dark:placeholder:text-gray-500 border-none text-black focus:ring-0 focus:outline-none focus-visible:ring-0"
                        required
                    />
                </div>

                <div className="flex items-center bg-gray-100 dark:bg-gray-300 border border-gray-300 dark:border-gray-500 rounded-md focus-within:ring-2 focus-within:ring-blue-500">
                    <Input
                        id="password"
                        name="password"
                        type={passwordVisibility ? "text" : "password"}
                        placeholder="Password"
                        value={form.password}
                        onChange={handleChange}
                        className="bg-gray-100 dark:bg-gray-300 dark:placeholder:text-gray-500 border-none text-black focus:ring-0 focus:outline-none focus-visible:ring-0"
                        required
                    />
                    {passwordVisibility ? (
                        <Eye className='text-blue-600 cursor-pointer mr-2.5' onClick={togglePasswordVisibility} />
                    ) : (
                        <EyeOff className="text-blue-600 cursor-pointer mr-2.5" onClick={togglePasswordVisibility} />
                    )}
                </div>

                <Button type="submit" className="w-full bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white cursor-pointer" disabled={loading}>
                    {loading ? "Logging In..." : "Login"}
                </Button>

                {error && (
                    <p className="text-red-600 dark:text-red-500 text-sm text-center font-semibold">{error}</p>
                )}
                {success && (
                    <Loader title="Logging In..." path="/feed" />
                )}

                <p className='text-xs text-gray-700 dark:text-gray-300'>
                    Don't have an account? <Link href="/auth/signup" className='text-blue-600 dark:text-blue-500 font-semibold cursor-pointer'>Click here to SignUp</Link>
                </p>
            </form>
        </main>
    )
}

export default page
