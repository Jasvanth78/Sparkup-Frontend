const getApiBaseUrl = () => {
    const url = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
    return url.replace(/\/$/, '');
};

export const API_BASE_URL = getApiBaseUrl(); 
