import { createContext, useContext } from "react";
import api, { clearUserToken } from "../api";

export class User {
    username: string;
    phone: string;
    email: string;
    isPhoneVerified: boolean;
    isEmailVerified: boolean;
    constructor(username: string, phone: string, email: string, isPhoneVerified: boolean = false, isEmailVerified: boolean = false) {
        this.username = username;
        this.phone = phone;
        this.email = email;
        this.isPhoneVerified = isPhoneVerified;
        this.isEmailVerified = isEmailVerified;
    }
}
interface AuthenticationContextType { user: User | null;  setUser: (user: User | null) => void; }
export const AuthenticationContext = createContext<AuthenticationContextType | undefined>(undefined);
export function useAuthenticationContext(): AuthenticationContextType {
    const context = useContext(AuthenticationContext);
    if (!context) {
        throw new Error("useAuthentication must be used within an AuthenticationProvider");
    }
    return context;
}
export function useLogout() {
    const { setUser } = useAuthenticationContext();
    const logout = async () => {
        clearUserToken();
        setUser(null);
        try {
            await api.post('/logout');
        } catch { /* empty */ }
    };
    return logout;
}