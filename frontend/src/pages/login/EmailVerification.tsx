import { ReactNode } from "react";
import { useAuthenticationContext } from "../../context/AuthenticationContext";
import { useRequireAuthentication } from "./LoginRedirect";

function VerifiyEmail() {
    useRequireAuthentication();
    const isVerified = useAuthenticationContext().user?.isEmailVerified || true;
    let page: ReactNode;
    if (isVerified) {
        page =  <div className="tajawal-extralight">تم تأكيد البريد الإلكتروني بنجاح.</div>
    }
    return (
        <div className="email-verification-page">
            {page }
        </div>
    );
}
export default VerifiyEmail;