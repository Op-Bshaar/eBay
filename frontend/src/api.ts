import axios from 'axios';
import { API_URL } from './constants/BaseUrl';
import { useEffect, useState } from 'react';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
api.interceptors.response.use(
    (response) => {
        // Return the response data if everything is fine
        return response;
    },
    (error) => {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
            // Unauthorized error, remove the current token since it's not valid.
            clearUserToken();  // Clear user and token from localStorage
        }
        return Promise.reject(error); // Reject the error so it's still caught in the catch block
    }
);
/**
 * 
 * @param token : secutrity token from server
 */
export function setToken(token: string) {
    localStorage.setItem("token", token);
    triggerAuthChange(); // Notify listeners that auth state changed
}
/**
 * clears User Token: use when logging out.
 */
export function clearUserToken() {
    localStorage.removeItem('token');
    triggerAuthChange(); // Notify listeners that auth state changed
}
function triggerAuthChange() {
    const event = new Event('authChange');
    window.dispatchEvent(event);
}

/**
 * checks if user is authenticated (logged in) and ensures components using it will update
 * when authentication change. (when user login or logout)
 * @returns if user is authenticated
 */
export function useIsAuthenticated() {
    const [isAuthenticated, setIsAuthenticated] = useState(checkAuthentication());
    useEffect(() => {
        const handleAuthChange = () => {
            setIsAuthenticated(checkAuthentication());
        };
        // Listen to the custom auth change event for changes in the same tab
        window.addEventListener('authChange', handleAuthChange);

        // Also listen to storage events for other tabs
        window.addEventListener('storage', handleAuthChange);

        return () => {
            window.removeEventListener('authChange', handleAuthChange);
            window.removeEventListener('storage', handleAuthChange);
        };
    }, []);
    return isAuthenticated;
}

/**
 * checks if user is authenticated (logged in)
 * @returns if user is authenticated
 */
export function checkAuthentication() {
    const token = localStorage.getItem('token');
    return !!token;
}
export default api;