import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Navbar from './navbar';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('pending'); // pending, users, posts
    const [users, setUsers] = useState([]);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Stats
    const [stats, setStats] = useState({
        pendingUsers: 0,
        pendingPosts: 0,
        totalUsers: 0,
        totalPosts: 0
    });

    const [selectedUserPosts, setSelectedUserPosts] = useState([]);
    const [showPostsModal, setShowPostsModal] = useState(false);
    const [viewingUserName, setViewingUserName] = useState('');

    const fetchData = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/');
                return;
            }

            const config = { headers: { Authorization: `Bearer ${token}` } };
            const baseUrl = `${import.meta.env.VITE_API_BASE_URL}api/admin`;

            // Fetch all data in parallel
            const [usersRes, postsRes] = await Promise.all([
                axios.get(`${baseUrl}/users`, config),
                axios.get(`${baseUrl}/posts`, config)
            ]);

            const allUsers = usersRes.data;
            const allPosts = postsRes.data;

            setUsers(allUsers);
            setPosts(allPosts);

            setStats({
                pendingUsers: allUsers.filter(u => u.loginstatus === 'PENDING').length,
                pendingPosts: allPosts.filter(p => p.status === 'PENDING').length,
                totalUsers: allUsers.length,
                totalPosts: allPosts.length
            });

            setLoading(false);
        } catch (error) {
            console.error(error);
            toast.error('Failed to fetch admin data');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleUserAction = async (userId, action) => {
        try {
            const token = localStorage.getItem('token');
            const endpoint = action === 'approve' ? 'approveUser' : 'rejectUser';
            await axios.post(`${import.meta.env.VITE_API_BASE_URL}api/admin/${endpoint}`, { userId }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success(`User ${action}d successfully`);
            fetchData(); // Refresh data
        } catch (error) {
            toast.error(`Failed to ${action} user`);
        }
    };

    const handlePostAction = async (postId, status) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`${import.meta.env.VITE_API_BASE_URL}api/admin/posts/${postId}/status`, { status }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success(`Post ${status.toLowerCase()} successfully`);
            fetchData(); // Refresh data
        } catch (error) {
            toast.error(`Failed to update post status`);
        }
    };

    const handleSoftDelete = async (userId) => {
        if (!window.confirm('Are you sure you want to soft delete this user? They will still be in the database but marked as deleted.')) return;
        try {
            const token = localStorage.getItem('token');
            await axios.post(`${import.meta.env.VITE_API_BASE_URL}api/admin/softDeleteUser`, { userId }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('User soft deleted');
            fetchData();
        } catch (error) {
            toast.error('Failed to soft delete user');
        }
    };

    const handleHardDelete = async (userId) => {
        if (!window.confirm('CRITICAL: Are you sure you want to PERMANENTLY delete this user and all their posts? This cannot be undone.')) return;
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${import.meta.env.VITE_API_BASE_URL}api/admin/hardDeleteUser/${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('User permanently deleted');
            fetchData();
        } catch (error) {
            toast.error('Failed to hard delete user');
        }
    };



    const fetchUserPosts = async (user) => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}api/admin/users/${user.id}/posts`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSelectedUserPosts(res.data);
            setViewingUserName(user.name);
            setShowPostsModal(true);
        } catch (error) {
            toast.error('Failed to fetch user posts');
        }
    };

    const handleDeletePost = async (postId) => {
        if (!window.confirm('Delete this post permanently?')) return;
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${import.meta.env.VITE_API_BASE_URL}api/admin/posts/${postId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Post deleted');
            // Update local state if in modal
            setSelectedUserPosts(prev => prev.filter(p => p.id !== postId));
            fetchData(); // Refresh global data
        } catch (error) {
            toast.error('Failed to delete post');
        }
    };

    const handleRestore = async (userId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.post(`${import.meta.env.VITE_API_BASE_URL}api/admin/restoreUser`, { userId }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('User restored');
            fetchData();
        } catch (error) {
            toast.error('Failed to restore user');
        }
    };

    const handlePromote = async (userId) => {
        if (!window.confirm('Are you sure you want to promote this user to an ADMIN? They will have full access to this dashboard.')) return;
        try {
            const token = localStorage.getItem('token');
            await axios.post(`${import.meta.env.VITE_API_BASE_URL}api/admin/promoteToAdmin`, { userId }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('User promoted to Admin');
            fetchData();
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to promote user');
        }
    };

    const getFilteredContent = () => {
        if (loading) return <div className="p-8 text-center text-gray-500 dark:text-slate-400">Loading...</div>;

        if (activeTab === 'pending') {
            const pendingUsers = users.filter(u => u.loginstatus === 'PENDING');
            const pendingPosts = posts.filter(p => p.status === 'PENDING');

            return (
                <div className="space-y-12 animate-fadeIn">
                    <section>
                        <div className="flex items-center gap-4 mb-8">
                            <div className="bg-amber-100 dark:bg-amber-900/20 p-3 rounded-2xl text-amber-600 dark:text-amber-400">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">Identity Verification</h3>
                                <p className="text-slate-500 dark:text-slate-400 text-sm">Reviewing individual access requests to the platform.</p>
                            </div>
                            <span className="ml-auto bg-slate-900 dark:bg-slate-800 text-white px-4 py-1.5 rounded-2xl text-xs font-black shadow-lg shadow-slate-200 dark:shadow-none">
                                {pendingUsers.length} Pending
                            </span>
                        </div>

                        {pendingUsers.length === 0 ? (
                            <div className="bg-white dark:bg-slate-900 p-12 rounded-[2.5rem] border border-dashed border-slate-200 dark:border-slate-800 text-center">
                                <p className="text-slate-400 dark:text-slate-500 font-bold italic">The verification queue is currently empty.</p>
                            </div>
                        ) : (
                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {pendingUsers.map(user => (
                                    <div key={user.id} className="bg-white dark:bg-slate-900 p-7 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-xl transition-all duration-500 group relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-24 h-24 bg-amber-50 dark:bg-amber-900/10 rounded-bl-[4rem] -mr-8 -mt-8 scale-0 group-hover:scale-100 transition-transform duration-500 origin-top-right"></div>

                                        <div className="relative">
                                            <div className="flex items-center gap-4 mb-6">
                                                <div className="w-14 h-14 rounded-2xl bg-slate-900 dark:bg-slate-800 flex items-center justify-center text-white text-xl font-black shadow-xl shadow-slate-200 dark:shadow-none">
                                                    {user.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <h4 className="font-extrabold text-slate-900 dark:text-white text-lg">{user.name}</h4>
                                                    <p className="text-xs font-bold text-slate-400 dark:text-slate-500">{user.email}</p>
                                                </div>
                                            </div>

                                            <div className="flex flex-col gap-2 mb-8">
                                                <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                                    Requested on {new Date(user.createdAt).toLocaleDateString()}
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-3">
                                                <button onClick={() => handleUserAction(user.id, 'approve')} className="bg-emerald-600 dark:bg-emerald-700 text-white py-3 rounded-2xl font-black text-xs hover:bg-emerald-700 dark:hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-100 dark:shadow-none active:scale-95">Verify Account</button>
                                                <button onClick={() => handleUserAction(user.id, 'reject')} className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 py-3 rounded-2xl font-black text-xs hover:bg-slate-50 dark:hover:bg-slate-700 transition-all active:scale-95">Decline Access</button>
                                                <button onClick={() => fetchUserPosts(user)} className="col-span-2 mt-1 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 py-3 rounded-2xl font-black text-xs hover:bg-slate-100 dark:hover:bg-slate-700 transition-all text-center">Inspect Activity History</button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>

                    <section>
                        <div className="flex items-center gap-4 mb-8">
                            <div className="bg-blue-100 dark:bg-blue-900/20 p-3 rounded-2xl text-blue-600 dark:text-blue-400">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">Content Moderation</h3>
                                <p className="text-slate-500 dark:text-slate-400 text-sm">Reviewing new ideas and proposals before public release.</p>
                            </div>
                            <span className="ml-auto bg-slate-900 dark:bg-slate-800 text-white px-4 py-1.5 rounded-2xl text-xs font-black shadow-lg shadow-slate-200 dark:shadow-none">
                                {pendingPosts.length} Pending
                            </span>
                        </div>

                        {pendingPosts.length === 0 ? (
                            <div className="bg-white dark:bg-slate-900 p-12 rounded-[2.5rem] border border-dashed border-slate-200 dark:border-slate-800 text-center">
                                <p className="text-slate-400 dark:text-slate-500 font-bold italic">No content currently requires moderation.</p>
                            </div>
                        ) : (
                            <div className="grid gap-8">
                                {pendingPosts.map(post => (
                                    <div key={post.id} className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden hover:shadow-xl transition-all duration-500 group">
                                        <div className="flex flex-col lg:flex-row">
                                            <div className="p-8 lg:w-2/3 border-b lg:border-b-0 lg:border-r border-slate-50 dark:border-slate-800">
                                                <div className="flex items-center justify-between mb-6">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/10 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg>
                                                        </div>
                                                        <h4 className="font-black text-2xl text-slate-900 dark:text-white tracking-tight">{post.title}</h4>
                                                    </div>
                                                    <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 tracking-widest uppercase">{new Date(post.createdAt).toLocaleDateString()}</span>
                                                </div>
                                                <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6 italic">"{post.content}"</p>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-slate-900 dark:bg-slate-800 flex items-center justify-center text-white text-[10px] font-black">
                                                        {post.author.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-black text-slate-800 dark:text-white">Proposed by {post.author.name}</p>
                                                        <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500">{post.author.email}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="p-8 lg:w-1/3 bg-slate-50/50 dark:bg-slate-800/50 flex flex-col justify-center gap-3">
                                                <button onClick={() => handlePostAction(post.id, 'APPROVED')} className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-4 rounded-2xl font-black text-sm hover:bg-slate-800 dark:hover:bg-slate-100 transition-all shadow-xl shadow-slate-200 dark:shadow-none active:scale-95">Approve for Release</button>
                                                <button onClick={() => handlePostAction(post.id, 'REJECTED')} className="w-full bg-white dark:bg-slate-800 text-rose-600 border border-slate-200 dark:border-slate-700 py-4 rounded-2xl font-black text-sm hover:bg-rose-50 dark:hover:bg-rose-900/10 hover:border-rose-100 dark:hover:border-rose-900 transition-all active:scale-95">Decline Content</button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                </div>
            );
        }

        if (activeTab === 'users') {
            return (
                <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden animate-fadeIn">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50 dark:bg-slate-800/50">
                                    <th className="p-6 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest border-b border-slate-50 dark:border-slate-800">Contributor</th>
                                    <th className="p-6 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest border-b border-slate-50 dark:border-slate-800">Platform Status</th>
                                    <th className="p-6 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest border-b border-slate-50 dark:border-slate-800">Joined Since</th>
                                    <th className="p-6 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest border-b border-slate-50 dark:border-slate-800">Identity & Operations</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                                {users.map(user => (
                                    <tr key={user.id} className="hover:bg-slate-50/30 dark:hover:bg-slate-800/30 transition-colors group/row">
                                        <td className="p-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-11 h-11 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 font-black text-sm group-hover/row:bg-slate-900 dark:group-hover/row:bg-white group-hover/row:text-white dark:group-hover/row:text-slate-900 transition-all">
                                                    {user.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-900 dark:text-white leading-tight">{user.name}</p>
                                                    <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">{user.email}</p>
                                                    {user.role === 'ADMIN' && (
                                                        <span className="inline-flex items-center gap-1 mt-1 text-[9px] font-black text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded-full uppercase tracking-tighter">
                                                            <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                                                            Authorized Admin
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <span className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest ${user.loginstatus === 'APPROVED' ? 'bg-emerald-50 text-emerald-600' :
                                                user.loginstatus === 'PENDING' ? 'bg-amber-50 text-amber-600' :
                                                    'bg-rose-50 text-rose-600'
                                                }`}>
                                                {user.loginstatus}
                                            </span>
                                            {user.isDeleted && (
                                                <span className="ml-2 px-2 py-0.5 bg-slate-900 text-white text-[9px] font-black rounded-lg uppercase tracking-tighter shadow-lg shadow-slate-200">Deactivated</span>
                                            )}
                                        </td>
                                        <td className="p-6">
                                            <p className="text-sm font-bold text-slate-500">{new Date(user.createdAt).toLocaleDateString()}</p>
                                        </td>
                                        <td className="p-6">
                                            <div className="flex items-center gap-4">
                                                {/* Content Controls */}
                                                <div className="flex bg-slate-50/50 p-1.5 rounded-xl border border-slate-100 shadow-inner gap-1">
                                                    <button
                                                        onClick={() => fetchUserPosts(user)}
                                                        className="p-2.5 text-blue-600 hover:bg-white hover:shadow-sm rounded-lg transition-all group/btn relative"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                                                        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-3 py-1 bg-slate-900 text-white text-[10px] font-black rounded-lg opacity-0 group-hover/btn:opacity-100 transition-all whitespace-nowrap pointer-events-none z-50 shadow-2xl scale-90 group-hover/btn:scale-100 origin-bottom">View Posts</span>
                                                    </button>

                                                    {user.loginstatus !== 'APPROVED' && (
                                                        <button
                                                            onClick={() => handleUserAction(user.id, 'approve')}
                                                            className="p-2.5 text-emerald-600 hover:bg-white hover:shadow-sm rounded-lg transition-all group/btn relative"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                                                            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-3 py-1 bg-slate-900 text-white text-[10px] font-black rounded-lg opacity-0 group-hover/btn:opacity-100 transition-all whitespace-nowrap pointer-events-none z-50 shadow-2xl scale-90 group-hover/btn:scale-100 origin-bottom">Approve</span>
                                                        </button>
                                                    )}

                                                    {user.role !== 'ADMIN' && (
                                                        <button
                                                            onClick={() => handlePromote(user.id)}
                                                            className="p-2.5 text-indigo-600 hover:bg-white hover:shadow-sm rounded-lg transition-all group/btn relative"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                                                            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-3 py-1 bg-slate-900 text-white text-[10px] font-black rounded-lg opacity-0 group-hover/btn:opacity-100 transition-all whitespace-nowrap pointer-events-none z-50 shadow-2xl scale-90 group-hover/btn:scale-100 origin-bottom">Make Admin</span>
                                                        </button>
                                                    )}
                                                </div>

                                                {/* Risk Operations */}
                                                <div className="flex bg-slate-50 p-1.5 rounded-xl border border-slate-100 shadow-inner gap-1">
                                                    {!user.isDeleted ? (
                                                        <button
                                                            onClick={() => handleSoftDelete(user.id)}
                                                            className="p-2.5 text-amber-600 hover:bg-white hover:shadow-sm rounded-lg transition-all group/btn relative"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"></path></svg>
                                                            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-3 py-1 bg-slate-900 text-white text-[10px] font-black rounded-lg opacity-0 group-hover/btn:opacity-100 transition-all whitespace-nowrap pointer-events-none z-50 shadow-2xl scale-90 group-hover/btn:scale-100 origin-bottom">Soft Delete</span>
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() => handleRestore(user.id)}
                                                            className="p-2.5 text-emerald-600 hover:bg-white hover:shadow-sm rounded-lg transition-all group/btn relative"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                                                            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-3 py-1 bg-slate-900 text-white text-[10px] font-black rounded-lg opacity-0 group-hover/btn:opacity-100 transition-all whitespace-nowrap pointer-events-none z-50 shadow-2xl scale-90 group-hover/btn:scale-100 origin-bottom">Restore</span>
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => handleHardDelete(user.id)}
                                                        className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-white hover:shadow-sm rounded-lg transition-all group/btn relative"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                                        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-3 py-1 bg-rose-600 text-white text-[10px] font-black rounded-lg opacity-0 group-hover/btn:opacity-100 transition-all whitespace-nowrap pointer-events-none z-50 shadow-2xl scale-90 group-hover/btn:scale-100 origin-bottom">Hard Delete</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )
        }

        if (activeTab === 'posts') {
            return (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 animate-fadeIn">
                    {posts.map(post => (
                        <div key={post.id} className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl transition-all duration-300 group relative">
                            <div className="p-7">
                                <div className="flex justify-between items-start mb-5">
                                    <span className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest ${post.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-700' :
                                        post.status === 'PENDING' ? 'bg-amber-100 text-amber-700' :
                                            'bg-rose-100 text-rose-700'
                                        }`}>
                                        {post.status}
                                    </span>
                                    <button
                                        onClick={() => handleDeletePost(post.id)}
                                        className="p-2 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                                        title="Delete Post"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                    </button>
                                </div>
                                <h4 className="font-black text-slate-900 mb-3 line-clamp-1 text-lg">{post.title}</h4>
                                <p className="text-slate-500 text-sm mb-8 line-clamp-3 min-h-[4.5rem] leading-relaxed italic">"{post.content}"</p>

                                <div className="flex items-center justify-between pt-5 border-t border-slate-50">
                                    <div className="flex items-center gap-2">
                                        <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center text-white font-black text-xs shadow-lg shadow-slate-200">
                                            {post.author.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-xs font-black text-slate-800">{post.author.name}</p>
                                            <p className="text-[10px] text-slate-400 font-bold">{new Date(post.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        {post.status !== 'APPROVED' && (
                                            <button
                                                onClick={() => handlePostAction(post.id, 'APPROVED')}
                                                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black hover:bg-slate-800 transition-all active:scale-95 shadow-lg shadow-slate-100"
                                            >
                                                Approve
                                            </button>
                                        )}
                                        {post.status !== 'REJECTED' && (
                                            <button
                                                onClick={() => handlePostAction(post.id, 'REJECTED')}
                                                className="px-4 py-2 bg-white text-rose-600 border border-slate-100 rounded-xl text-[10px] font-black hover:bg-rose-50 transition-all active:scale-95"
                                            >
                                                Reject
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 font-sans pb-12 transition-colors duration-300">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                    <div>
                        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">System Administration</h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Central hub for user moderation and content oversight.</p>
                    </div>
                    <button
                        onClick={fetchData}
                        className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-sm transition-all active:scale-95 font-semibold text-sm"
                    >
                        <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                        Refresh Overview
                    </button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {[
                        { label: 'Pending Users', value: stats.pendingUsers, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/10', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
                        { label: 'Pending Posts', value: stats.pendingPosts, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/10', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
                        { label: 'Total Platform Users', value: stats.totalUsers, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/10', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
                        { label: 'Total Content Shared', value: stats.totalPosts, color: 'text-slate-800 dark:text-slate-200', bg: 'bg-slate-50 dark:bg-slate-800/10', icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' }
                    ].map((stat, i) => (
                        <div key={stat.label} className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md transition-shadow group">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={stat.icon}></path></svg>
                                </div>
                                <span className="text-[10px] font-bold text-slate-300 dark:text-slate-600 uppercase tracking-widest">Platform Stat</span>
                            </div>
                            <p className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{stat.label}</p>
                            <p className={`text-4xl font-black ${stat.color} mt-1 tracking-tight`}>{stat.value}</p>
                        </div>
                    ))}
                </div>

                {/* Tabs */}
                <div className="flex gap-10 border-b border-slate-200 dark:border-slate-800 mb-10 overflow-x-auto no-scrollbar">
                    {['pending', 'users', 'posts'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`pb-4 px-2 text-sm font-bold capitalize transition-all relative whitespace-nowrap ${activeTab === tab
                                ? 'text-blue-600 dark:text-blue-400'
                                : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
                                }`}
                        >
                            {tab === 'pending' ? 'Verification Queue' : `${tab} directory`}
                            {activeTab === tab && (
                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 dark:bg-blue-400 rounded-t-full" />
                            )}
                        </button>
                    ))}
                </div>

                {/* Content */}
                {getFilteredContent()}

                {/* User Posts Modal */}
                {showPostsModal && (
                    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fadeIn">
                        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] w-full max-w-5xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl border border-white/20 dark:border-slate-800">
                            <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-start bg-slate-50/50 dark:bg-slate-800/50">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white text-xl font-black">
                                            {viewingUserName.charAt(0)}
                                        </div>
                                        <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{viewingUserName}</h2>
                                    </div>
                                    <p className="text-slate-500 dark:text-slate-400 font-medium font-bold">Platform Activity Log & Moderation History</p>
                                </div>
                                <button onClick={() => setShowPostsModal(false)} className="p-3 hover:bg-white dark:hover:bg-slate-800 hover:shadow-sm rounded-2xl transition-all text-slate-400 hover:text-slate-900 dark:hover:text-white border border-transparent hover:border-slate-200 dark:hover:border-slate-700">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
                                </button>
                            </div>

                            <div className="p-8 overflow-y-auto bg-[#F8FAFC] dark:bg-slate-950">
                                {selectedUserPosts.length === 0 ? (
                                    <div className="text-center py-24 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
                                        <div className="w-20 h-20 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center mx-auto mb-6 text-slate-300 dark:text-slate-600">
                                            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path></svg>
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-800 dark:text-white">No content found</h3>
                                        <p className="text-slate-400 dark:text-slate-500 mt-2 max-w-xs mx-auto font-bold">This contributor has not published any ideas or posts on the platform yet.</p>
                                    </div>
                                ) : (
                                    <div className="grid gap-6">
                                        {selectedUserPosts.map(post => (
                                            <div key={post.id} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div className="max-w-2xl">
                                                        <h3 className="font-black text-xl text-slate-900 dark:text-white mb-2 leading-tight">{post.title}</h3>
                                                        <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed italic font-bold">"{post.content}"</p>
                                                    </div>
                                                    <span className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm ${post.status === 'APPROVED' ? 'bg-emerald-500 text-white' :
                                                        post.status === 'PENDING' ? 'bg-amber-400 text-white' :
                                                            'bg-rose-500 text-white'
                                                        }`}>
                                                        {post.status}
                                                    </span>
                                                </div>

                                                <div className="flex justify-between items-center pt-5 border-t border-slate-50 dark:border-slate-800 mt-4">
                                                    <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                                        <span className="text-xs font-bold">{new Date(post.createdAt).toLocaleString()}</span>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        {post.status !== 'APPROVED' && (
                                                            <button
                                                                onClick={() => handlePostAction(post.id, 'APPROVED')}
                                                                className="px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-xl text-xs font-bold hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors"
                                                            >
                                                                Release Post
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={() => handleDeletePost(post.id)}
                                                            className="px-4 py-2 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 rounded-xl text-xs font-bold hover:bg-rose-100 dark:hover:bg-rose-900/40 transition-colors"
                                                        >
                                                            Terminate
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="p-8 border-t border-slate-100 dark:border-slate-800 flex justify-end bg-white dark:bg-slate-900">
                                <button
                                    onClick={() => setShowPostsModal(false)}
                                    className="px-10 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[1.25rem] font-black hover:bg-slate-800 dark:hover:bg-slate-100 transition-all shadow-xl hover:-translate-y-1 active:translate-y-0"
                                >
                                    Finish Moderation
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
