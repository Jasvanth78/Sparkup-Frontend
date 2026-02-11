import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { API_BASE_URL } from '../api/config'

export default function AdminLogin() {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const navigate = useNavigate()

    const savedToken = (newToken) => {
        localStorage.setItem("token", newToken)
    }

    const api = `${API_BASE_URL}/api/admin/login`

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError("")
        try {
            const response = await axios.post(api, { email, password })
            savedToken(response.data.token)
            localStorage.setItem("user", JSON.stringify({ email: response.data.email, id: response.data.adminId, role: 'ADMIN' }))
            localStorage.setItem("role", "ADMIN")
            toast.success("Admin Login successful")
            navigate("/AdminDashboard")
        } catch (error) {
            const errorMessage = error.response?.data?.error || error.response?.data?.message || "Something went wrong";
            setError(errorMessage)
            setLoading(false)
            toast.error(errorMessage)
        }
    }

    return (
        <div className="bg-white dark:bg-slate-950 transition-colors duration-300">
            <div className="lg:min-h-screen flex flex-col items-center justify-center p-6">
                <div className="grid lg:grid-cols-2 items-center gap-10 max-w-6xl max-lg:max-w-lg w-full">
                    <div>
                        <h1 className="lg:text-5xl text-4xl font-bold text-slate-900 dark:text-white !leading-tight transition-colors duration-300">
                            Welcome to Admin Portal
                        </h1>
                        <p className="text-[15px] mt-6 text-slate-600 dark:text-slate-400 leading-relaxed transition-colors duration-300">Secure access for platform administration. Manage users, content, and system settings efficiently.</p>
                    </div>

                    <form className="max-w-md lg:ml-auto w-full bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm dark:shadow-none border border-transparent dark:border-slate-800 transition-all duration-300" onSubmit={handleSubmit}>
                        <h2 className="text-slate-900 dark:text-white text-3xl font-semibold mb-8 transition-colors duration-300">
                            Admin Sign in
                        </h2>

                        <div className="space-y-6">
                            <div>
                                <label className='text-sm text-slate-900 dark:text-slate-300 font-medium mb-2 block transition-colors duration-300'>Email</label>
                                <input name="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="bg-slate-100 dark:bg-slate-800 w-full text-sm text-slate-900 dark:text-white px-4 py-3 rounded-md outline-0 border border-gray-200 dark:border-slate-700 focus:border-blue-600 focus:bg-transparent transition-all duration-300" placeholder="Enter Admin Email" />
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
                            <button type="submit" disabled={loading} className="w-full shadow-xl py-2.5 px-4 text-[15px] font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed">
                                {loading ? 'Logging in...' : 'Log in as Admin'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            {error && <p className="text-red-500 text-center mt-4">{error}</p>}
        </div>
    )
}
