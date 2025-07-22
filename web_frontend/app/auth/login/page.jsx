'use client'

import React, { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import axios from '@/lib/axios.js'
import Link from 'next/link'
import { EyeOff, Eye } from 'lucide-react'
import Loader from '@/components/loader/Loader'

const page = () => {
    const [form, setform] = useState({
        loginIdentifier: "",
        password: ""
    });

    const [loading, setloading] = useState(false);
    const [success, setsuccess] = useState(false);
    const [error, seterror] = useState("");
    const [passwordVisibility, setpasswordVisibility] = useState(false);

    const togglePasswordVisibility = () => {
        setpasswordVisibility(!passwordVisibility);
    };

    const handleChange = (e) => {
        setform({ ...form, [e.target.name]: e.target.value })
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setloading(true);
        setsuccess("");
        seterror("");

        try {
            await axios.post("/api/user/login", form);
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
            <form onSubmit={handleSubmit} className="w-full max-w-md space-y-5 shadow-xl rounded-2xl p-8 border">
                <h2 className="text-2xl font-semibold text-blue-700">Welcome Back!</h2>

                <div className='bg-gray-100 border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-blue-500'>
                    <Input
                        id="loginIdentifier"
                        name="loginIdentifier"
                        placeholder="Email or username"
                        value={form.loginIdentifier}
                        onChange={handleChange}
                        className="bg-gray-100 border-none focus:ring-0 focus:outline-none focus-visible:ring-0"
                        required
                    />
                </div>

                <div className="flex items-center bg-gray-100 border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-blue-500">
                    <Input
                        id="password"
                        name="password"
                        type={passwordVisibility ? "text" : "password"}
                        placeholder="Password"
                        value={form.password}
                        onChange={handleChange}
                        className="bg-gray-100 border-none focus:ring-0 focus:outline-none focus-visible:ring-0"
                        required
                    />
                    {passwordVisibility ? (
                        <Eye className='text-blue-600 cursor-pointer mr-2.5' onClick={togglePasswordVisibility} />
                    ) : (
                        <EyeOff className="text-blue-600 cursor-pointer mr-2.5" onClick={togglePasswordVisibility} />
                    )}
                </div>

                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white cursor-pointer" disabled={loading}>
                    {loading ? "Logging In..." : "Login"}
                </Button>

                {error && (
                    <p className="text-red-600 text-sm text-center font-semibold">{error}</p>
                )}
                {success && (
                    <Loader title="Logging In..." path="/feed" />
                )}

                <p className='text-xs text-gray-700'>
                    Don't have an account? <Link href="/auth/signup" className='text-blue-600 font-semibold cursor-pointer'>Click here to SignUp</Link>
                </p>
            </form>
        </main>
    )
}

export default page
