import React, { useState, useEffect } from 'react'
import Navbar from './navbar'
import axios from 'axios'
import { API_BASE_URL } from '../api/config'
import { Link } from 'react-router-dom'

import { AiOutlineLike, AiOutlineMessage } from "react-icons/ai";
import { formatDistanceToNow } from 'date-fns';
const postPlaceholder = "https://images.unsplash.com/photo-1519389950473-acc799a6d401?ixlib=rb-1.2.1&auto=format&fit=crop&w=1480&q=80";
import authorPlaceholder from '../assets/author.webp'

const API_URL = `${API_BASE_URL}/api/posts`


export default function Home() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
        const response = await axios.get(API_URL, config)
        setPosts(response.data)
      } catch (error) {
        console.error("Error fetching posts:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchPosts()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50/50 dark:bg-slate-950">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  const featuredPost = posts[0]
  const sidebarPosts = posts.slice(1, 5) // Next 4 posts for sidebar
  const gridPosts = posts.slice(5) // All remaining posts for the bottom grid

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-slate-950">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-12 lg:px-8">
        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20">
          <div className="lg:col-span-12 xl:col-span-7">
            {featuredPost ? (
              <Link to={`/post/${featuredPost.id}`} className="group cursor-pointer block h-full">
                <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-slate-800 transition-all hover:shadow-2xl h-full flex flex-col">
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={featuredPost.image || postPlaceholder}
                      alt={featuredPost.title}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-6 left-6 flex gap-2">
                      <span className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-xs font-bold text-blue-600 uppercase tracking-wider shadow-sm">Featured</span>
                      <span className={`px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider shadow-sm ${featuredPost.viewStatus === 'PRIVATE' ? 'text-red-500' :
                        featuredPost.viewStatus === 'TEAM' ? 'text-orange-500' : 'text-green-500'
                        }`}>
                        {featuredPost.viewStatus || 'PUBLIC'}
                      </span>
                    </div>
                  </div>

                  <div className="p-8 flex-1 flex flex-col">
                    <div className="flex items-center gap-3 mb-6">
                      <Link to={`/profile/${featuredPost.author?.id}`}>
                        <img
                          src={featuredPost.author?.image || authorPlaceholder}
                          className="rounded-full w-10 h-10 object-cover border-2 border-white dark:border-slate-800 hover:opacity-80 transition-opacity"
                          alt={featuredPost.author?.name}
                        />
                      </Link>
                      <div>
                        <Link to={`/profile/${featuredPost.author?.id}`} className="text-sm font-bold text-gray-900 dark:text-white hover:text-blue-600 transition-colors">
                          {featuredPost.author?.name || "Unknown Author"}
                        </Link>
                        <p className="text-xs text-gray-500">{new Date(featuredPost.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>

                    <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-4 line-clamp-2 transition-colors group-hover:text-blue-600">
                      {featuredPost.title}
                    </h2>

                    <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed mb-6 line-clamp-3">
                      {featuredPost.content}
                    </p>

                    <div className="flex items-center justify-between mt-auto">
                      <div className="inline-flex items-center text-blue-600 font-bold group/link">
                        Read Full Article
                        <span className="ml-2 transition-transform group-hover/link:translate-x-1">→</span>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5 text-slate-500 font-semibold text-sm">
                          <AiOutlineLike className="text-lg" />
                          <span>{featuredPost._count?.likes || 0}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-500 font-semibold text-sm">
                          <AiOutlineMessage className="text-lg" />
                          <span>{featuredPost._count?.comments || 0}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ) : (
              <div className="bg-gray-100 dark:bg-slate-800 rounded-3xl h-[600px] flex items-center justify-center text-gray-400 italic">
                No featured projects yet
              </div>
            )}
          </div>

          <div className="lg:col-span-12 xl:col-span-5 flex flex-col">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-8">
              <span className="w-8 h-1 bg-blue-600 rounded-full"></span>
              Recent Projects
            </h3>

            <div className="space-y-6 flex-1">
              {sidebarPosts.length > 0 ? sidebarPosts.map((post) => (
                <Link to={`/post/${post.id}`} key={post.id} className="group flex gap-5 items-start bg-white dark:bg-slate-900 p-4 rounded-2xl border border-gray-100 dark:border-slate-800 hover:shadow-lg transition-all cursor-pointer block">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                      <span>•</span>
                      <span className="text-blue-500">{post.author?.name || "Member"}</span>
                      <span>•</span>
                      <span className={`${post.viewStatus === 'PRIVATE' ? 'text-red-500' :
                        post.viewStatus === 'TEAM' ? 'text-orange-500' : 'text-green-500'
                        }`}>
                        {post.viewStatus || 'PUBLIC'}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-gray-900 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {post.title}
                    </h4>

                    <div className="flex items-center justify-between gap-2 mt-3">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1 text-slate-400 font-bold text-[11px]">
                          <AiOutlineLike size={14} />
                          <span>{post._count?.likes || 0}</span>
                        </div>
                        <div className="flex items-center gap-1 text-slate-400 font-bold text-[11px]">
                          <AiOutlineMessage size={14} />
                          <span>{post._count?.comments || 0}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 border border-gray-100 dark:border-slate-800">
                    <img
                      src={post.image || postPlaceholder}
                      alt={post.title}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                </Link>
              )) : (
                <div className="text-gray-400 text-sm italic py-4 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-gray-200 dark:border-slate-800 text-center">No additional projects available.</div>
              )}
            </div>
          </div>
        </div>

        {/* Grid Section */}
        {gridPosts.length > 0 && (
          <section className="animate-fadeIn">
            <div className="flex items-center justify-between mb-10">
              <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
                <span className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl text-blue-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                </span>
                Explore More Innovations
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {gridPosts.map((post) => (
                <Link to={`/post/${post.id}`} key={post.id} className="group bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden hover:shadow-2xl transition-all duration-500 flex flex-col h-full">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img
                      src={post.image || postPlaceholder}
                      alt={post.title}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute top-4 right-4">
                      <span className={`px-3 py-1 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg ${post.viewStatus === 'PRIVATE' ? 'text-red-500' :
                        post.viewStatus === 'TEAM' ? 'text-orange-500' : 'text-green-500'
                        }`}>
                        {post.viewStatus || 'PUBLIC'}
                      </span>
                    </div>
                  </div>

                  <div className="p-7 flex-1 flex flex-col">
                    <div className="flex items-center gap-2 mb-4">
                      <img
                        src={post.author?.image || authorPlaceholder}
                        className="w-6 h-6 rounded-full object-cover border border-gray-200 dark:border-slate-700"
                        alt={post.author?.name}
                      />
                      <span className="text-xs font-bold text-gray-500 dark:text-slate-400">{post.author?.name}</span>
                    </div>

                    <h4 className="text-xl font-black text-gray-900 dark:text-white mb-3 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
                      {post.title}
                    </h4>

                    <p className="text-sm text-gray-500 dark:text-slate-400 line-clamp-2 mb-6 leading-relaxed italic">
                      "{post.content}"
                    </p>

                    <div className="mt-auto pt-6 border-t border-gray-50 dark:border-slate-800 flex items-center justify-between">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </span>

                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5 text-slate-400 font-bold text-xs">
                          <AiOutlineLike size={16} />
                          <span>{post._count?.likes || 0}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-400 font-bold text-xs">
                          <AiOutlineMessage size={16} />
                          <span>{post._count?.comments || 0}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  )
}

