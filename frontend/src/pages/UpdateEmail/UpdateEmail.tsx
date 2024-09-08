import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useAuthenticationContext, User } from "../../context/AuthenticationContext";
import "../login/login-form.css";
import { useRequireAuthentication } from "../login/LoginRedirect";
import api from "../../api";
import { isAxiosError } from "axios";
import { PAGE_URLS } from "../../constants/URL";
import { useNavigate } from "react-router-dom";
function UpdateEmail() {
    useRequireAuthentication();
    const { user, setUser } = useAuthenticationContext();
    const navigate = useNavigate();
    const old_email = user?.email;
    const [new_email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [inputErrorMessage, setInputErrorMessage] = useState("");
    const [responseErrorMessage, setResponseErrorMessage] = useState("");
    const [emailTaken, setEmailTaken] = useState(false);
    const emailInputRef = useRef<HTMLInputElement>(null);
    // validate input
    useEffect(() => {
        let message = "";
        if (!new_email) {
            message = "أدخل البريد الإلكتروني.";
        }
        else if (new_email === old_email) {
            message = "أدخل بريدا غير بريدك القديم.";
        }
        else if (emailInputRef.current && !emailInputRef.current.checkValidity()) {
            message = "البريد الإلكتروني غير صحيح.";
        }
        if (inputErrorMessage !== message) {
            setInputErrorMessage(message);
        }
    }, [new_email, inputErrorMessage, old_email]);
    const update = async () => {
        try {
            setIsLoading(true);
            setResponseErrorMessage("");
            const response = await api.post("update-email", { 'email': new_email });
            const _user = response.data.user;
            setUser(new User(
                _user["username"], _user["phone"], _user["email"],
                _user["email_verified_at"] != null,
                _user["phone_verified_at"] != null
            ));
            navigate(PAGE_URLS.email_verification);
        }
        catch (error) {
            if (isAxiosError(error)) {

                // handle 422 Unprocessable Content 
                if (error.response?.status === 422 && error.response?.data?.errors) {
                    const _errors = error.response.data.errors;
                    if (_errors.email) {
                        setEmailTaken(true);
                    }
                    else {
                        setResponseErrorMessage("خطأ في الادخال!");
                    }
                }
                // request was sent but no response
                else if (!error.response && error.request) {
                    setResponseErrorMessage("تعذر الاتصال, تحقق من الاتصال بالشبكة.");
                }
                // server responded with an error other than 422
                else {
                    setResponseErrorMessage("حدث خطأ ما! الرجاء المحاولة مجدداً.");
                }
            }
            // handle non Axios Errors
            else {
                setResponseErrorMessage("حدث خطأ ما! الرجاء المحاولة مجدداً.");
            }
        }
        finally {
            setIsLoading(false);
        }
    }
    return (
        <div className="login-form tajawal-extralight">
            <div className="login-form-content">
                <div className="input-group">
                    <label htmlFor="old-email">البريد الإلكتروني القديم:</label>
                    <input className="hide-valid" id="old-email" type="email"
                        ref={emailInputRef} value={old_email} disabled/>
                </div>
                <div className="input-group">
                    <label htmlFor="new-email">البريد الإلكتروني الجديد:</label>
                    <input className="hide-valid" id="new-email" type="email"
                        ref={emailInputRef} value={new_email}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                            setEmail(e.target.value);
                            setEmailTaken(false);
                        }} />
                </div>
                {inputErrorMessage &&
                    <div role="alert" aria-live="assertive" className="error-message">
                        {inputErrorMessage}
                    </div>}
                {responseErrorMessage &&
                    <div role="alert" aria-live="assertive" className="error-message">
                        {responseErrorMessage}
                    </div>}
                {emailTaken && 
                    <div role="alert" aria-live="assertive" className="error-message">
                        تم استخدام هذا البريد من قبل!
                    </div>}
                <button className="button" onClick={update }
                    disabled={!!inputErrorMessage || emailTaken || isLoading}>
                    إرسال
                </button>
            </div>
        </div>
    );
}

export default UpdateEmail;