import axios from 'axios';

const api = axios.create({
    // Keep using the environment variable for deployment flexibility
    baseURL: import.meta.env.VITE_API_BASE_URL || 'https://leftover-to-lifeline.onrender.com/api',
    
    // CRITICAL: Tells Axios to send cross-origin cookies/tokens if needed
    withCredentials: true, 
    
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
});

export default api;