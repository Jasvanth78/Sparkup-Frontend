import React, { useState, useEffect } from 'react'
import Navbar from './navbar'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { FcLike } from "react-icons/fc";
import imgPlaceholder from '../assets/robot image.jpg'
import authorPlaceholder from '../assets/author.webp'

const API_URL = 'http://localhost:3000/api/posts'

export default function Home() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(API_URL)
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
  const otherPosts = posts.slice(1)

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-slate-950">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-12 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          <div className="lg:col-span-12 xl:col-span-7">
            {featuredPost ? (
              <Link to={`/post/${featuredPost.id}`} className="group cursor-pointer block">
                <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-slate-800 transition-all hover:shadow-2xl">
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={featuredPost.image || imgPlaceholder}
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

                  <div className="p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <img
                        src={featuredPost.author?.image || authorPlaceholder}
                        className="rounded-full w-10 h-10 object-cover border-2 border-white dark:border-slate-800"
                        alt={featuredPost.author?.name}
                      />
                      <div>
                        <p className="text-sm font-bold text-gray-900 dark:text-white">{featuredPost.author?.name || "Unknown Author"}</p>
                        <p className="text-xs text-gray-500">{new Date(featuredPost.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>

                    <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-4 line-clamp-2 transition-colors group-hover:text-blue-600">
                      {featuredPost.title}
                    </h2>

                    <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed mb-6 line-clamp-3">
                      {featuredPost.content}
                    </p>

                    <div className="inline-flex items-center text-blue-600 font-bold group/link">
                      Read Full Article
                      <span className="ml-2 transition-transform group-hover/link:translate-x-1">→</span>
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

       
          <div className="lg:col-span-12 xl:col-span-5 space-y-8">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <span className="w-8 h-1 bg-blue-600 rounded-full"></span>
              Recent Projects
            </h3>

            <div className="space-y-6">
              {otherPosts.length > 0 ? otherPosts.map((post) => (
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

                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="px-2 py-0.5 bg-gray-100 dark:bg-slate-800 rounded text-[10px] font-medium text-gray-600 dark:text-slate-400">Innovation</span>
                      <span className="px-2 py-0.5 bg-gray-100 dark:bg-slate-800 rounded text-[10px] font-medium text-gray-600 dark:text-slate-400">Tech</span>
                    </div>
                  </div>

                  <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-xl overflow-hidden shrink-0 border border-gray-100 dark:border-slate-800">
                    <img
                      src={post.image || imgPlaceholder}
                      alt={post.title}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                </Link>
              )) : (
                <div className="text-gray-400 text-sm italic py-4">No additional projects available.</div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
