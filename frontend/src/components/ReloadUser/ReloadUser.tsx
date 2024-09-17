import { useNavigate } from "react-router-dom";
import "../../styles/Loader.css";
import { useRequireAuthentication } from "../../pages/login/LoginRedirect";
import { PAGE_URLS } from "../../constants/URL";
import api from "../../helpers/api";
import { useEffect, useState } from "react";
import { isAxiosError } from "axios";
import { useAuthenticationContext } from "../../context/AuthenticationContext";
import { readUser } from "../../utils/User";
import ErrorMessage from "../errorMessage/Error";


/**
 * reads user from value returned from api
 * @param user_data json object returned from api call
 * @returns User object.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
            const user = readUser(_user);
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
                <ErrorMessage>
                    <p>{errorMessage}</p>
                    <button onClick={load } className="button">إعادة الاتصال.</button>
                </ErrorMessage> :
                <div className="loader" />}
        </div>
    );
}

export default ReloadUser;