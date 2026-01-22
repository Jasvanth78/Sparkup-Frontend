import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import { FaEye, FaEyeSlash } from 'react-icons/fa'

export default function Register() {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [isAdmin, setIsAdmin] = useState(false)
    const navigate = useNavigate()

    const apiBase = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, '')
    const api = `${apiBase}/api/${isAdmin ? 'admin' : 'users'}/register`

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const data = isAdmin ? { email, password } : { name, email, password }
            await axios.post(api, data)
            if (isAdmin) {
                toast.success("Admin registration successful! Please login.")
            } else {
                toast.success("Registered successfully! Admin will approve your account soon.")
            }
            navigate("/")
        } catch (error) {
            const errorMessage = error.response?.data?.error || error.response?.data?.message || "Registration failed"
            toast.error(errorMessage)
            setLoading(false)
        }
    }

    return (
        <div className="bg-white dark:bg-slate-950 min-h-screen transition-colors duration-300">
            <div className="lg:min-h-screen flex flex-col items-center justify-center p-6">
                <div className="grid lg:grid-cols-2 items-center gap-10 max-w-6xl max-lg:max-w-lg w-full">
                    <div>
                        <h1 className="lg:text-5xl text-4xl font-bold text-slate-900 dark:text-white !leading-tight transition-colors duration-300">
                            Join Sparkup and {isAdmin ? 'Lead' : 'Inspire'}
                        </h1>
                        <p className="text-[15px] mt-6 text-slate-600 dark:text-slate-400 leading-relaxed transition-colors duration-300">Create your account and start your journey with us. Whether you're an admin or a user, Sparkup empowers you.</p>
                        <p className="text-[15px] mt-6 lg:mt-12 text-slate-600 dark:text-slate-400 transition-colors duration-300">Already have an account? <Link to="/" className="text-blue-600 font-medium hover:underline ml-1">Login here</Link></p>
                    </div>

                    <form className="max-w-md lg:ml-auto w-full bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm dark:shadow-none border border-transparent dark:border-slate-800 transition-all duration-300" onSubmit={handleSubmit}>
                        <h2 className="text-slate-900 dark:text-white text-3xl font-semibold mb-8 transition-colors duration-300">
                            Create {isAdmin ? 'Admin' : 'User'} Account
                        </h2>

                        <div className="space-y-6">
                            <div>
                                <label className='text-sm text-slate-900 dark:text-slate-300 font-medium mb-2 block transition-colors duration-300'>Full Name</label>
                                <input name="name" type="text" required value={name} onChange={(e) => setName(e.target.value)} className="bg-slate-100 dark:bg-slate-800 w-full text-sm text-slate-900 dark:text-white px-4 py-3 rounded-md outline-0 border border-gray-200 dark:border-slate-700 focus:border-blue-600 focus:bg-transparent transition-all duration-300" placeholder="Enter Name" />
                            </div>
                            <div>
                                <label className='text-sm text-slate-900 dark:text-slate-300 font-medium mb-2 block transition-colors duration-300'>Email</label>
                                <input name="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="bg-slate-100 dark:bg-slate-800 w-full text-sm text-slate-900 dark:text-white px-4 py-3 rounded-md outline-0 border border-gray-200 dark:border-slate-700 focus:border-blue-600 focus:bg-transparent transition-all duration-300" placeholder="Enter Email" />
                            </div>
                            <div>
                                <label className='text-sm text-slate-900 dark:text-slate-300 font-medium mb-2 block transition-colors duration-300'>Password</label>
                                <div className="relative">
                                    <input
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="bg-slate-100 dark:bg-slate-800 w-full text-sm text-slate-900 dark:text-white px-4 py-3 rounded-md outline-0 border border-gray-200 dark:border-slate-700 focus:border-blue-600 focus:bg-transparent transition-all duration-300"
                                        placeholder="Enter Password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 dark:text-slate-500 dark:hover:text-blue-400 transition-colors"
                                    >
                                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                            </div>


                        </div>

                        <div className="!mt-12">
                            <button type="submit" disabled={loading} className="w-full shadow-xl py-2.5 px-4 text-[15px] font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none cursor-pointer disabled:opacity-50">
                                {loading ? 'Creating...' : 'Sign up'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
