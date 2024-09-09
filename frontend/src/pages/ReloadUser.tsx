import { useNavigate } from "react-router-dom";
import "../Loader.css"
import { useRequireAuthentication } from "./login/LoginRedirect";
import { PAGE_URLS } from "../constants/URL";
import api from "../api";
import { useAuthenticationContext, User } from "../context/AuthenticationContext";
import { useEffect } from "react";

/**
 * page that updates user then redirect 
 * @returns
 */
function ReloadUser({ redirectTo = PAGE_URLS.home }: {redirectTo?:string}) {
    useRequireAuthentication();
    const navigate = useNavigate();
    const { setUser } = useAuthenticationContext();
    const load = async () => {
        try {
            const response = await api.get("user");
            const _user = response.data;
            const user = new User(
                _user["username"], _user["phone"], _user["email"],
                !!_user["phone_verified_at"],
                !!_user["email_verified_at"]
            );
            setUser(user);
            navigate(redirectTo);
        }
        catch { /* empty */ }
    }
    useEffect(() => {
        load();
    });
    return (
        <div className="absolute-center">
            <div className="loader" />
      </div>
  );
}

export default ReloadUser;