import { ReactNode, useEffect, useState } from "react";
import { AuthenticationContext, User } from "./AuthenticationContext";

function AuthenticationProvider({ children }: { children: ReactNode }) {
    const storedUser = localStorage.getItem("user");
    const [user, setUserState] = useState<User | null>(storedUser ? JSON.parse(storedUser) : null);
    const setUser = (_user: User | null) => {
        setUserState(_user);
        if (_user) {
            localStorage.setItem("user", JSON.stringify(_user));
        }
        else {
            localStorage.removeItem("user");
        }
    }
    return (
        <AuthenticationContext.Provider value={{user, setUser} } >
      {children}
    </AuthenticationContext.Provider>
  );
};
export default AuthenticationProvider;
