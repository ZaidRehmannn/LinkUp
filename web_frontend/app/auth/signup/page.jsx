'use client'

import React, { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import axios from '@/lib/axios.js'
import Link from 'next/link'

const page = () => {
    const [form, setform] = useState({
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        password: ""
    });

    const [loading, setloading] = useState(false);
    const [success, setsuccess] = useState("");
    const [error, seterror] = useState("");

    const handleChange = (e) => {
        setform({ ...form, [e.target.name]: e.target.value })
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setloading(true);
        setsuccess("");
        seterror("");

        try {
            const { data } = await axios.post("/api/user/register", form);
            setsuccess(data.message);
            setform({
                firstName: "",
                lastName: "",
                username: "",
                email: "",
                password: ""
            })
        } catch (error) {
            seterror(error.response?.data?.message || "Something went wrong");
        } finally {
            setloading(false);
        }
    };

    return (
        <main className="flex items-center justify-center px-4 py-8">
            <form onSubmit={handleSubmit} className="w-full max-w-md space-y-5 shadow-xl rounded-2xl p-8 border">
                <h2 className="text-2xl font-semibold text-blue-700">Create Account</h2>

                <div className="flex gap-4">
                    <div className="flex-1">
                        <Input id="firstName" name="firstName" placeholder="First Name" value={form.firstName} onChange={handleChange} className="bg-gray-100" required />
                    </div>
                    <div className="flex-1">
                        <Input id="lastName" name="lastName" placeholder="Last Name" value={form.lastName} onChange={handleChange} className="bg-gray-100" required />
                    </div>
                </div>

                <Input id="username" name="username" placeholder="Username" value={form.username} onChange={handleChange} className="bg-gray-100" required />

                <Input id="email" name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} className="bg-gray-100" required />

                <Input id="password" name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} className="bg-gray-100" required />

                <Input id="confirmPassword" name="confirmPassword" type="password" placeholder="Confirm Password" value={form.password} onChange={handleChange} className="bg-gray-100" required />

                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white cursor-pointer" disabled={loading}>
                    {loading ? "Creating..." : "Sign Up"}
                </Button>

                {error && (
                    <p className="text-red-600 text-sm text-center">{error}</p>
                )}
                {success && (
                    <p className="text-green-600 text-sm text-center">{success}</p>
                )}

                <p className='text-xs text-gray-700'>
                    Already have an account? <Link href="/auth/login" className='text-blue-600 font-semibold cursor-pointer'>Click here to Login</Link>
                </p>
            </form>
        </main>
    )
}

export default page
