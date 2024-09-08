import { ReactNode, useState } from "react";
import { useAuthenticationContext } from "../../context/AuthenticationContext";
import { useRequireAuthentication } from "./LoginRedirect";
import "./login-form.css";
import "./EmailVerification.css";
import { PAGE_URLS } from "../../constants/URL";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api";
import "../../Loader.css";
import { isAxiosError } from "axios";

function VerifiyEmail() {
    const timeBetweenRetriesInMS = 60000;//ms
    const genericError = "حدث خطأ ما, حاول مرة أخرى.";
    useRequireAuthentication();
    const verificationEmailSentOnRegister = sessionStorage.getItem("verification_email_sent") === "true";
    const [errorMessage, setErrorMessage] = useState(verificationEmailSentOnRegister ? "" : genericError);
    const [isLoading, setIsLoading] = useState(false);
    const [isRetryDisabled, setIsRetryDisabled] = useState(false);
    const [firstTry, setFirstTry] = useState(true);
    const user = useAuthenticationContext().user;
    const isEmailVerified = user?.isEmailVerified;
    const requestVerificationEmail = async () => {
        try {
            if (firstTry) {
                setFirstTry(false);
            }
            setIsLoading(true);
            setErrorMessage("");
            // Disable the button
            setIsRetryDisabled(true);
            await api.post('request-verification-email');
            setErrorMessage("");
            // Re-enable the button after timeout
            setTimeout(() => {
                setIsRetryDisabled(false);
            }, timeBetweenRetriesInMS);

        }
        catch (error) {
            setIsRetryDisabled(false);
            if (isAxiosError(error)) {
                if (error.request && !error.response) {
                    setErrorMessage(" تحقق من الاتصال بالشبكة ثم حاول مرة أخرى.");
                }
                else {
                    setErrorMessage(genericError);
                }
            }
            else {
                setErrorMessage(genericError);
            }
        }
        finally {
            setIsLoading(false);
        }
    };
    let page: ReactNode;
    if (isEmailVerified) {
        page = <>
            <div className="email-verifictation-success-message">تم تأكيد البريد الإلكتروني بنجاح.</div>
            <Link className="button" to={PAGE_URLS.home}>العودة</Link>
        </>
    }
    else if (user && user.email) {
        const errorElement = !firstTry &&
            <div role="alert" aria-live="assertive" className="error-message">
                {errorMessage}
            </div>;
        page =
            <>
                <input className="center-text" type="text" value={user.email} disabled />
                {errorMessage ? errorElement :
                    isLoading ?
                        <div className="small-loader" /> :
                        <div className="text-align-start">
                            تم إرسال رابط إلى بريدك الإلكنروني.
                        </div>
                }
                <div className="email-verifictation-button-container">
                    <button onClick={requestVerificationEmail} className="button" disabled={isRetryDisabled}>
                    {firstTry ? "إرسال رابط التفعيل" : "إعادة إرسال رابط التفعيل"}
                    </button>
                    <Link to={PAGE_URLS.update_email} className="button">تغيير البريد الإلكنروني</Link>
                </div>
            </>;
    }
    // clean session storage
    if (verificationEmailSentOnRegister) {
        sessionStorage.removeItem("verification_email_sent");
    }
    return (
        <div className="login-form email-verifictation tajawal-extralight">
            <div className="login-form-content email-verifictation-content">
                {page}
            </div>
        </div>
    );
}
export default VerifiyEmail;