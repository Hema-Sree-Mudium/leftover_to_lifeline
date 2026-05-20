import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'https://leftover-to-lifeline.onrender.com/api',
    withCredentials: true, 
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
});

// --- THE FIX: THE AXIOS INTERCEPTOR ---
// This runs automatically before EVERY request sent by 'api'
api.interceptors.request.use(
    (config) => {
        // Grab the token from the browser's hard drive
        const token = localStorage.getItem('access_token');
        
        // If the token exists, glue it to the Authorization header
        if (token) {
            // Note: Django SimpleJWT defaults to 'Bearer'. 
            // If your Django settings explicitly use 'JWT', change 'Bearer' to 'JWT'.
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;