import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { FaPlus, FaBell } from "react-icons/fa";
import { useTheme } from "../Context/ThemeContext";

const ProfileMenu = ({ user }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const defaultAvatar = "https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1480&q=80";

  return (
    <div className="relative">
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="flex items-center gap-2 rounded-full p-1 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
      >
        <img
          src={user?.image || defaultAvatar}
          alt="User avatar"
          className="w-8 h-8 rounded-full object-cover border border-gray-200 dark:border-slate-700"
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${isMenuOpen ? "rotate-180" : ""}`}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      {isMenuOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl shadow-lg py-2 z-50">
          <div className="px-4 py-2 border-b border-gray-50 dark:border-slate-800 mb-1">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Account</p>
          </div>
          <Link to="/Dashboard" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-gray-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            </svg>
            My Profile
          </Link>
          <Link to="/Settings" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-gray-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.592c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 0 1 0 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 0 1-.22.128c-.332.183-.582.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 0 1 0-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            </svg>
            Settings
          </Link>

          <div className="px-4 py-2 border-t border-gray-50 dark:border-slate-800 mt-1">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Preferences</p>
            <button
              onClick={toggleTheme}
              className="flex items-center justify-between w-full px-2 py-1.5 rounded-lg text-sm text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
            >
              <div className="flex items-center gap-2">
                {theme === 'light' ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-orange-500">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M3 12h2.25m.386-6.364 1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M3 12h2.25m.386-6.364 1.591-1.591M12 7.5a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9Z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-blue-400">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
                  </svg>
                )}
                <span>{theme === 'light' ? 'Light Mode' : 'Dark Mode'}</span>
              </div>
              <div className={`w-8 h-4 rounded-full p-0.5 transition-colors duration-200 ${theme === 'dark' ? 'bg-blue-600' : 'bg-gray-200'}`}>
                <div className={`w-3 h-3 bg-white rounded-full shadow-sm transform transition-transform duration-200 ${theme === 'dark' ? 'translate-x-4' : 'translate-x-0'}`}></div>
              </div>
            </button>
          </div>

          <hr className="my-1 border-gray-100 dark:border-slate-800" />
          <button
            onClick={() => {
              localStorage.removeItem('token');
              window.location.href = '/';
            }}
            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
            </svg>
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
};

const NavList = ({ user }) => {
  const allItems = [
    { label: "Home", href: "/Home", public: true },
    { label: "Teams", href: "/Teams", public: true },
    { label: "Dashboard", href: "/AdminDashboard", adminOnly: true },
    { label: "Users", href: "#", adminOnly: true },
    { label: "Pending Requests", href: "#", adminOnly: true },
    { label: "Help & Support", href: "/Support", public: true },
  ];

  const filteredItems = allItems.filter(item => {
    if (item.adminOnly) return user?.role === "ADMIN";
    return true;
  });

  return (
    <ul className="flex flex-col gap-2 lg:flex-row lg:items-center lg:gap-6">
      {filteredItems.map((item) => (
        <li key={item.label}>
          <Link
            to={item.href}
            className="text-sm font-medium text-gray-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors px-2 py-1"
          >
            {item.label}
          </Link>
        </li>
      ))}
    </ul>
  );
};

const Navbar = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();

  const fetchUnreadCount = async (token, role) => {
    try {
      if (!token) return;
      const userId = parseJwt(token).id;
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}api/notifications/unread/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUnreadCount(response.data.unreadCount);
    } catch (error) {
      console.error("Failed to fetch unread count", error);
    }
  };

  const parseJwt = (token) => {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      return {};
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');

        if (token) {
          const endpoint = role === 'ADMIN'
            ? `${import.meta.env.VITE_API_BASE_URL}api/admin/me`
            : `${import.meta.env.VITE_API_BASE_URL}api/users/me`;

          const response = await axios.get(endpoint, {
            headers: { Authorization: `Bearer ${token}` }
          });

          if (role === 'ADMIN') {
            // Normalize admin data to match user structure expected by UI
            setUser({
              ...response.data,
              name: 'Admin', // Admin model doesn't have name
              // Use existing image or fallback will handle it
            });
          } else {
            setUser(response.data);
          }
          fetchUnreadCount(token, role);
        }
      } catch (error) {
        console.error("Failed to fetch user in navbar", error);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setIsNavOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <nav className="sticky top-0 z-[100] w-full bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-gray-100 dark:border-slate-800 transition-colors duration-300 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            <div className="flex-shrink-0 flex items-center">
              <Link to="/Home" className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                SparkUp
              </Link>
            </div>

            <div className="hidden lg:flex items-center space-x-8">
              <NavList user={user} />
            </div>


            <div className="hidden lg:flex items-center gap-4">
              <button className="text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg shadow-sm transition-all focus:ring-2 focus:ring-blue-500/20 cursor-pointer">
                Invite Your Friends
              </button>

              <Link to="/Notifications" className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">
                <FaBell className="w-5 h-5 text-gray-600 dark:text-slate-400" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                  </span>
                )}
              </Link>

              <div className="h-6 w-px bg-gray-200 dark:bg-slate-800 mx-1"></div>
              <ProfileMenu user={user} />
            </div>


            <div className="flex lg:hidden items-center gap-3">
              <ProfileMenu user={user} />
              <button
                onClick={() => setIsNavOpen(!isNavOpen)}
                className="p-2 rounded-lg text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 focus:outline-none transition-colors"
              >
                <span className="sr-only">Open main menu</span>
                {isNavOpen ? (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>


        <div
          className={`lg:hidden transition-all duration-300 ease-in-out overflow-hidden ${isNavOpen ? "max-h-96 border-t border-gray-100 dark:border-slate-800 opacity-100" : "max-h-0 opacity-0"
            }`}
        >
          <div className="px-4 pt-2 pb-6 space-y-4 bg-white dark:bg-slate-900 shadow-xl">
            <NavList user={user} />
          </div>
        </div>
      </nav>
      {/* Global New Post FAB */}
      <button
        onClick={() => navigate('/post-idea')}
        className="fixed bottom-6 right-6 z-50 p-4 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-110 active:scale-95 transition-all duration-300 group"
        aria-label="Create New Post"
      >
        <FaPlus className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
      </button>
    </>
  );
};

export default Navbar;

