import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Navbar from './navbar';
import {
    FaImage,
    FaGlobeAmericas,
    FaLock,
    FaUsers,
    FaArrowLeft,
    FaLightbulb,
    FaCloudUploadAlt,
    FaTimes
} from 'react-icons/fa';

const PostIdea = () => {
    const [formData, setFormData] = useState({ title: '', content: '', image: '', viewStatus: 'PUBLIC' });
    const [loading, setLoading] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageClick = () => {
        fileInputRef.current?.click();
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            processFile(e.dataTransfer.files[0]);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            processFile(file);
        }
    };

    const processFile = (file) => {
        if (file.size > 50 * 1024 * 1024) {
            toast.error('Image size should be less than 50MB');
            return;
        }
        const reader = new FileReader();
        reader.onloadend = () => {
            setFormData(prev => ({ ...prev, image: reader.result }));
        };
        reader.readAsDataURL(file);
    };

    const removeImage = (e) => {
        e.stopPropagation();
        setFormData(prev => ({ ...prev, image: '' }));
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            const userRes = await axios.get(`${import.meta.env.VITE_API_BASE_URL}api/users/me`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const userId = userRes.data.id;

            await axios.post(`${import.meta.env.VITE_API_BASE_URL}api/posts`, {
                ...formData,
                authorId: userId
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            toast.success('Idea posted successfully!');
            navigate('/Home');
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to post idea');
        } finally {
            setLoading(false);
        }
    };

    const visibilityOptions = [
        { id: 'PUBLIC', icon: FaGlobeAmericas, label: 'Public', desc: 'Visible to everyone' },
        { id: 'TEAM', icon: FaUsers, label: 'Team', desc: 'Visible to team members' },
        { id: 'PRIVATE', icon: FaLock, label: 'Private', desc: 'Only you can see this' }
    ];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300 font-sans">
            <Navbar />

            <main className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8">

                <div className="mb-8 text-center animate-fade-in-down">
                    <div className="inline-flex items-center justify-center p-3 mb-4 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                        <FaLightbulb className="w-6 h-6" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                        Spark Your Innovation
                    </h1>
                    <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                        Share your groundbreaking ideas with the world. Turn your vision into reality.
                    </p>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-black/20 border border-slate-100 dark:border-slate-800 overflow-hidden backdrop-blur-sm">
                    <form onSubmit={handleSubmit} className="p-6 md:p-10 space-y-8">

                        {/* Title Input */}
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">
                                Project Title
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="Give your idea a catchy name..."
                                className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-lg font-medium text-slate-900 dark:text-white placeholder-slate-400"
                                required
                            />
                        </div>


                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">
                                Cover Image
                            </label>
                            <div
                                className={`relative group w-full h-64 rounded-2xl border-2 border-dashed transition-all cursor-pointer overflow-hidden
                                    ${dragActive
                                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/10 scale-[1.01]'
                                        : 'border-slate-300 dark:border-slate-700 hover:border-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                                    }
                                `}
                                onDragEnter={handleDrag}
                                onDragLeave={handleDrag}
                                onDragOver={handleDrag}
                                onDrop={handleDrop}
                                onClick={handleImageClick}
                            >
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    className="hidden"
                                    accept="image/*"
                                />

                                {formData.image ? (
                                    <>
                                        <img
                                            src={formData.image}
                                            alt="Preview"
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <p className="text-white font-medium flex items-center gap-2">
                                                <FaCloudUploadAlt /> Change Image
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={removeImage}
                                            className="absolute top-4 right-4 p-2 bg-white/90 dark:bg-black/50 text-slate-600 dark:text-white rounded-full hover:bg-red-50 hover:text-red-500 transition-all shadow-lg"
                                        >
                                            <FaTimes />
                                        </button>
                                    </>
                                ) : (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                                        <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                            <FaImage className="w-8 h-8" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200">
                                            Upload Cover Image
                                        </h3>
                                        <p className="text-slate-500 dark:text-slate-400 mt-1 max-w-xs text-sm">
                                            Drag & drop or click to upload. Recommended size: 1200x600px
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>


                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">
                                Description
                            </label>
                            <textarea
                                name="content"
                                value={formData.content}
                                onChange={handleChange}
                                placeholder="Describe the problem, your solution, and the impact..."
                                rows="6"
                                className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-base text-slate-900 dark:text-white placeholder-slate-400 resize-none"
                                required
                            ></textarea>
                        </div>

                        <div className="space-y-3">
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">
                                Who can see this?
                            </label>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {visibilityOptions.map((option) => {
                                    const Icon = option.icon;
                                    const isSelected = formData.viewStatus === option.id;
                                    return (
                                        <div
                                            key={option.id}
                                            onClick={() => setFormData({ ...formData, viewStatus: option.id })}
                                            className={`relative p-3 rounded-xl border-2 cursor-pointer transition-all duration-200 flex flex-col items-center text-center gap-1.5 group
                                                ${isSelected
                                                    ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/10 shadow-sm ring-1 ring-blue-500/20'
                                                    : 'border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                                                }
                                            `}
                                        >
                                            <div className={`p-1.5 rounded-full transition-colors ${isSelected ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 group-hover:text-blue-500'}`}>
                                                <Icon className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <h4 className={`font-semibold text-xs ${isSelected ? 'text-blue-700 dark:text-blue-400' : 'text-slate-700 dark:text-slate-300'}`}>
                                                    {option.label}
                                                </h4>
                                                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-tight">
                                                    {option.desc}
                                                </p>
                                            </div>
                                            {isSelected && (
                                                <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>


                        <div className="pt-6 flex flex-col-reverse sm:flex-row gap-4">
                            <button
                                type="button"
                                onClick={() => navigate(-1)}
                                className="px-8 py-3.5 rounded-xl font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
                            >
                                <FaArrowLeft className="text-sm" /> Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 px-8 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 transform hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Posting...
                                    </>
                                ) : (
                                    <>
                                        Share Idea <FaLightbulb />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default PostIdea;
