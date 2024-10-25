import {  useLocation, useNavigate } from "react-router-dom";
import { PAGE_URLS } from "../../constants/URL";
import { clearUserToken, useIsAuthenticated } from "../../api";
import { useEffect } from "react";
import { useAuthenticationContext } from "../../context/AuthenticationContext";
export function useRedirectAfterLogin() {
    const navigate = useNavigate();
    const redirect = () => {
        // Retrieve the stored location or fallback to the default redirect
        const loginRedirect = sessionStorage.getItem('redirectAfterLogin') || '/';
        sessionStorage.removeItem('redirectAfterLogin');
        navigate(loginRedirect);
    }
    return redirect;
}

/**
 * check if user is authenticated, if not redirect to login page then back to the current page.
 * @param path 
 */
export function useRequireAuthentication() {
    const location = useLocation();
    const navigate = useNavigate();
    const isAuthenticated = useIsAuthenticated();
    const context = useAuthenticationContext();
    const user = context.user;
    useEffect(() => {
        if (!user) {
            clearUserToken();
        }
        if (!isAuthenticated) {
            sessionStorage.setItem('redirectAfterLogin', location.pathname);
            navigate(PAGE_URLS.login);
        }
    });
}