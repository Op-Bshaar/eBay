import { Link, useNavigate } from "react-router-dom";
import "../register/register.css";
import { useRef, useState } from "react";
import axios from "axios";
import api,{setToken} from "../../helpers/api";
import PasswordInput from "../login/PasswordInput";
import { PAGE_URLS } from "../../constants/URL";
import "../../styles/Loader.css";
import { useAuthenticationContext } from "../../context/AuthenticationContext";
import { readUser } from "../../utils/User";

function Register() {
  const navigate = useNavigate();
  const [isUsernameTaken, setIsUsernameTaken] = useState<boolean>(false);
  const [isPhoneTaken, setIsPhoneTaken] = useState<boolean>(false);
  const [isEmailTaken, setIsEmailTaken] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [fieldErrors, setFieldErrors] = useState({
    username: "",
    email: "",
    password: "",
    phone: "",
    first_name: "",
    last_name: "",
  });

  const usernameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const firstNameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);

  const { setUser } = useAuthenticationContext();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const username = usernameRef.current?.value || "";
    const email = emailRef.current?.value || "";
    const password = passwordRef.current?.value || "";
    const phone = phoneRef.current?.value || "";
    const first_name = firstNameRef.current?.value || "";
    const last_name = lastNameRef.current?.value || "";

    let errors = {
      username: username ? "" : "ادخل اسم المستخدم",
      email: email ? "" : "ادخل بريدك الإلكتروني",
      password: password ? "" : "ادخل كلمة المرور",
      phone: phone ? "" : "ادخل رقم الجوال",
      first_name: first_name ? "" : "ادخل الاسم الأول",
      last_name: last_name ? "" : "ادخل الاسم الأخير",
    };

    setFieldErrors(errors);

    const hasErrors = Object.values(errors).some((error) => error !== "");
    if (hasErrors) {
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage(null);

      const response = await api.post("register", {
        username,
        email,
        phone,
        password,
        first_name,
        last_name,
      });

      setToken(response.data.access_token);
      const _user = response.data.user;
      setUser(readUser(_user));
      sessionStorage.setItem("verification_email_sent", "true");
      navigate(PAGE_URLS.request_email_verification);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 422 && error.response?.data?.errors) {
          const _errors = error.response.data.errors;
          const _usernameTaken = !!_errors["username"];
          if (isUsernameTaken !== _usernameTaken) {
            setIsUsernameTaken(_usernameTaken);
          }

          const _phoneTaken = !!_errors["phone"];
          if (isPhoneTaken !== _phoneTaken) {
            setIsPhoneTaken(_phoneTaken);
          }

          const _emailTaken = !!_errors["email"];
          if (isEmailTaken !== _emailTaken) {
            setIsEmailTaken(_emailTaken);
          }

          if (!_emailTaken && !_usernameTaken && !_phoneTaken) {
            setErrorMessage("خطأ في الادخال!");
          }
        } else if (!error.response && error.request) {
          setErrorMessage("تعذر الاتصال, تحقق من الاتصال بالشبكة.");
        } else {
          setErrorMessage("حدث خطأ ما! الرجاء المحاولة مجدداً.");
        }
      } else {
        setErrorMessage("حدث خطأ ما! الرجاء المحاولة مجدداً.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="login-form1 tajawal-extralight" onSubmit={handleSubmit}>
      <h1>ادخل بياناتك</h1>
      <div>
        <div className="login-form-content1">
          <div className="input-group1">
            <label htmlFor="username">اسم المستخدم:</label>
            <input
              type="text"
              id="username"
              autoComplete="username"
              placeholder="ادخل اسم المستخدم"
              ref={usernameRef}
              onChange={() => {
                if (isUsernameTaken) setIsUsernameTaken(false);
              }}
            />
            {fieldErrors.username && (
              <p role="alert" aria-live="assertive" className="login-sub-error">
                {fieldErrors.username}
              </p>
            )}
            {isUsernameTaken && (
              <p role="alert" aria-live="assertive" className="login-sub-error">
                تم استخدام هذا الاسم من قبل!
              </p>
            )}
          </div>

          <div className="input-group1">
            <label htmlFor="first-name">الاسم الأول:</label>
            <input
              id="first-name"
              autoComplete="given-name"
              placeholder="أدخل الاسم الأول"
              ref={firstNameRef}
            />
            {fieldErrors.first_name && (
              <p role="alert" aria-live="assertive" className="login-sub-error">
                {fieldErrors.first_name}
              </p>
            )}
          </div>

          <div className="input-group1">
            <label htmlFor="last-name">الاسم الأخير:</label>
            <input
              id="last-name"
              autoComplete="family-name"
              placeholder="أدخل الاسم الأخير"
              ref={lastNameRef}
            />
            {fieldErrors.last_name && (
              <p role="alert" aria-live="assertive" className="login-sub-error">
                {fieldErrors.last_name}
              </p>
            )}
          </div>

          <div className="input-group1">
            <label htmlFor="email">البريد الالكتروني:</label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="ادخل بريدك الإلكتروني"
              ref={emailRef}
              onChange={() => {
                if (isEmailTaken) setIsEmailTaken(false);
              }}
            />
            {fieldErrors.email && (
              <p role="alert" aria-live="assertive" className="login-sub-error">
                {fieldErrors.email}
              </p>
            )}
            {isEmailTaken && (
              <p role="alert" aria-live="assertive" className="login-sub-error">
                تم استخدام هذا البريد من قبل!
              </p>
            )}
          </div>

          <div className="input-group1">
            <label htmlFor="phone">رقم الجوال:</label>
            <input
              id="phone"
              pattern="^[\d+]\d*$"
              autoComplete="tel"
              placeholder="ادخل رقم جوالك"
              ref={phoneRef}
              onChange={() => {
                if (isPhoneTaken) setIsPhoneTaken(false);
              }}
            />
            {fieldErrors.phone && (
              <p role="alert" aria-live="assertive" className="login-sub-error">
                {fieldErrors.phone}
              </p>
            )}
            {isPhoneTaken && (
              <p role="alert" aria-live="assertive" className="login-sub-error">
                تم استخدام هذا الجوال من قبل!
              </p>
            )}
          </div>

          <PasswordInput passwordRef={passwordRef} />
          {fieldErrors.password && (
            <p role="alert" aria-live="assertive" className="login-sub-error">
              {fieldErrors.password}
            </p>
          )}

          {errorMessage && (
            <p role="alert" aria-live="assertive" className="error-message">
              {errorMessage}
            </p>
          )}
        </div>
      </div>

      <button
        type="submit"
        className="button submit-button"
        disabled={isLoading}
      >
        تسجيل
      </button>

      <p style={{ width: "100%" }}>
        لديك حساب؟
        <Link className="link" to={PAGE_URLS.login}>
          تسجيل دخول
        </Link>
      </p>
    </form>
  );
}

export default Register;
