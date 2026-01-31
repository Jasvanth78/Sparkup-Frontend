import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
    FaPlus, FaUsers, FaUserPlus, FaTrash, FaSignOutAlt,
    FaTimes, FaSearch, FaPaperPlane, FaShareAlt, FaEllipsisH,
    FaRegFileAlt, FaChevronRight, FaInfoCircle, FaRocket, FaUserFriends
} from 'react-icons/fa';
import Navbar from './navbar';

const Teams = () => {
    const [teams, setTeams] = useState([]);
    const [activeTeam, setActiveTeam] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showManageModal, setShowManageModal] = useState(false);

    const [newTeamName, setNewTeamName] = useState("");
    const [newTeamDesc, setNewTeamDesc] = useState("");
    const [searchUser, setSearchUser] = useState("");
    const [foundUsers, setFoundUsers] = useState([]);

    const chatEndRef = useRef(null);
    const token = localStorage.getItem('token');
    const currentUser = JSON.parse(localStorage.getItem('user')) || {};

    useEffect(() => {
        fetchTeams();
    }, []);

    useEffect(() => {
        if (activeTeam) {
            fetchMessages(activeTeam.id);
            const interval = setInterval(() => fetchMessages(activeTeam.id), 5000);
            return () => clearInterval(interval);
        }
    }, [activeTeam]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const fetchTeams = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}api/teams/my-teams`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const all = [...response.data.createdTeams, ...response.data.memberTeams];
            const unique = Array.from(new Map(all.map(item => [item.id, item])).values());
            setTeams(unique);
            if (unique.length > 0 && !activeTeam) setActiveTeam(unique[0]);
            setLoading(false);
        } catch (error) {
            toast.error("Failed to load workspace");
            setLoading(false);
        }
    };

    const fetchMessages = async (teamId) => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}api/teams/${teamId}/messages`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessages(res.data);
        } catch (e) { console.error(e); }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !activeTeam) return;
        try {
            const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}api/teams/${activeTeam.id}/messages`,
                { content: newMessage },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMessages([...messages, res.data]);
            setNewMessage("");
        } catch (e) { toast.error("Send failed"); }
    };

    const handleCreateTeam = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${import.meta.env.VITE_API_BASE_URL}api/teams`,
                { name: newTeamName, description: newTeamDesc },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success("Team Launched!");
            setShowCreateModal(false);
            setNewTeamName(""); setNewTeamDesc("");
            fetchTeams();
        } catch (e) { toast.error("Creation failed"); }
    };

    const handleSearchUsers = async () => {
        if (!searchUser) return;
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}api/users`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const filtered = response.data.filter(u =>
                u.name.toLowerCase().includes(searchUser.toLowerCase()) ||
                u.email.toLowerCase().includes(searchUser.toLowerCase())
            );
            setFoundUsers(filtered.slice(0, 5));
        } catch (error) {
            toast.error("Failed to search users");
        }
    };

    const handleAddMember = async (userId) => {
        try {
            await axios.post(`${import.meta.env.VITE_API_BASE_URL}api/teams/${activeTeam.id}/members`,
                { userId },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success("Member added!");
            setSearchUser("");
            setFoundUsers([]);
            const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}api/teams/${activeTeam.id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setActiveTeam(response.data);
            fetchTeams();
        } catch (error) {
            toast.error(error.response?.data?.error || "Failed to add member");
        }
    };

    const handleRemoveMember = async (userId) => {
        if (!window.confirm("Remove this member?")) return;
        try {
            await axios.delete(`${import.meta.env.VITE_API_BASE_URL}api/teams/${activeTeam.id}/members/${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success("Member removed");
            const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}api/teams/${activeTeam.id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setActiveTeam(response.data);
            fetchTeams();
        } catch (error) {
            toast.error(error.response?.data?.error || "Failed to remove member");
        }
    };

    const handleDeleteTeam = async () => {
        if (!window.confirm("FATAL: Delete workspace?")) return;
        try {
            await axios.delete(`${import.meta.env.VITE_API_BASE_URL}api/teams/${activeTeam.id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success("Team deleted");
            setActiveTeam(null);
            setShowManageModal(false);
            fetchTeams();
        } catch (error) { toast.error("Failed to delete"); }
    };

    if (loading) return (
        <div className="h-screen bg-[#F8FAFC] flex items-center justify-center">
            <div className="relative">
                <div className="w-16 h-16 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
        </div>
    );

    return (
        <div className="h-screen flex flex-col bg-[#F8FAFC] dark:bg-slate-950 font-sans overflow-hidden">
            <Navbar />

            <div className="flex-1 flex overflow-hidden relative ">

                <div className="absolute top-[-10%] left-[-10%] w-[20%] h-[80%] bg-blue-500/10 blur-[120px] rounded-full"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full"></div>


                <nav className="w-20 sm:w-24 md:w-32 flex flex-col items-center py-12 sm:py-16 md:py-20 gap-4 sm:gap-6 z-20 border-r border-slate-200/50 dark:border-slate-800/50 bg-white/30 dark:bg-slate-900/30 backdrop-blur-xl ">
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-2xl sm:rounded-3xl bg-white dark:bg-slate-800 shadow-lg shadow-blue-500/10 flex items-center justify-center text-blue-600 hover:scale-110 transition-transform active:scale-95"
                    >
                        <FaPlus size={16} className="sm:w-5 sm:h-5" />
                    </button>

                    <div className="w-10 sm:w-12 md:w-16 h-[2px] bg-slate-200 dark:bg-slate-800 rounded-full"></div>

                    <div className="flex-1 flex flex-col gap-3 sm:gap-4 md:gap-6 overflow-y-auto no-scrollbar scroll-smooth">
                        {teams.map(team => (
                            <div key={team.id} className="relative group">
                                <button
                                    onClick={() => setActiveTeam(team)}
                                    className={`w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full overflow-hidden transition-all duration-300 relative ${activeTeam?.id === team.id ? 'scale-110 rounded-[1.2rem] shadow-2xl shadow-blue-500/20' : 'hover:rounded-[1.2rem]'}`}
                                >
                                    <div className={`absolute inset-0 bg-gradient-to-br ${activeTeam?.id === team.id ? 'from-blue-600 to-indigo-700' : 'from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800'} flex items-center justify-center text-white font-bold text-xs sm:text-sm`}>
                                        {team.name[0]}
                                    </div>
                                    <img
                                        src={`https://ui-avatars.com/api/?name=${team.name}&background=random`}
                                        className={`w-full h-full object-cover transition-opacity duration-300 ${activeTeam?.id === team.id ? 'opacity-0' : 'opacity-100 group-hover:opacity-0'}`}
                                        alt=""
                                    />
                                </button>
                                {activeTeam?.id === team.id && (
                                    <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-1.5 sm:w-2 h-6 sm:h-8 bg-blue-600 rounded-r-full animate-in slide-in-from-left-full"></div>
                                )}

                                <div className="absolute left-full ml-2 sm:ml-4 px-2 sm:px-3 py-1 bg-slate-900 text-white text-[10px] sm:text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
                                    {team.name}
                                </div>
                            </div>
                        ))}
                    </div>
                </nav>


                <main className="flex-1 flex flex-col p-2 sm:p-4 md:p-8 overflow-hidden z-10">
                    {activeTeam ? (
                        <div className="flex-1 flex flex-col bg-white/40 dark:bg-slate-900/40 backdrop-blur-3xl rounded-[3rem] border border-white/40 dark:border-slate-800/40 shadow-2xl shadow-slate-200/50 dark:shadow-none overflow-hidden animate-in fade-in zoom-in-95 duration-500">


                            <header className="p-4 sm:p-6 md:p-8 md:px-12 md:py-10 border-b border-slate-200/30 dark:border-slate-800/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <div className="space-y-1 flex-1">
                                    <div className="flex items-center gap-2 sm:gap-3">
                                        <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-800 dark:text-white tracking-tight">{activeTeam.name}</h2>
                                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                    </div>
                                    <p className="text-xs sm:text-sm font-medium text-slate-400 leading-relaxed max-w-lg truncate">{activeTeam.description || "Building the future of innovation."}</p>
                                </div>
                                <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto justify-between sm:justify-end">
                                    <div className="flex -space-x-2 sm:-space-x-3 hover:space-x-0.5 sm:hover:space-x-1 transition-all">
                                        {activeTeam.members?.slice(0, 3).map((m, i) => (
                                            <div key={i} className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-white dark:border-slate-900 bg-slate-100 shadow-lg overflow-hidden cursor-help" title={m.user.name}>
                                                <img src={`https://ui-avatars.com/api/?name=${m.user.name}&background=random`} alt="" />
                                            </div>
                                        ))}
                                        {activeTeam.members?.length > 3 && (
                                            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-white dark:border-slate-900 bg-slate-200 dark:bg-slate-700 shadow-lg flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-300">
                                                +{activeTeam.members.length - 3}
                                            </div>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => setShowManageModal(true)}
                                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-blue-600 hover:bg-white dark:hover:bg-slate-700 transition-all flex items-center justify-center"
                                    >
                                        <FaInfoCircle size={18} className="sm:w-5 sm:h-5" />
                                    </button>
                                </div>
                            </header>


                            <div className="flex-1 overflow-y-auto px-4 py-10 space-y-8 custom-scrollbar scroll-smooth">
                                {messages.length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center text-center space-y-6 opacity-40">
                                        <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-[250px] flex items-center justify-center text-slate-400">
                                            <FaRocket size={32} />
                                        </div>
                                        <div className="space-y-1">
                                            <h3 className="text-xl font-bold text-slate-800 dark:text-white">Workspace Initialized</h3>
                                            <p className="text-sm">Start the conversation with your team.</p>
                                        </div>
                                    </div>
                                ) : (
                                    messages.map((msg, idx) => {
                                        const isMe = msg.senderId === currentUser.id;
                                        return (
                                            <div key={idx} className={`flex items-start gap-5 group animate-in slide-in-from-bottom-2 duration-300`}>
                                                <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 shadow-sm overflow-hidden shrink-0 ">
                                                    <img src={`https://ui-avatars.com/api/?name=${msg.sender.name}&background=random`} alt="" />
                                                </div>
                                                <div className="flex-1 space-y-2">
                                                    <div className="flex items-baseline gap-3">
                                                        <span className={`font-bold text-sm ${isMe ? 'text-blue-600' : 'text-slate-800 dark:text-slate-200'}`}>
                                                            {msg.sender.name}
                                                        </span>
                                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </span>
                                                    </div>
                                                    <div className={`p-5 rounded-[1.5rem] text-sm leading-relaxed max-w-2xl shadow-sm border ${isMe ? 'bg-blue-600 text-white border-blue-500' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-100 dark:border-slate-800'}`}>
                                                        {msg.content}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                                <div ref={chatEndRef} />
                            </div>


                            <div className="p-3 sm:p-4 md:p-6 lg:p-8 bg-white/50 dark:bg-slate-900/50 border-t border-slate-200/30 dark:border-slate-800/30">
                                <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto flex gap-2 sm:gap-3 md:gap-4">
                                    <div className="flex-1 relative group">
                                        <input
                                            type="text"
                                            value={newMessage}
                                            onChange={(e) => setNewMessage(e.target.value)}
                                            placeholder="Write an update..."
                                            className="w-full bg-white dark:bg-slate-800 border-none rounded-full sm:rounded-[2rem] px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-5 text-sm sm:text-base text-slate-800 dark:text-white shadow-xl shadow-slate-200/20 dark:shadow-none focus:ring-2 focus:ring-blue-500/10 transition-all outline-none"
                                        />
                                        <FaSearch className="hidden sm:block absolute right-6 md:right-8 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={14} />
                                    </div>
                                    <button className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full sm:rounded-[2rem] bg-blue-600 text-white shadow-xl shadow-blue-500/40 hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all flex items-center justify-center shrink-0">
                                        <FaPaperPlane size={16} className="sm:w-5 sm:h-5" />
                                    </button>
                                </form>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-8 animate-in fade-in duration-700">
                            <div className="w-32 h-32 bg-blue-500/5 rounded-full flex items-center justify-center relative">
                                <div className="absolute inset-0 bg-blue-500/10 blur-2xl animate-pulse"></div>
                                <FaUserFriends size={56} className="text-blue-500 relative" />
                            </div>
                            <div className="space-y-3">
                                <h2 className="text-4xl font-black text-slate-800 dark:text-white tracking-tight">Your Innovation Pods</h2>
                                <p className="text-slate-500 max-w-sm mx-auto leading-relaxed font-medium">Select a workspace from the left panel or create a new one to start collaborating.</p>
                            </div>
                            <button
                                onClick={() => setShowCreateModal(true)}
                                className="px-10 py-5 bg-white dark:bg-slate-900 text-slate-800 dark:text-white rounded-[2rem] shadow-2xl shadow-slate-200 dark:shadow-none font-bold hover:scale-105 transition-all active:scale-95 flex items-center gap-3 border border-slate-100 dark:border-slate-800"
                            >
                                <FaPlus className="text-blue-600" /> Start New
                            </button>
                        </div>
                    )}
                </main>
            </div>


            {/* {activeTeam && (
                // <button
                //     onClick={() => { }}
                //     className="fixed bottom-10 right-10 w-8 h-8 rounded-full bg-white dark:bg-slate-800 shadow-2xl shadow-slate-400/20 dark:shadow-none flex items-center justify-center text-blue-600 hover:scale-110 active:scale-95 transition-all z-50 border border-slate-200 dark:border-slate-800"
                // >
                //     <FaShareAlt size={20} />
                // </button>
            )} */}


            {showCreateModal && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl sm:rounded-[3rem] p-6 sm:p-8 md:p-10 shadow-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6 sm:mb-8 md:mb-10">
                            <div>
                                <h3 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white tracking-tight">New Pod</h3>
                                <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Initialize Collaboration</p>
                            </div>
                            <button onClick={() => setShowCreateModal(false)} className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center transition-colors">
                                <FaTimes size={16} className="sm:w-5 sm:h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleCreateTeam} className="space-y-6 sm:space-y-8">
                            <div className="space-y-3">
                                <label className="text-sm font-bold text-slate-400 px-2 uppercase tracking-widest">Workspace Name</label>
                                <input
                                    required type="text" value={newTeamName}
                                    onChange={(e) => setNewTeamName(e.target.value)}
                                    className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl px-6 py-5 text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500/10 transition-all outline-none"
                                    placeholder="e.g. Project Aurora"
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-sm font-bold text-slate-400 px-2 uppercase tracking-widest">Mission Statement</label>
                                <textarea
                                    rows="3" value={newTeamDesc}
                                    onChange={(e) => setNewTeamDesc(e.target.value)}
                                    className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl px-6 py-5 text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500/10 transition-all outline-none"
                                    placeholder="Definte the mission objective..."
                                />
                            </div>
                            <button className="w-full py-5 bg-blue-600 text-white font-black rounded-3xl shadow-xl shadow-blue-500/30 hover:bg-blue-700 transition-all active:scale-95 uppercase tracking-widest">
                                Launch Workspace
                            </button>
                        </form>
                    </div>
                </div>
            )}


            {showManageModal && activeTeam && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-3xl rounded-3xl sm:rounded-[3.5rem] p-6 sm:p-8 md:p-12 shadow-2xl flex flex-col max-h-[90vh]">
                        <div className="flex justify-between items-center mb-6 sm:mb-8 md:mb-10">
                            <div>
                                <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-800 dark:text-white tracking-tight">Hub Controls</h3>
                                <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Manage participants</p>
                            </div>
                            <button onClick={() => setShowManageModal(false)} className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-xl sm:rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center transition-colors">
                                <FaTimes size={20} className="sm:w-6 sm:h-6" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto space-y-8 sm:space-y-12 pr-2 sm:pr-4 custom-scrollbar">
                            <section className="space-y-4 sm:space-y-6">
                                <h4 className="text-xs sm:text-sm font-bold text-slate-400 uppercase tracking-widest px-2">Invite Participants</h4>
                                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                                    <input
                                        type="text"
                                        value={searchUser}
                                        onChange={(e) => {
                                            setSearchUser(e.target.value);
                                            if (e.target.value.length > 2) handleSearchUsers();
                                        }}
                                        className="flex-1 bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl px-6 py-5 outline-none focus:ring-2 focus:ring-blue-500/10"
                                        placeholder="Search by name or email..."
                                    />
                                    <button onClick={handleSearchUsers} className="px-6 sm:px-8 py-4 sm:py-auto bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all whitespace-nowrap">Search</button>
                                </div>
                                {foundUsers.map(user => (
                                    <div key={user.id} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl flex items-center justify-between animate-in slide-in-from-top-2">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-700 flex items-center justify-center font-bold text-blue-600 shadow-sm">{user.name[0]}</div>
                                            <div>
                                                <p className="font-bold text-slate-800 dark:text-white">{user.name}</p>
                                                <p className="text-xs text-slate-400">{user.email}</p>
                                            </div>
                                        </div>
                                        <button onClick={() => handleAddMember(user.id)} className="p-3 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all"><FaUserPlus /></button>
                                    </div>
                                ))}
                            </section>

                            <section className="space-y-4 sm:space-y-6">
                                <h4 className="text-xs sm:text-sm font-bold text-slate-400 uppercase tracking-widest px-2">Active Core ({activeTeam.members?.length})</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                    {activeTeam.members?.map(m => (
                                        <div key={m.userId} className="p-5 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-3xl flex items-center justify-between group">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl overflow-hidden shadow-sm">
                                                    <img src={`https://ui-avatars.com/api/?name=${m.user.name}&background=random`} alt="" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-800 dark:text-white">{m.user.name}</p>
                                                    <p className="text-[10px] text-blue-500 uppercase font-black">{m.role}</p>
                                                </div>
                                            </div>
                                            {activeTeam.creatorId === currentUser.id && m.userId !== currentUser.id && (
                                                <button onClick={() => handleRemoveMember(m.userId)} className="p-3 text-red-400 opacity-0 group-hover:opacity-100 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all"><FaTrash size={14} /></button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </div>

                        <div className="pt-6 sm:pt-8 mt-6 sm:mt-10 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row gap-3 sm:gap-0 justify-between items-stretch sm:items-center">
                            {activeTeam.creatorId === currentUser.id ? (
                                <button onClick={handleDeleteTeam} className="text-red-500 text-sm sm:text-base font-bold hover:underline order-2 sm:order-1">Self-Destruct Workspace</button>
                            ) : (
                                <button className="text-slate-400 text-sm sm:text-base font-bold hover:text-slate-600 flex items-center justify-center sm:justify-start gap-2 order-2 sm:order-1"><FaSignOutAlt /> Abandon Pod</button>
                            )}
                            <button onClick={() => setShowManageModal(false)} className="px-6 sm:px-10 py-3 sm:py-4 bg-slate-900 text-white font-bold rounded-2xl order-1 sm:order-2">Return to Hub</button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.05); border-radius: 10px; }
                .dark .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); }
            `}</style>
        </div>
    );
};

export default Teams;
