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
            const decoded = jwtDecode(token);
            const myUserId = decoded.user_id; 
            
            // Grab the role we saved to the hard drive during login
            const savedRole = localStorage.getItem('role'); 

            const response = await api.get('/users/');
            
            if (Array.isArray(response.data)) {
                // Notice the '==' instead of '==='. 
                // This prevents bugs if Django sends the ID as a string "1" but the token has integer 1.
                const myProfile = response.data.find(u => u.id == myUserId);
                
                if (myProfile) {
                    setUser(myProfile);
                } else {
                    // --- THE INVISIBLE ADMIN FIX ---
                    // If Django hid the user from the list, check if they are an ADMIN.
                    if (savedRole === 'ADMIN' || savedRole === 'Admin') {
                        // Construct a local Admin profile so the router lets them in
                        setUser({ 
                            id: myUserId, 
                            username: 'Administrator', 
                            role: 'ADMIN' 
                        });
                    } else {
                        // If they aren't an admin and still aren't found, 
                        // NEVER steal an identity. Force a logout.
                        console.error("User ID not found in database list. Aborting.");
                        logout(); 
                    }
                }
            } else {
                // If Django correctly returns a single object instead of a list
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