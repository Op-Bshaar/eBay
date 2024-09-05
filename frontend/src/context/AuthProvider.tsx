import { Children, ReactNode, useState } from "react";
import { AuthContext } from "./AuthContext";

const AuthProvider = ({ children }: {children:ReactNode}) => {
  const [username, setUsername] = useState<null | string>(
    localStorage.getItem("username")
  );
  const [token, setToken] = useState<null | string>(
    localStorage.getItem("token")
  );
  const [phone, setPhone] = useState<null | string>(
    localStorage.getItem("phone")
  );
  const [email, setEmail] = useState<null | string>(
    localStorage.getItem("email")
  );
  const isAuthenticated = !!token;

  const login = (
    phone: string,
    email: string,
    username: string,
    token: string
  ) => {
    setUsername(username);
    setPhone(phone);
    setEmail(email);
    setToken(token);
    localStorage.setItem("username", username);
    localStorage.setItem("token", token);
    localStorage.setItem("phone", phone);
    localStorage.setItem("email", email);
  };

  const logout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("token");
    localStorage.removeItem("phone");
    localStorage.removeItem("email");
    setUsername(null);
    setToken(null);
    setPhone(null);
    setEmail(null);
  };
  return (
    <AuthContext.Provider
      value={{
        username,
        token,
        phone,
        email,
        login,
        logout,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
export default AuthProvider;
