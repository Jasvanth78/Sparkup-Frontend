import React, { useState } from "react";
import { FiMail, FiMessageSquare, FiHeadphones, FiExternalLink, FiClock, FiBookOpen, FiX } from "react-icons/fi";
import Navbar from "./navbar";
import { CiClock1 } from "react-icons/ci";

const supportChannels = [
  {
    title: "Email support",
    description: "For account, access, or billing questions. We reply within one business day.",
    action: "support@sparkup.app",
    href: "mailto:support@sparkup.app",
    icon: <FiMail className="w-5 h-5" />,
  },
  {
    title: "Message the team",
    description: "Need a quick pointer on using SparkUp? Drop us a note and we'll guide you.",
    action: "Send a message",
    href: "mailto:support@sparkup.app?subject=SparkUp%20Help",
    icon: <FiMessageSquare className="w-5 h-5" />,
  },
  {
    title: "Book a call",
    description: "Schedule a 15-minute call to troubleshoot together or walk through a feature.",
    action: "Pick a time",
    href: "https://cal.com/", // Placeholder; replace with your scheduling link
    icon: <FiHeadphones className="w-5 h-5" />,
  },
];

const faqs = [
  {
    question: "I can't log in as admin — what should I check first?",
    answer: "Make sure your admin account is approved, your password is correct, and you are using the latest login URL. If you use SSO, confirm you're signed in with the right workspace account.",
  },
  {
    question: "Where can I see system status?",
    answer: "You can monitor uptime and incident history on the status page. Subscribe there for alerts.",
    href: "https://status.sparkup.app",
  },
  {
    question: "How do I request a new feature?",
    answer: "Send your use-case and any screenshots to support@sparkup.app. Our product team reviews requests weekly.",
  },
  {
    question: "What's the fastest way to get help?",
    answer: "Email with a clear subject, steps to reproduce, screenshots, and the time the issue occurred. This cuts down back-and-forth and speeds up resolution.",
  },
];

const Support = () => {
  const [comments, setComments] = useState([
    {
      id: 1,
      author: "John Doe",
      avatar: "JD",
      timestamp: "2 hours ago",
      text: "Great support resources! Really helped me get started.",
      likes: 5
    },
    {
      id: 2,
      author: "Sarah Johnson",
      avatar: "SJ",
      timestamp: "1 day ago",
      text: "The email support team was super helpful with my issue.",
      likes: 3
    },
    {
      id: 3,
      author: "Mike Chen",
      avatar: "MC",
      timestamp: "3 days ago",
      text: "Quick response time, very impressed with the service!",
      likes: 8
    }
  ]);

  const [showCommentModal, setShowCommentModal] = useState(false);
  const [commentText, setCommentText] = useState("");

  const handleAddComment = () => {
    if (commentText.trim()) {
      const newComment = {
        id: comments.length + 1,
        author: "You",
        avatar: "YO",
        timestamp: "just now",
        text: commentText,
        likes: 0
      };
      setComments([newComment, ...comments]);
      setCommentText("");
      setShowCommentModal(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500 text-white p-8 sm:p-10 shadow-xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.15),transparent_25%)]" aria-hidden="true"></div>
          <div className="relative z-10 grid gap-6 md:grid-cols-3 md:items-center">
            <div className="md:col-span-2 space-y-4">
              <p className="inline-flex items-center text-xs font-semibold uppercase tracking-[0.2em] text-white/80 bg-white/10 px-3 py-1 rounded-full border border-white/20">Support</p>
              <h1 className="text-3xl sm:text-4xl font-bold leading-tight">Help & Support</h1>
              <p className="text-white/80 max-w-2xl">
                Stuck, curious, or shipping something new? We respond quickly and keep you moving.
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href="mailto:support@sparkup.app"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-blue-700 font-semibold shadow-sm hover:shadow-md transition-all"
                >
                  Contact support
                </a>
                <a
                  href="https://status.sparkup.app"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-white/40 text-white font-semibold hover:bg-white/10 transition-colors"
                >
                  View status
                  <FiExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
            <div className="md:justify-self-end">
              <div className="rounded-2xl bg-white/10 border border-white/20 p-4 backdrop-blur shadow-lg">
                <p className="text-sm text-white/80">Average first response</p>
                <p className="text-3xl font-bold"> <CiClock1 /> 1 hour</p>
                <p className="text-sm text-white/80 mt-2">Weekdays 9am–6pm</p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-3">
          {supportChannels.map((channel) => (
            <div key={channel.title} className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-200 flex items-center justify-center">
                  {channel.icon}
                </div>
                <FiExternalLink className="w-4 h-4 text-slate-400" />
              </div>
              <h2 className="text-lg font-semibold mb-2">{channel.title}</h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">{channel.description}</p>
              <a
                href={channel.href}
                className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 inline-flex items-center gap-2"
              >
                {channel.action}
              </a>
            </div>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-3 items-start">
          <div className="lg:col-span-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <FiBookOpen className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-semibold">Common questions</h2>
            </div>
            <div className="divide-y divide-slate-200 dark:divide-slate-800">
              {faqs.map((faq) => (
                <details key={faq.question} className="group py-3" open={faq.question.includes("fastest")}> 
                  <summary className="flex items-center justify-between cursor-pointer list-none">
                    <span className="font-medium text-slate-800 dark:text-slate-100 group-open:text-blue-600">{faq.question}</span>
                    <span className="text-slate-400 group-open:rotate-180 transition-transform">⌄</span>
                  </summary>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                    {faq.answer}
                    {faq.href && (
                      <a
                        href={faq.href}
                        className="ml-2 text-blue-600 dark:text-blue-400 font-semibold inline-flex items-center gap-1"
                        target="_blank"
                        rel="noreferrer"
                      >
                        View status
                        <FiExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </p>
                </details>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <FiClock className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold">Hours & response</h3>
              </div>
              <ul className="text-sm text-slate-700 dark:text-slate-300 space-y-1">
                <li><span className="font-semibold">Weekdays:</span> 9:00 – 18:00 (local)</li>
                <li><span className="font-semibold">Weekends:</span> Critical issues only</li>
                <li><span className="font-semibold">SLA:</span> First reply &lt; 1 hour, resolution updates every 24 hours</li>
              </ul>
            </div>

            <div className="rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6 shadow-lg">
              <p className="text-sm text-white/80">High priority?</p>
              <h3 className="text-xl font-semibold mb-2">Include steps, screenshots, and timestamps</h3>
              <p className="text-sm text-white/80 mb-4">This speeds up triage and gets you to a fix faster.</p>
              <a
                href="mailto:support@sparkup.app?subject=High%20priority%20issue&body=Describe%20what%20happened%2C%20steps%20to%20reproduce%2C%20and%20when%20it%20occurred."
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-slate-900 font-semibold shadow-sm hover:shadow-md transition-all"
              >
                Email priority issue
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Comments Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <FiMessageSquare className="w-6 h-6 text-blue-600" />
            Comments
          </h2>

          {/* Comments List */}
          <div className="space-y-4 mb-8">
            {comments.map((comment) => (
              <div key={comment.id} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 hover:shadow-md transition-shadow">
                <div className="flex gap-4">
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-semibold">
                      {comment.avatar}
                    </div>
                  </div>
                  
                  {/* Comment Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-slate-900 dark:text-white">{comment.author}</span>
                      <span className="text-sm text-slate-500 dark:text-slate-400">{comment.timestamp}</span>
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 mb-3">{comment.text}</p>
                    <button className="text-sm text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">
                      👍 {comment.likes > 0 && comment.likes}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add Comment Button */}
          <button
            onClick={() => setShowCommentModal(true)}
            className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <FiMessageSquare className="w-5 h-5" />
            Add Your Comment
          </button>
        </div>
      </section>

      {/* Comment Modal */}
      {showCommentModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Add a Comment</h3>
              <button
                onClick={() => {
                  setShowCommentModal(false);
                  setCommentText("");
                }}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Share your thoughts or feedback about our support..."
                className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 resize-none"
                rows="4"
              />

              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => {
                    setShowCommentModal(false);
                    setCommentText("");
                  }}
                  className="px-6 py-2 rounded-lg text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddComment}
                  disabled={!commentText.trim()}
                  className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Post
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default Support;