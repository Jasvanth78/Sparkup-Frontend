import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AiFillLike, AiOutlineLike } from 'react-icons/ai';
import { formatDistanceToNow } from 'date-fns';
import { io } from 'socket.io-client';
import Navbar from './navbar';
import authorPlaceholder from '../assets/author.webp';
const postPlaceholder = "https://images.unsplash.com/photo-1519389950473-acc799a6d401?ixlib=rb-1.2.1&auto=format&fit=crop&w=1480&q=80";

const PostDetail = () => {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [comments, setComments] = useState([]);
    const [commentCount, setCommentCount] = useState(0);
    const [newComment, setNewComment] = useState('');
    const [showComments, setShowComments] = useState(false);
    const [submittingComment, setSubmittingComment] = useState(false);
    const navigate = useNavigate();

    const [currentUser, setCurrentUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    useEffect(() => {
        // Fallback: If token exists but user doesn't, fetch user
        const fetchUserIfNeeded = async () => {
            const token = localStorage.getItem('token');
            if (token && !currentUser) {
                try {
                    const role = localStorage.getItem('role');
                    const endpoint = role === 'ADMIN'
                        ? `${import.meta.env.VITE_API_BASE_URL}api/admin/me`
                        : `${import.meta.env.VITE_API_BASE_URL}api/users/me`;

                    const res = await axios.get(endpoint, {
                        headers: { Authorization: `Bearer ${token}` }
                    });

                    const userData = role === 'ADMIN' ? { ...res.data, name: 'Admin' } : res.data;
                    setCurrentUser(userData);
                    localStorage.setItem('user', JSON.stringify(userData));
                } catch (err) {
                    console.error("Failed to fetch user in PostDetail", err);
                }
            }
        };
        fetchUserIfNeeded();
    }, [currentUser]);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}api/posts/${id}`);
                setPost(response.data);

                // Fetch like status and count
                if (currentUser) {
                    const likeStatusRes = await axios.get(`${import.meta.env.VITE_API_BASE_URL}api/posts/${id}/likes/${currentUser.id}`);
                    setLiked(likeStatusRes.data.liked);
                }

                const likeCountRes = await axios.get(`${import.meta.env.VITE_API_BASE_URL}api/posts/${id}/likes/count`);
                setLikeCount(likeCountRes.data.count);

                // Fetch comments
                const commentsRes = await axios.get(`${import.meta.env.VITE_API_BASE_URL}api/posts/${id}/comments`);
                setComments(commentsRes.data);
                setCommentCount(commentsRes.data.length);
            } catch (error) {
                toast.error('Failed to load project details');
                navigate('/Home');
            } finally {
                setLoading(false);
            }
        };
        fetchPost();

        // Socket.IO setup for real-time updates
        const socket = io(import.meta.env.VITE_API_BASE_URL, {
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            reconnectionAttempts: 5
        });

        socket.on('connect', () => {
            console.log('Connected to socket server');
            socket.emit('joinPost', id);
        });

        // Listen for real-time like updates
        socket.on('postLiked', (data) => {
            if (data.postId === id) {
                setLikeCount(data.likeCount || 0);
            }
        });

        // Listen for new comments
        socket.on('newComment', (comment) => {
            setComments(prevComments => [comment, ...prevComments]);
            setCommentCount(prevCount => prevCount + 1);
        });

        return () => {
            socket.off('postLiked');
            socket.off('newComment');
            socket.disconnect();
        };
    }, [id, navigate, currentUser]);

    const handleLike = async () => {
        if (!currentUser) {
            toast.error('Please login to like posts');
            return;
        }

        // Optimistic Update
        const prevLiked = liked;
        const prevLikeCount = likeCount;

        setLiked(!prevLiked);
        setLikeCount(prevLiked ? prevLikeCount - 1 : prevLikeCount + 1);

        try {
            const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}api/posts/${id}/like`, {
                userId: currentUser.id
            });

            // Sync with server response
            setLiked(response.data.liked);
            setLikeCount(response.data.likeCount || 0);
        } catch (error) {
            // Revert on error
            setLiked(prevLiked);
            setLikeCount(prevLikeCount);
            toast.error('Failed to update like');
        }
    };

    const handleAddComment = async (e) => {
        e.preventDefault();

        if (!currentUser) {
            toast.error('Please login to comment');
            return;
        }

        if (!newComment.trim()) {
            toast.error('Comment cannot be empty');
            return;
        }

        setSubmittingComment(true);
        try {
            await axios.post(`${import.meta.env.VITE_API_BASE_URL}api/posts/${id}/comment`, {
                userId: currentUser.id,
                content: newComment
            });

            // Refresh comments
            const commentsRes = await axios.get(`${import.meta.env.VITE_API_BASE_URL}api/posts/${id}/comments`);
            setComments(commentsRes.data);
            setCommentCount(commentsRes.data.length);
            setNewComment('');
            toast.success('Comment added!');
        } catch (error) {
            toast.error('Failed to add comment');
        } finally {
            setSubmittingComment(false);
        }
    };

    const handleDeleteComment = async (commentId) => {
        if (!currentUser) return;

        try {
            await axios.delete(`${import.meta.env.VITE_API_BASE_URL}api/posts/${id}/comment/${commentId}`, {
                data: { userId: currentUser.id }
            });

            // Refresh comments
            const commentsRes = await axios.get(`${import.meta.env.VITE_API_BASE_URL}api/posts/${id}/comments`);
            setComments(commentsRes.data);
            setCommentCount(commentsRes.data.length);
            toast.success('Comment deleted');
        } catch (error) {
            toast.error('Failed to delete comment');
        }
    };

    const handleLikeComment = async (commentId) => {
        if (!currentUser) {
            toast.error('Please login to like comments');
            return;
        }

        // Optimistic Update
        const previousComments = [...comments];
        setComments(prevComments => prevComments.map(comment => {
            if (comment.id === commentId) {
                const isLiked = comment.commentlikes?.some(like => like.userId === currentUser.id);
                const newLikes = isLiked
                    ? comment.commentlikes.filter(like => like.userId !== currentUser.id)
                    : [...(comment.commentlikes || []), { userId: currentUser.id }];

                return {
                    ...comment,
                    commentlikes: newLikes,
                    likeCount: isLiked ? (comment.likeCount || 1) - 1 : (comment.likeCount || 0) + 1
                };
            }
            return comment;
        }));

        try {
            await axios.post(`${import.meta.env.VITE_API_BASE_URL}api/posts/${id}/comment/${commentId}/like`, {
                userId: currentUser.id
            });
        } catch (error) {
            console.error('Error liking comment:', error);
            setComments(previousComments); // Revert on failure
            toast.error('Failed to like comment');
        }
    };

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
            <main className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16">

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

                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white leading-tight mb-8">
                        {post.title}
                    </h1>

                    <div className="aspect-video sm:aspect-[21/9] w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-slate-100 dark:border-slate-800 mb-12">
                        <img
                            src={post.image || postPlaceholder}
                            alt={post.title}
                            className="w-full h-full object-cover"
                        />
                    </div>


                    <div className="prose prose-lg dark:prose-invert max-w-none">
                        <p className="text-xl text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                            {post.content}
                        </p>
                    </div>

                    <div className="mt-12 sm:mt-16 pt-6 sm:pt-8 border-t border-slate-100 dark:border-slate-800">
                        <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 items-stretch sm:items-center justify-between">
                            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 order-1">
                                <button
                                    onClick={handleLike}
                                    className={`flex items-center justify-center gap-3 px-8 py-3 rounded-2xl font-bold transition-all duration-200 border-2 transform hover:scale-105 active:scale-95 ${liked
                                        ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white border-pink-600 shadow-lg shadow-pink-500/30'
                                        : 'bg-white dark:bg-slate-900 text-pink-600 dark:text-pink-400 border-pink-200 dark:border-pink-900/50 hover:border-pink-300 dark:hover:border-pink-900'
                                        }`}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill={liked ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={`w-6 h-6 transition-all ${liked ? 'animate-pulse' : ''}`}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                                    </svg>
                                    <span className="text-lg">{liked ? 'Liked' : 'Support Idea'}</span>
                                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${liked ? 'bg-white/30' : 'bg-pink-100 dark:bg-pink-900/40'}`}>
                                        {likeCount}
                                    </span>
                                </button>
                                <button
                                    onClick={() => setShowComments(!showComments)}
                                    className="flex items-center justify-center gap-3 px-8 py-3 bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 rounded-2xl font-bold hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 border-2 border-blue-200 dark:border-blue-900/50 transform hover:scale-105 active:scale-95"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                                    </svg>
                                    <span className="text-lg">{showComments ? 'Hide Comments' : 'Comments'}</span>
                                    <span className="px-3 py-1 rounded-full text-sm font-bold bg-blue-100 dark:bg-blue-900/40">
                                        {commentCount}
                                    </span>
                                </button>
                            </div>
                            <button
                                onClick={() => navigate(-1)}
                                className="px-6 py-3 text-slate-500 dark:text-slate-400 font-bold hover:text-slate-900 dark:hover:text-white transition-colors text-center order-2 sm:order-2"
                            >
                                ← Back to Innovation Feed
                            </button>
                        </div>

                        {/* Comments Section */}
                        {showComments && (
                            <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800">
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">
                                    Discussion ({commentCount})
                                </h3>

                                {/* Add Comment Input at Top - Always shows when logged in if comments are expanded */}
                                {currentUser ? (
                                    <div className="flex gap-4 mb-10">
                                        <img
                                            src={currentUser.image || authorPlaceholder}
                                            alt={currentUser.name}
                                            className="w-10 h-10 rounded-full object-cover border-2 border-slate-100 dark:border-slate-800 shrink-0"
                                        />
                                        <div className="flex-1">
                                            <form onSubmit={handleAddComment}>
                                                <div className="relative">
                                                    <textarea
                                                        value={newComment}
                                                        onChange={(e) => setNewComment(e.target.value)}
                                                        placeholder="Write a comment..."
                                                        className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl px-5 py-4 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all resize-none"
                                                        rows="2"
                                                    />
                                                    <div className="flex justify-end mt-3">
                                                        <button
                                                            type="submit"
                                                            disabled={submittingComment || !newComment.trim()}
                                                            className="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                                        >
                                                            {submittingComment ? 'Posting...' : 'Post Comment'}
                                                        </button>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="mb-10 p-6 bg-slate-50 dark:bg-slate-900/40 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 text-center">
                                        <p className="text-slate-500 dark:text-slate-400 font-medium mb-3">Login to join the discussion</p>
                                        <button
                                            onClick={() => navigate('/Login')}
                                            className="text-blue-600 font-bold hover:underline"
                                        >
                                            Sign in here
                                        </button>
                                    </div>
                                )}

                                {/* Comments List */}
                                <div className="space-y-8">
                                    {comments.length === 0 ? (
                                        <div className="text-center py-12 bg-slate-50 dark:bg-slate-900/40 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
                                            <p className="text-slate-500 dark:text-slate-400 font-medium">No comments yet. Be the first to start the discussion!</p>
                                        </div>
                                    ) : (
                                        comments.map((comment) => {
                                            const isLikedByMe = currentUser && comment.commentlikes?.some(like => like.userId === currentUser.id);

                                            return (
                                                <div key={comment.id} className="group flex gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                                    <img
                                                        src={comment.user?.image || authorPlaceholder}
                                                        alt={comment.user?.name}
                                                        className="w-10 h-10 rounded-full object-cover border-2 border-slate-100 dark:border-slate-800 shrink-0"
                                                    />
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <h4 className="font-bold text-slate-900 dark:text-white text-sm truncate">
                                                                {comment.user?.name}
                                                            </h4>
                                                            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-tighter">
                                                                {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                                                            </span>
                                                        </div>
                                                        <p className="text-slate-700 dark:text-slate-300 text-[15px] leading-relaxed break-words">
                                                            {comment.content}
                                                        </p>
                                                        <div className="flex items-center gap-6 mt-3">
                                                            <button
                                                                onClick={() => handleLikeComment(comment.id)}
                                                                className={`flex items-center gap-1.5 text-xs font-bold transition-all ${isLikedByMe
                                                                    ? 'text-blue-600 dark:text-blue-400'
                                                                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                                                                    }`}
                                                            >
                                                                <div className={`p-1.5 rounded-full transition-colors ${isLikedByMe
                                                                    ? 'bg-blue-100 dark:bg-blue-900/30'
                                                                    : 'bg-slate-100 dark:bg-slate-800 group-hover:bg-slate-200 dark:group-hover:bg-slate-700'
                                                                    }`}>
                                                                    {isLikedByMe ? <AiFillLike size={14} /> : <AiOutlineLike size={14} />}
                                                                </div>
                                                                {comment.likeCount || 0}
                                                            </button>
                                                            <button className="text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
                                                                Reply
                                                            </button>
                                                            {currentUser && currentUser.id === comment.userId && (
                                                                <button
                                                                    onClick={() => handleDeleteComment(comment.id)}
                                                                    className="text-xs font-bold text-red-500/70 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100"
                                                                >
                                                                    Delete
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default PostDetail;
