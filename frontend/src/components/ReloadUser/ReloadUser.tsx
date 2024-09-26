import "../../styles/Loader.css";
import { useRequireAuthentication } from "../../pages/login/LoginRedirect";
import api from "../../helpers/api";
import { ReactNode, useEffect, useState } from "react";
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
function ReloadUser({ children }: { children: ReactNode }) {
    useRequireAuthentication();
    const { setUser } = useAuthenticationContext();
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const load = async () => {
        try {
            if (!isLoading) {
                setIsLoading(true);
            }
            setErrorMessage("");
            const response = await api.get("user");
            const _user = response.data;
            const user = readUser(_user);
            setUser(user);
        }
        catch (error) {
            if (isAxiosError(error) && !error.response && error.request) {
                setErrorMessage("تعذر الاتصال, تحقق من الاتصال بالشبكة.");
            }
            else {
                setErrorMessage("حدث خطأ ما! الرجاء المحاولة مجدداً.");
            }
        }
        finally {
            setIsLoading(false);
        }
    }
    // load user on first render.
    useEffect(() => {
            load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    if (!isLoading && !errorMessage) {
        return children;
    }
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