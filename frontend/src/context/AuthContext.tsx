import { createContext, useContext } from "react";

interface IContext {
  username: string | null;
  token: string | null;
  phone: string | null;
  email: string | null;
  login: (
    phone: string,
    email: string,
    username: string,
    token: string
  ) => void;
  isAuthenticated: boolean;
  logout: () => void;
}

export const AuthContext = createContext<IContext>({
  username: null,
  phone: null,
  email: null,
  token: null,
  login: () => {},
  isAuthenticated: false,
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);
