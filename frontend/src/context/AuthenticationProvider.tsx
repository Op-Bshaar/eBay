import { ReactNode, useEffect, useState } from "react";
import { AuthenticationContext, User } from "./AuthenticationContext";

function AuthenticationProvider({ children }: { children: ReactNode }) {
    const [user, setUserState] = useState<User | null>(getStoredUser());
    const setUser = (newUser: User | null) => {
        setUserState(newUser);
        if (newUser) {
            localStorage.setItem("user", JSON.stringify(newUser));
        } else {
            localStorage.removeItem("user");
        }
    }

    useEffect(() => {

        // Function to handle storage events
        const handleStorageChange = (event: StorageEvent) => {
            if (event.storageArea === localStorage) {
                const newUser = getStoredUser();
                setUserState(newUser);
            }
        };

        // Add event listener
        window.addEventListener('storage', handleStorageChange);

        // Clean up the event listener on component unmount
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);
    return (
        <AuthenticationContext.Provider value={{ user, setUser }} >
            {children}
        </AuthenticationContext.Provider>
    );
}
function getStoredUser(): User |null {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
}
export default AuthenticationProvider;
