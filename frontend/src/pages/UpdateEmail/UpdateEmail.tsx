import { ChangeEvent, useRef, useState } from "react";
import { useAuthenticationContext } from "../../context/AuthenticationContext";
import "../login/login-form.css";
import { useRequireAuthentication } from "../login/LoginRedirect";
function UpdateEmail() {
    useRequireAuthentication();
    const user_email = useAuthenticationContext().user?.email ?? "";
    const [email, setEmail] = useState(user_email);
    const [isLoading, setIsLoading] = useState(false);
    const [inputErrorMessage, setInputErrorMessage] = useState("");
    const [responseErrorMessage, setResponseErrorMessage] = useState("");
    const valid = (): boolean => {
        if (!email) {
            const message = "أدخل البريد الإلكتروني.";
            if (inputErrorMessage !== message) {
                setInputErrorMessage(message);
            }
            return false;
        }
        else if (email === user_email) {
            const message = "أدخل بريدا غير بريدك القديم.";
            if (inputErrorMessage !== message) {
                setInputErrorMessage(message);
            }
            return false;
        }
        if (inputErrorMessage) {
            setInputErrorMessage("");
        }
        return true;
    }
    const emailInputRef = useRef<HTMLInputElement>(null);
    return (
        <div className="login-form tajawal-extralight">
            <div className="login-form-content">
                <div className="input-group">
                    <label htmlFor="email">البريد الإلكتروني الجديد:</label>
                    <input className="hide-valid" id="email" type="email" ref={emailInputRef}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} />
                </div>
                {inputErrorMessage &&
                    <div role="alert" aria-live="assertive" className="error-message">
                        {inputErrorMessage}
                    </div>}
                <button className="button" disabled={!valid() || isLoading}>
                    إرسال
                </button>
            </div>
        </div>
    );
}

export default UpdateEmail;