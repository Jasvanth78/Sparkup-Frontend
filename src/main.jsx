import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ThemeProvider } from './Context/ThemeContext';
import { HashRouter } from 'react-router-dom';

createRoot(document.getElementById('root')).render(
 
    <ThemeProvider>
      <HashRouter>
      <App />
      </HashRouter>
      <ToastContainer />
    </ThemeProvider>

)
