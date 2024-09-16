import { ReactNode, useEffect, useState } from "react";
import { useAuthenticationContext } from "../../context/AuthenticationContext";
import { useRedirectAfterLogin, useRequireAuthentication } from "./LoginRedirect";
import "./login-form.css";
import "./EmailVerification.css";
import { PAGE_URLS } from "../../constants/URL";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api";
import "../../Loader.css";
import { isAxiosError } from "axios";

function VerifiyEmail() {
    const redirect = useRedirectAfterLogin();
    const navigate = useNavigate();
    const _verification_email_sent =
        sessionStorage.getItem("verification_email_sent") === "true";
    const [verification_email_sent, setVerification_email_sent] = useState(
        _verification_email_sent
    );
    const timeBetweenRetriesInMS = 60001; //ms
    const genericError = "حدث خطأ ما, حاول مرة أخرى.";
    useRequireAuthentication();
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isRetryDisabled, setIsRetryDisabled] = useState(false);
    const user = useAuthenticationContext().user;
    const isEmailVerified = user?.isEmailVerified;
    // Use useEffect to clear sessionStorage only after the state has been updated
    useEffect(() => {
        if (verification_email_sent) {
            sessionStorage.removeItem("verification_email_sent");
        }
    }, [verification_email_sent]);
    const requestVerificationEmail = async () => {
        try {
            if (!verification_email_sent) {
                setVerification_email_sent(true);
            }
            setIsLoading(true);
            setErrorMessage("");
            // Disable the button
            setIsRetryDisabled(true);
            const response = await api.post("request-verification-email");
            if (response.data.is_verified) {
                navigate(PAGE_URLS.email_verified_successfuly);
            }
            // Re-enable the button after timeout
            setTimeout(() => {
                setIsRetryDisabled(false);
            }, timeBetweenRetriesInMS);
        } catch (error) {
            setIsRetryDisabled(false);
            if (isAxiosError(error)) {
                if (error.request && !error.response) {
                    setErrorMessage(" تحقق من الاتصال بالشبكة ثم حاول مرة أخرى.");
                }
                //429 Too Many Requests
                else if (error.response?.status === 429) {
                    setErrorMessage("يمكنك طلب إعادة الإرسال بعد دقيقة.");
                    setIsRetryDisabled(true);
                    // Re-enable the button after timeout
                    setTimeout(() => {
                        setIsRetryDisabled(false);
                    }, timeBetweenRetriesInMS);
                } else {
                    setErrorMessage(genericError);
                }
            } else {
                setErrorMessage(genericError);
            }
        } finally {
            setIsLoading(false);
        }
    };
    let page: ReactNode;
    if (isEmailVerified) {
        page = (
            <>
                <div className="email-verifictation-success-message">
                    تم تأكيد البريد الإلكتروني بنجاح.
                </div>
                <button role="link" className="button" onClick={redirect }>
                    العودة
                </button>
            </>
        );
    } else if (user && user.email) {
        const errorElement = (
            <div role="alert" aria-live="assertive" className="error-message">
                {errorMessage}
            </div>
        );
        page = (
            <>
                <input
                    className="center-text"
                    type="text"
                    value={user.email}
                    disabled
                />
                {errorMessage ? (
                    errorElement
                ) : isLoading ? (
                    <div className="small-loader" />
                ) : (
                    verification_email_sent && (
                        <div className="text-align-start">
                            تم إرسال رابط إلى بريدك الإلكتروني.
                        </div>
                    )
                )}
                <div className="email-verifictation-button-container">
                    <button
                        onClick={requestVerificationEmail}
                        className="button"
                        disabled={isRetryDisabled}
                    >
                        {verification_email_sent
                            ? "إعادة إرسال رابط التفعيل"
                            : "إرسال رابط التفعيل"}
                    </button>
                    <Link to={PAGE_URLS.update_email} className="button">
                        تغيير البريد الإلكتروني
                    </Link>
                </div>
            </>
        );
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
