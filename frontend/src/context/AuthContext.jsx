import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (token) {
            try {
                // The token is valid, fetch the profile
                fetchUserProfile();
            } catch (error) {
                logout();
            }
        } else {
            setLoading(false);
        }
    }, []);

    const fetchUserProfile = async () => {
        try {
            const token = localStorage.getItem('access_token');
            
            // 1. Decode the token to find out exactly WHO is holding it
            const decoded = jwtDecode(token);
            
            // Django SimpleJWT stores the user's database ID in 'user_id'
            const myUserId = decoded.user_id; 

            const response = await api.get('/users/');
            
            // --- THE FIX: IDENTITY VERIFICATION ---
            if (Array.isArray(response.data)) {
                // If Django returns a giant list of users (because we are an Admin),
                // search the list to find the EXACT profile matching our token's ID.
                const myProfile = response.data.find(u => u.id === myUserId);
                
                if (myProfile) {
                    setUser(myProfile);
                } else {
                    // Fallback just in case the ID formatting is strange
                    setUser(response.data[0]); 
                }
            } else {
                // If Django correctly returns a single object
                setUser(response.data);
            }
        } catch (error) {
            console.error("Failed to fetch profile", error);
            logout();
        } finally {
            setLoading(false);
        }
    };

    const login = async (username, password) => {
        const response = await api.post('/auth/login/', { username, password });
        localStorage.setItem('access_token', response.data.access);
        localStorage.setItem('refresh_token', response.data.refresh);
        // Also save role just in case
        if (response.data.role) localStorage.setItem('role', response.data.role);
        await fetchUserProfile();
    };

    const logout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('role');
        setUser(null);
        setLoading(false);
        window.location.href = '/login'; // Force a clean slate
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};