import { ReactNode, useState } from "react";
import { AuthenticationContext, User } from "./AuthenticationContext";

function AuthenticationProvider({ children }: { children: ReactNode }){
    const [user, setUser] = useState<User | null>(null);
    return (
        <AuthenticationContext.Provider value={{user, setUser} } >
      {children}
    </AuthenticationContext.Provider>
  );
};
export default AuthenticationProvider;
