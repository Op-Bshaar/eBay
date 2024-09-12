import { createContext, useContext } from "react";
import api, { clearUserToken } from "../api";
import { User } from "../User";


interface IAuthenticationContext { user: User | null; setUser: (user: User | null) => void; }
export const AuthenticationContext = createContext<IAuthenticationContext | undefined>(undefined);
export function useAuthenticationContext(): IAuthenticationContext {
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
