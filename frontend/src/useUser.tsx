import { useEffect, useState } from "react";
import { User } from "./context/AuthenticationContext";

function useCurrentUser() {
    const [user, setUserState] = useState(getStoredUser());
    const setUser = (newUser: User) => {
        setUserState(user);
        localStorage.setItem("user", JSON.stringify(newUser));
    }
    useEffect(() => {

        // Function to handle storage events
        const handleStorageChange = (event: StorageEvent) => {
            if (event.storageArea === localStorage) {
                const newUser = event.newValue ? JSON.parse(event.newValue) : null;
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
    return [user, setUser];
}
export default useCurrentUser;