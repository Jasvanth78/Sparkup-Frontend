import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';
import { FaBell, FaCheck, FaTrash, FaCircle } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const Notification = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // 'all', 'unread'

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const token = localStorage.getItem('token');
            const userId = parseJwt(token).id;
            const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}api/notifications/${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotifications(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching notifications:', error);
            setLoading(false);
        }
    };

    const markAsRead = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`${import.meta.env.VITE_API_BASE_URL}api/notifications/read/${id}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
        } catch (error) {
            console.error('Error marking as read:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            const token = localStorage.getItem('token');
            const userId = parseJwt(token).id;
            await axios.put(`${import.meta.env.VITE_API_BASE_URL}api/notifications/read-all/${userId}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        } catch (error) {
            console.error('Error marking all as read:', error);
        }
    };

    const deleteAll = async () => {
        try {
            if (!window.confirm('Are you sure you want to clear all notifications?')) return;

            const token = localStorage.getItem('token');
            const userId = parseJwt(token).id;
            await axios.delete(`${import.meta.env.VITE_API_BASE_URL}api/notifications/${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotifications([]);
        } catch (error) {
            console.error('Error deleting notifications:', error);
        }
    };

    const parseJwt = (token) => {
        try {
            return JSON.parse(atob(token.split('.')[1]));
        } catch (e) {
            return {};
        }
    };

    const filteredNotifications = filter === 'all'
        ? notifications
        : notifications.filter(n => !n.isRead);

    const getIcon = (type) => {
        // You can customize icons based on notification type here
        return <FaBell className="text-blue-500" />;
    };

    if (loading) {
        return (
            <div className="min-h-screen pt-20 flex justify-center items-start bg-gray-50 dark:bg-slate-950">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mt-20"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-slate-950 transition-colors duration-300">
            <div className="max-w-3xl mx-auto">

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Notifications</h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">Stay updated with your latest activity</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="flex bg-white dark:bg-slate-900 rounded-lg p-1 shadow-sm border border-gray-200 dark:border-slate-800">
                            <button
                                onClick={() => setFilter('all')}
                                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${filter === 'all' ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'}`}
                            >
                                All
                            </button>
                            <button
                                onClick={() => setFilter('unread')}
                                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${filter === 'unread' ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'}`}
                            >
                                Unread
                            </button>
                        </div>

                        {notifications.length > 0 && (
                            <div className="flex gap-2">
                                <button
                                    onClick={markAllAsRead}
                                    className="p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-800 shadow-sm transition-colors"
                                    title="Mark all as read"
                                >
                                    <FaCheck className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={deleteAll}
                                    className="p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-800 shadow-sm transition-colors"
                                    title="Clear all"
                                >
                                    <FaTrash className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* List */}
                <div className="space-y-4">
                    <AnimatePresence>
                        {filteredNotifications.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-center py-20 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-800"
                            >
                                <div className="w-16 h-16 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <FaBell className="w-8 h-8 text-gray-400 dark:text-slate-600" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white">No notifications</h3>
                                <p className="text-gray-500 dark:text-gray-400">You're all caught up!</p>
                            </motion.div>
                        ) : (
                            filteredNotifications.map((notification) => (
                                <motion.div
                                    key={notification.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className={`relative group p-4 sm:p-5 rounded-xl border transition-all duration-200 ${notification.isRead
                                            ? 'bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800'
                                            : 'bg-blue-50/50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900/30'
                                        } hover:shadow-md cursor-pointer`}
                                    onClick={() => !notification.isRead && markAsRead(notification.id)}
                                >
                                    <div className="flex gap-4">
                                        <div className={`mt-1 flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${notification.isRead ? 'bg-gray-100 dark:bg-slate-800' : 'bg-blue-100 dark:bg-blue-900/40'
                                            }`}>
                                            {getIcon(notification.type)}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start">
                                                <p className={`text-sm font-medium ${notification.isRead ? 'text-gray-900 dark:text-white' : 'text-blue-900 dark:text-blue-100'}`}>
                                                    {notification.title}
                                                </p>
                                                <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap ml-2">
                                                    {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                                                </span>
                                            </div>
                                            <p className={`text-sm mt-1 ${notification.isRead ? 'text-gray-600 dark:text-gray-400' : 'text-blue-800 dark:text-blue-200'}`}>
                                                {notification.content}
                                            </p>
                                        </div>

                                        {!notification.isRead && (
                                            <div className="flex-shrink-0 self-center">
                                                <FaCircle className="w-2.5 h-2.5 text-blue-600 dark:text-blue-500" />
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default Notification;
