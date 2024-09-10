import { createContext, useContext } from "react";
import api, { clearUserToken } from "../api";

export class User {
    id: string;
    username: string;
    phone: string;
    email: string;
    phoneVerifiedAt: boolean;
    isEmailVerified: boolean;
    isAdmin: boolean;
    constructor(id: string, username: string, phone: string, email: string, isPhoneVerified: boolean = false, isEmailVerified: boolean = false, isAdmin = false) {
        this.id = id;
        this.username = username;
        this.phone = phone;
        this.email = email;
        this.phoneVerifiedAt = isPhoneVerified;
        this.isEmailVerified = isEmailVerified;
        this.isAdmin = isAdmin;
    }
}
interface AuthenticationContextType { user: User | null; setUser: (user: User | null) => void; }
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
        try {
            await api.post('/logout');
        } catch { /* empty */ }
        finally {
            setUser(null);
            clearUserToken();
        }
    };
    return logout;
}
/**
 * reads user from value returned from api
 * @param user_data json object returned from api call
 * @returns User object.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function readUser(user_data: any): User {
    return new User(
        user_data["id"] ?? "",
        user_data["username"] ?? "",
        user_data["phone"] ?? "",
        user_data["email"] ?? "",
        !!user_data["phone_verified_at"],
        !!user_data["email_verified_at"],
        user_data["isAdmin"],
    );
}