import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Navbar from './navbar';

const Dashboard = () => {
    const [stats, setStats] = useState({ likesRecived: 0, commentsMade: 0, postsAuthored: 0 });
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const role = localStorage.getItem('role');

                const statsEndpoint = role === 'ADMIN' ? 'api/admin/stats' : 'api/users/stats';
                const userEndpoint = role === 'ADMIN' ? 'api/admin/me' : 'api/users/me';

                const [statsRes, userRes] = await Promise.all([
                    axios.get(`${import.meta.env.VITE_API_BASE_URL}${statsEndpoint}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    }),
                    axios.get(`${import.meta.env.VITE_API_BASE_URL}${userEndpoint}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    })
                ]);
                setStats(statsRes.data);
                setUser(userRes.data);
                setLoading(false);
            } catch (error) {
                console.error('Dashboard fetch error:', error);
                toast.error('Failed to fetch dashboard data');
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div className="flex justify-center items-center h-screen text-slate-900">Loading Dashboard...</div>;

    const statCards = [
        {
            label: 'Likes Recived', value: stats.likesRecived, icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-pink-500">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                </svg>
            ), color: 'bg-pink-50'
        },
        {
            label: 'Comments Made', value: stats.commentsMade, icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-blue-500">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                </svg>
            ), color: 'bg-blue-50'
        },
        {
            label: 'Posts Created', value: stats.postsAuthored, icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-indigo-500">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                </svg>
            ), color: 'bg-indigo-50'
        },
    ];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="mb-10">
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Welcome back, {user?.name}!</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2">Here's an overview of your activity on SparkUp.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {statCards.map((card) => (
                        <div key={card.label} className="bg-white dark:bg-slate-900 p-8 rounded-3xl  border border-slate-100 dark:border-slate-800 transition-all hover:shadow-md hover:-translate-y-1">
                            <div className={`w-12 h-12 ${card.color} dark:bg-opacity-10 rounded-2xl flex items-center justify-center mb-6`}>
                                {card.icon}
                            </div>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{card.label}</p>
                            <p className="text-4xl font-bold text-slate-900 dark:text-white">{card.value}</p>
                        </div>
                    ))}
                </div>

                <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Profile Summary</h2>
                        <div className="flex items-center gap-6 mb-8">
                            <img
                                src={user?.image || 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1480&q=80'}
                                alt="Profile"
                                className="w-20 h-20 rounded-full object-cover border-4 border-slate-50 dark:border-slate-800 shadow-sm"
                            />
                            <div>
                                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{user?.name}</h3>
                                <p className="text-slate-500 dark:text-slate-400">{user?.email}</p>
                                <span className="inline-block mt-2 px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs font-bold rounded-full uppercase tracking-wider">
                                    {user?.role}
                                </span>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <a href="/Settings" className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-semibold hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors">
                                Edit Profile
                            </a>
                            <button
                                onClick={() => {
                                    localStorage.removeItem('token');
                                    window.location.href = '/';
                                }}
                                className="flex items-center justify-center gap-2 px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                            >
                                Sign Out
                            </button>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col justify-center items-center text-center">
                        <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Share an Idea</h2>
                        <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-sm">Got a brilliant innovative idea? Share it with the community and get feedback!</p>
                        <Link to="/post-idea" className="px-8 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 shadow-lg shadow-blue-500/25 transition-all hover:-translate-y-0.5">
                            Post New Idea
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
