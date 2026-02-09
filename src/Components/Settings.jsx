import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { API_BASE_URL } from '../api/config';
import Navbar from './navbar';

import { useNavigate } from 'react-router-dom';
import { RiInstagramFill } from "react-icons/ri";
import { FaLinkedinIn, FaGithub, FaGlobe } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { IoMailUnread } from "react-icons/io5";
import authorPlaceholder from '../assets/author.webp';
const Settings = () => {

    const [user, setUser] = useState({
        name: '',
        email: '',
        image: '',
        about: '',
        instagram: '',
        linkedin: '',
        twitter: '',
        github: '',
        website: '',
        skills: []
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [newSkill, setNewSkill] = useState('');
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const handleImageClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) { // 2MB limit
                toast.error('Image size should be less than 2MB');
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setUser(prev => ({ ...prev, image: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/');
                    return;
                }
                const response = await axios.get(`${API_BASE_URL}/api/users/me`, {

                    headers: { Authorization: `Bearer ${token}` }
                });
                setUser({
                    ...response.data,
                    image: response.data.image || '',
                    about: response.data.about || '',
                    instagram: response.data.instagram || '',
                    linkedin: response.data.linkedin || '',
                    twitter: response.data.twitter || '',
                    github: response.data.github || '',
                    website: response.data.website || '',
                    skills: response.data.skills || []
                });
                setLoading(false);
            } catch (error) {
                toast.error('Failed to fetch user details');
                setLoading(false);
            }
        };
        fetchUser();
    }, [navigate]);

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleAddSkill = (e) => {
        if (e.key === 'Enter' && newSkill.trim()) {
            e.preventDefault();
            if (!user.skills.includes(newSkill.trim())) {
                setUser({ ...user, skills: [...user.skills, newSkill.trim()] });
            }
            setNewSkill('');
        }
    };

    const removeSkill = (skillToRemove) => {
        setUser({ ...user, skills: user.skills.filter(skill => skill !== skillToRemove) });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(`${API_BASE_URL}/api/users/${user.id}`, user, {

                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Profile updated successfully');
            setUser({
                ...response.data,
                image: response.data.image || '',
                about: response.data.about || '',
                instagram: response.data.instagram || '',
                linkedin: response.data.linkedin || '',
                twitter: response.data.twitter || '',
                github: response.data.github || '',
                website: response.data.website || '',
                skills: response.data.skills || []
            });
            setSaving(false);
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to update profile');
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex justify-center items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black dark:border-white"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-slate-950 font-sans pb-12 transition-colors duration-300">
            <Navbar />

            <div className="flex justify-center items-start pt-8 px-4 sm:px-6 lg:px-8">
                <div className="bg-white dark:bg-slate-900 w-full max-w-5xl rounded-[40px] shadow-xl overflow-hidden relative flex flex-col md:min-h-[700px] border border-transparent dark:border-slate-800">

                    <div className="pt-10 px-8 pb-10 flex flex-col md:flex-row items-center md:items-start md:gap-12 bg-white dark:bg-slate-900 z-10 relative">

                        <div className="w-full flex justify-between items-center mb-8 md:absolute md:top-8 md:right-8 md:w-auto md:mb-0">
                            <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors md:hidden">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-gray-800 dark:text-slate-200">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                                </svg>
                            </button>
                            <div className="text-gray-800 dark:text-white font-bold text-lg md:hidden">Profile</div>
                            <button onClick={handleSubmit} disabled={saving} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors flex items-center gap-2">
                                <span className="hidden md:inline text-sm font-bold text-gray-800 dark:text-slate-200 uppercase tracking-wide mr-2">
                                    {saving ? 'Saving...' : 'Save Changes'}
                                </span>
                                {saving ? (
                                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-800 dark:border-slate-200 border-t-transparent"></div>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-gray-800 dark:text-slate-200">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                    </svg>
                                )}
                            </button>
                        </div>

                        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-10 w-full md:mt-4">

                            <div className="flex flex-col items-center">
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    className="hidden"
                                    accept="image/*"
                                />
                                <div
                                    onClick={handleImageClick}
                                    className="w-32 h-32 md:w-40 md:h-40 rounded-full p-1 border-2 border-gray-100 dark:border-slate-800 cursor-pointer overflow-hidden relative group shadow-lg transition-transform hover:scale-105"
                                >
                                    <img
                                        src={user.image || authorPlaceholder}
                                        alt="Profile"
                                        className="w-full h-full rounded-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-white">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                                        </svg>
                                    </div>
                                </div>
                                <p className="text-gray-400 dark:text-slate-500 text-xs mt-3 md:hidden">Tap to change</p>
                            </div>

                            <div className="flex flex-col items-center md:items-start flex-1 w-full">
                                <input
                                    type="text"
                                    name="name"
                                    value={user.name}
                                    onChange={handleChange}
                                    className="text-2xl md:text-4xl font-extrabold text-gray-900 dark:text-white text-center md:text-left bg-transparent border-b-2 border-transparent hover:border-gray-200 dark:hover:border-slate-800 focus:border-black dark:focus:border-white focus:outline-none transition-all w-full md:w-auto min-w-[200px]"
                                    placeholder="Your Name"
                                />


                                <div className="flex gap-4 mt-6 text-gray-600 dark:text-slate-400 font-bold text-xs md:text-sm">
                                    <a href={user.instagram || '#'} target="_blank" rel="noopener noreferrer" className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center shadow-sm transition-all hover:-translate-y-1 ${user.instagram ? 'bg-pink-100 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400 hover:bg-pink-200 dark:hover:bg-pink-900/40' : 'bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 opacity-50 cursor-not-allowed'}`}>
                                        <RiInstagramFill size={20} />
                                    </a>
                                    <a href={user.linkedin || '#'} target="_blank" rel="noopener noreferrer" className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center shadow-sm transition-all hover:-translate-y-1 ${user.linkedin ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/40' : 'bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 opacity-50 cursor-not-allowed'}`}>
                                        <FaLinkedinIn size={20} />
                                    </a>
                                    <a href={user.twitter || '#'} target="_blank" rel="noopener noreferrer" className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center shadow-sm transition-all hover:-translate-y-1 ${user.twitter ? 'bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-700' : 'bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 opacity-50 cursor-not-allowed'}`}>
                                        <FaXTwitter size={20} />
                                    </a>
                                    <a href={user.github || '#'} target="_blank" rel="noopener noreferrer" className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center shadow-sm transition-all hover:-translate-y-1 ${user.github ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700' : 'bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 opacity-50 cursor-not-allowed'}`}>
                                        <FaGithub size={20} />
                                    </a>
                                    <a href={user.website || '#'} target="_blank" rel="noopener noreferrer" className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center shadow-sm transition-all hover:-translate-y-1 ${user.website ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/40' : 'bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 opacity-50 cursor-not-allowed'}`}>
                                        <FaGlobe size={20} />
                                    </a>
                                    <a href={`mailto:${user.email}`} className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 flex items-center justify-center shadow-sm cursor-pointer hover:bg-orange-200 dark:hover:bg-orange-900/40 transition-all hover:-translate-y-1">
                                        <IoMailUnread size={20} />
                                    </a>
                                </div>
                            </div>

                        </div>
                    </div>


                    <div className="flex-1 bg-[#252525] rounded-t-[40px] px-8 pt-12 pb-12 flex flex-col md:grid md:grid-cols-2 gap-10 md:gap-16 text-white relative -mt-6 z-20 shadow-inner">


                        <div className="space-y-8">

                            <div className="space-y-4">
                                <label className="text-gray-400 text-sm font-bold uppercase tracking-wider ml-1">About & Skills</label>
                                <div className="flex flex-wrap gap-3 mb-4">
                                    {user.skills.map((skill, i) => (
                                        <span key={i} className="px-4 py-2 bg-[#333] text-gray-200 font-semibold text-sm rounded-full border border-[#444] hover:bg-red-500/20 hover:border-red-500/50 hover:text-red-400 transition-colors cursor-pointer flex items-center gap-2 group" onClick={() => removeSkill(skill)}>
                                            {skill}
                                            <span className="hidden group-hover:inline text-xs">x</span>
                                        </span>
                                    ))}
                                    <input
                                        type="text"
                                        value={newSkill}
                                        onChange={(e) => setNewSkill(e.target.value)}
                                        onKeyDown={handleAddSkill}
                                        placeholder="+ Add Skill"
                                        className="px-4 py-2 bg-[#333] text-gray-200 font-semibold text-sm rounded-full border border-[#444] hover:bg-[#444] focus:bg-[#444] focus:outline-none focus:border-gray-500 transition-all w-32 placeholder-gray-500"
                                    />
                                </div>
                                <div className="relative">
                                    <textarea
                                        name="about"
                                        value={user.about}
                                        onChange={handleChange}
                                        className="w-full bg-[#333] rounded-2xl p-5 text-base text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all resize-none border border-[#444]"
                                        rows="6"
                                        placeholder="Tell us about your journey, interests, and what drives your innovation..."
                                    ></textarea>
                                </div>
                            </div>
                        </div>


                        <div className="space-y-8">

                            <div className="space-y-6">
                                <label className="text-gray-400 text-sm font-bold uppercase tracking-wider ml-1">Social Profiles</label>

                                <div className="bg-[#333] rounded-2xl p-2 pl-4 flex items-center border border-[#444] focus-within:border-pink-500 transition-colors">
                                    <RiInstagramFill className="w-5 h-5 text-pink-500 mr-3" />
                                    <input
                                        type="text"
                                        name="instagram"
                                        value={user.instagram}
                                        onChange={handleChange}
                                        className="w-full bg-transparent py-3 text-base font-medium text-white placeholder-gray-500 focus:outline-none"
                                        placeholder="Instagram Profile URL"
                                    />
                                </div>

                                <div className="bg-[#333] rounded-2xl p-2 pl-4 flex items-center border border-[#444] focus-within:border-blue-500 transition-colors">
                                    <FaLinkedinIn className="w-5 h-5 text-blue-500 mr-3" />
                                    <input
                                        type="text"
                                        name="linkedin"
                                        value={user.linkedin}
                                        onChange={handleChange}
                                        className="w-full bg-transparent py-3 text-base font-medium text-white placeholder-gray-500 focus:outline-none"
                                        placeholder="LinkedIn Profile URL"
                                    />
                                </div>

                                <div className="bg-[#333] rounded-2xl p-2 pl-4 flex items-center border border-[#444] focus-within:border-blue-400 transition-colors">
                                    <FaXTwitter className="w-5 h-5 text-[#1DA1F2] mr-3" />
                                    <input
                                        type="text"
                                        name="twitter"
                                        value={user.twitter}
                                        onChange={handleChange}
                                        className="w-full bg-transparent py-3 text-base font-medium text-white placeholder-gray-500 focus:outline-none"
                                        placeholder="Twitter (X) Profile URL"
                                    />
                                </div>

                                <div className="bg-[#333] rounded-2xl p-2 pl-4 flex items-center border border-[#444] focus-within:border-gray-300 transition-colors">
                                    <FaGithub className="w-5 h-5 text-white mr-3" />
                                    <input
                                        type="text"
                                        name="github"
                                        value={user.github}
                                        onChange={handleChange}
                                        className="w-full bg-transparent py-3 text-base font-medium text-white placeholder-gray-500 focus:outline-none"
                                        placeholder="GitHub Profile URL"
                                    />
                                </div>

                                <div className="bg-[#333] rounded-2xl p-2 pl-4 flex items-center border border-[#444] focus-within:border-emerald-500 transition-colors">
                                    <FaGlobe className="w-5 h-5 text-emerald-500 mr-3" />
                                    <input
                                        type="text"
                                        name="website"
                                        value={user.website}
                                        onChange={handleChange}
                                        className="w-full bg-transparent py-3 text-base font-medium text-white placeholder-gray-500 focus:outline-none"
                                        placeholder="Personal Website URL"
                                    />
                                </div>
                            </div>

                            <div className="space-y-4 pt-4 border-t border-[#444]">
                                <label className="text-gray-400 text-sm font-bold uppercase tracking-wider ml-1">Contact Information</label>
                                <div className="bg-[#333] rounded-2xl p-2 pl-4 flex items-center border border-[#444] focus-within:border-gray-500 transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-gray-400 mr-3">
                                        <path d="M3 4a2 2 0 00-2 2v1.161l8.441 4.221a1.25 1.25 0 001.118 0L19 7.162V6a2 2 0 00-2-2H3z" />
                                        <path d="M19 8.839l-7.77 3.885a2.75 2.75 0 01-2.46 0L1 8.839V14a2 2 0 002 2h14a2 2 0 002-2V8.839z" />
                                    </svg>
                                    <input
                                        type="email"
                                        name="email"
                                        value={user.email}
                                        onChange={handleChange}
                                        className="w-full bg-transparent py-3 text-lg font-medium text-white placeholder-gray-500 focus:outline-none"
                                        placeholder="email@example.com"
                                    />
                                </div>
                            </div>



                        </div>

                    </div>

                </div>
            </div>
        </div>
    );
};

export default Settings;
