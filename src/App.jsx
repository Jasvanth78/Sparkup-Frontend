import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import Login from './Components/Login'
import Home from './Components/Home'
import Settings from './Components/Settings'
import Dashboard from './Components/Dashboard'
import PostIdea from './Components/PostIdea'
import PostDetail from './Components/PostDetail'
import AdminDashboard from './Components/AdminDashboard'
import Teams from './Components/Teams';
import Passwordreset from './Components/Passwordreset'
import Register from './Components/Register'
import Support from './Components/Support'
import ProtectedRoute from './Components/ProtectedRoute'
import Notification from './Components/Notification'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function App() {
  return (
    <div className="bg-white dark:bg-slate-950 min-h-screen w-full transition-colors duration-300">
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/Register" element={<Register />} />
          <Route path="/Home" element={<Home />} />
          <Route path="/Notifications" element={<Notification />} />
          <Route path="/Settings" element={<Settings />} />
          <Route path="/Dashboard" element={<Dashboard />} />
          <Route path="/post-idea" element={<PostIdea />} />
          <Route path="/post/:id" element={<PostDetail />} />
          <Route path="/AdminDashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          <Route path="/Teams" element={<Teams />} />
          <Route path="/Passwordreset" element={<Passwordreset />} />
          <Route path="/Support" element={<Support />} />
        </Routes>
      </Router>
      <ToastContainer position="bottom-right" theme="colored" />
    </div>
  )
}

export default App
