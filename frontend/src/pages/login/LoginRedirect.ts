import { NavigateFunction } from "react-router-dom";

export function setLoginRedirect(path: string) {
    sessionStorage.setItem('redirectAfterLogin',path);
}
export function redirectAfterLogin(navigate:NavigateFunction) {
    // Retrieve the stored location or fallback to the default redirect
    const loginRedirect = sessionStorage.getItem('redirectAfterLogin') || '/';
    sessionStorage.removeItem('redirectAfterLogin');
    navigate(loginRedirect);
}