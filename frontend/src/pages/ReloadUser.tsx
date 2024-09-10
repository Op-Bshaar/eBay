import { useNavigate } from "react-router-dom";
import "../Loader.css"
import { useRequireAuthentication } from "./login/LoginRedirect";
import { PAGE_URLS } from "../constants/URL";
import api from "../api";
import { useAuthenticationContext, User } from "../context/AuthenticationContext";
import { useEffect, useState } from "react";
import { isAxiosError } from "axios";

/**
 * page that updates user then redirect 
 * @returns
 */
function ReloadUser({ redirectTo = PAGE_URLS.home }: { redirectTo?: string }) {
    useRequireAuthentication();
    const navigate = useNavigate();
    const { setUser } = useAuthenticationContext();
    const [errorMessage, setErrorMessage] = useState("");
    const load = async () => {
        try {
            setErrorMessage("");
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
        catch (error) {
            if (isAxiosError(error) && !error.response && error.request) {
                setErrorMessage("تعذر الاتصال, تحقق من الاتصال بالشبكة.");
            }
            else {
                setErrorMessage("حدث خطأ ما! الرجاء المحاولة مجدداً.");
            }
        }
    }
    // load user on first render.
    useEffect(() => {
            load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);
    return (
        <div className="absolute-center">
            {errorMessage ?
                <div role="alert" aria-live="assertive" className="error-message">
                    <p>{errorMessage}</p>
                    <button onClick={load } className="button">إعادة الاتصال.</button>
                </div> :
                <div className="loader" />}
        </div>
    );
}

export default ReloadUser;