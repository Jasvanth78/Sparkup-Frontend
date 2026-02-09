import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { API_BASE_URL } from '../api/config';
import Navbar from './navbar';
import authorPlaceholder from '../assets/author.webp';
import { RiInstagramFill } from "react-icons/ri";
import { FaLinkedinIn, FaGithub, FaGlobe } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { IoMailUnread } from "react-icons/io5";

const UserProfile = () => {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('token');
                const [userRes, postsRes] = await Promise.all([
                    axios.get(`${API_BASE_URL}/api/users/${id}`, {
                        headers: token ? { Authorization: `Bearer ${token}` } : {}
                    }),
                    axios.get(`${API_BASE_URL}/api/users/${id}/posts`, {
                        headers: token ? { Authorization: `Bearer ${token}` } : {}
                    })
                ]);

                setUser(userRes.data);
                setPosts(postsRes.data);
            } catch (error) {
                console.error('Error fetching profile data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchUserData();
    }, [id]);

    if (loading) return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
    );

    if (!user) return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 py-20 text-center">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">User not found</h2>
                <Link to="/Home" className="mt-4 text-blue-600 hover:underline inline-block">Back Home</Link>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
            <Navbar />
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-slate-900 dark:text-white">

                {/* Header Section */}
                <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 mb-12 flex flex-col md:flex-row items-center gap-8">
                    <img
                        src={user.image || authorPlaceholder}
                        alt={user.name}
                        className="w-32 h-32 rounded-full object-cover border-4 border-slate-50 dark:border-slate-800 shadow-md transition-transform hover:scale-105"
                    />
                    <div className="text-center md:text-left flex-1 min-w-0">
                        <div className="flex items-center justify-center md:justify-start gap-4 mb-2">
                            <h1 className="text-3xl font-bold truncate">{user.name}</h1>
                            <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 text-xs font-bold rounded-full uppercase tracking-wider shrink-0">
                                {user.role}
                            </span>
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 text-lg mb-4">{user.email}</p>
                        {user.about && (
                            <p className="text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed whitespace-pre-wrap">
                                {user.about}
                            </p>
                        )}
                        <div className="mt-8 flex flex-wrap gap-4 justify-center md:justify-start">
                            {user.instagram && (
                                <a href={user.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400 flex items-center justify-center hover:scale-110 transition-transform shadow-sm">
                                    <RiInstagramFill size={20} />
                                </a>
                            )}
                            {user.linkedin && (
                                <a href={user.linkedin} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center hover:scale-110 transition-transform shadow-sm">
                                    <FaLinkedinIn size={20} />
                                </a>
                            )}
                            {user.twitter && (
                                <a href={user.twitter} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white flex items-center justify-center hover:scale-110 transition-transform shadow-sm">
                                    <FaXTwitter size={20} />
                                </a>
                            )}
                            {user.github && (
                                <a href={user.github} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white flex items-center justify-center hover:scale-110 transition-transform shadow-sm">
                                    <FaGithub size={20} />
                                </a>
                            )}
                            {user.website && (
                                <a href={user.website} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center hover:scale-110 transition-transform shadow-sm">
                                    <FaGlobe size={20} />
                                </a>
                            )}
                            <a href={`mailto:${user.email}`} className="w-10 h-10 rounded-full bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 flex items-center justify-center hover:scale-110 transition-transform shadow-sm">
                                <IoMailUnread size={20} />
                            </a>
                        </div>

                        <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-6 justify-center md:justify-start">
                            <div className="text-center md:text-left">
                                <p className="text-2xl font-black text-slate-900 dark:text-white leading-none mb-1">{posts.length}</p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Total Projects</p>
                            </div>
                            <div className="w-px h-8 bg-slate-100 dark:bg-slate-800 hidden md:block"></div>
                            <div className="text-center md:text-left">
                                <p className="text-2xl font-black text-slate-900 dark:text-white leading-none mb-1">{new Date(user.createdAt).getFullYear()}</p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Member Since</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Activity Section */}
                <div>
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-bold flex items-center gap-3">
                            <span className="w-8 h-1 bg-blue-600 rounded-full"></span>
                            Recent Activity
                        </h2>
                    </div>

                    {posts.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {posts.map((post) => (
                                <Link
                                    to={`/post/${post.id}`}
                                    key={post.id}
                                    className="group bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 hover:shadow-lg transition-all flex gap-5 overflow-hidden active:scale-[0.98]"
                                >
                                    {post.image && (
                                        <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0 border border-slate-50 dark:border-slate-800">
                                            <img src={post.image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                        </div>
                                    )}
                                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                                                {new Date(post.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </p>
                                            <h4 className="font-bold text-lg leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                                                {post.title}
                                            </h4>
                                        </div>
                                        <div className="mt-4 flex items-center justify-between">
                                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${post.viewStatus === 'PRIVATE' ? 'bg-red-50 text-red-600 dark:bg-red-900/20' :
                                                post.viewStatus === 'TEAM' ? 'bg-orange-50 text-orange-600 dark:bg-orange-900/20' :
                                                    'bg-green-50 text-green-600 dark:bg-green-900/20'
                                                }`}>
                                                {post.viewStatus}
                                            </span>
                                            <div className="flex items-center gap-3 text-slate-400 text-xs font-bold">
                                                <div className="flex items-center gap-1">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                                                    </svg>
                                                    {post._count?.likes || 0}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                                                    </svg>
                                                    {post._count?.comments || 0}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-100 dark:border-slate-800">
                            <p className="text-slate-500 italic">This user hasn't posted any ideas yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
