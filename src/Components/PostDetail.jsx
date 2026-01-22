import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Navbar from './navbar';
import authorPlaceholder from '../assets/author.webp';
import imgPlaceholder from '../assets/robot image.jpg';

const PostDetail = () => {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}api/posts/${id}`);
                setPost(response.data);
            } catch (error) {
                toast.error('Failed to load project details');
                navigate('/Home');
            } finally {
                setLoading(false);
            }
        };
        fetchPost();
    }, [id, navigate]);

    if (loading) return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
            <Navbar />
            <div className="flex items-center justify-center h-[calc(100vh-64px)]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
        </div>
    );

    if (!post) return null;

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300">
            <Navbar />
            <main className="max-w-5xl mx-auto px-4 py-16">
                
                <div className="mb-12">
                    <div className="flex items-center gap-4 mb-8">
                        <img
                            src={post.author?.image || authorPlaceholder}
                            alt={post.author?.name}
                            className="w-14 h-14 rounded-full object-cover border-2 border-slate-100 dark:border-slate-800"
                        />
                        <div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">{post.author?.name}</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">{new Date(post.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}</p>
                        </div>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white leading-tight mb-8">
                        {post.title}
                    </h1>

                    <div className="aspect-[21/9] w-full rounded-3xl overflow-hidden shadow-2xl border border-slate-100 dark:border-slate-800 mb-12">
                        <img
                            src={post.image || imgPlaceholder}
                            alt={post.title}
                            className="w-full h-full object-cover"
                        />
                    </div>

                 
                    <div className="prose prose-lg dark:prose-invert max-w-none">
                        <p className="text-xl text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                            {post.content}
                        </p>
                    </div>

                    <div className="mt-16 pt-8 border-t border-slate-100 dark:border-slate-800">
                        <div className="flex flex-wrap gap-4 items-center justify-between">
                            <div className="flex gap-4">
                                <button className="flex items-center gap-2 px-6 py-3 bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400 rounded-2xl font-bold hover:bg-pink-100 dark:hover:bg-pink-900/40 transition-colors border border-transparent dark:border-pink-900/30">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                                    </svg>
                                    Support Idea
                                </button>
                                <button className="flex items-center gap-2 px-6 py-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-2xl font-bold hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors border border-transparent dark:border-blue-900/30">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                                    </svg>
                                    Add Comment
                                </button>
                            </div>
                            <button
                                onClick={() => navigate(-1)}
                                className="px-6 py-3 text-slate-500 dark:text-slate-400 font-bold hover:text-slate-900 dark:hover:text-white transition-colors"
                            >
                                ← Back to Innovation Feed
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default PostDetail;
