import axios from 'axios';

const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api',
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
            clearUser();  // Clear user and token from localStorage
        }
        return Promise.reject(error); // Reject the error so it's still caught in the catch block
    }
);
export function clearUser() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
}
export function isAuthorized() {
    const token = localStorage.getItem('token');
    return token == null;
}
export function setToken(token: string) {
    localStorage.setItem("token", token);
}
export function setUser(username: string, email: string, phone: string) {
    localStorage.setItem("username", username);
}
export default api;