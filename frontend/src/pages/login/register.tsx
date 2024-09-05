import { Link, useNavigate } from "react-router-dom";
import "./login-form.css";
import { RefObject, useRef, useState } from "react";
import { redirectAfterLogin } from "./LoginRedirect";
import api, { setToken } from "../api";
import { useAuthenticationContext, User } from "../../context/AuthenticationContext";
import axios from "axios";

function Register() {
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isUsernameTaken, setIsUsernameTaken] = useState<boolean>(false);
    const [isPhoneTaken, setIsPhoneTaken] = useState<boolean>(false);
    const [isEmailTaken, setIsEmailTaken] = useState<boolean>(false);
    const usernameRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const phoneRef = useRef<HTMLInputElement>(null);
    const { setUser } = useAuthenticationContext();
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const username = usernameRef.current?.value || "";
        const email = emailRef.current?.value || "";
        const password = passwordRef.current?.value || "";
        const phone = phoneRef.current?.value || "";
        try {
            setErrorMessage("");
            const response = await api.post("register", {
                username,
                email,
                phone,
                password,
            });
            setToken(response.data.access_token);
            const _user = response.data.user;
            setUser(new User(
                _user["username"], _user["phone"], _user["email"],
                _user["email_verified_at"] != null,
                _user["phone_verified_at"] != null
            ));
            redirectAfterLogin(navigate);
        }
        catch (error) {
            if (axios.isAxiosError(error)) {
                // handle 422 Unprocessable Content
                if (error.response?.status === 422 && error.response?.data?.errors) {
                    const _errors = error.response.data.errors;
                    // !!_errors["username"] returns true if username exists in _errors
                    const _usernameTaken = !!_errors["username"];
                    // setIsUsernameTaken only if it changed to avoid unnecessary  updates
                    if (isUsernameTaken != _usernameTaken) {
                        setIsUsernameTaken(_usernameTaken);
                    }

                    // !!_errors["phone"] returns true if phone exists in _errors
                    const _phoneTaken = !!_errors["phone"];
                    // setIsPhoneTaken only if it changed to avoid unnecessary  updates
                    if (isPhoneTaken != _phoneTaken) {
                        setIsPhoneTaken(_usernameTaken);
                    }

                    // !!_errors["email"] returns true if email exists in _errors
                    const _emailTaken = !!_errors["email"];
                    // setIsEmailTaken only if it changed to avoid unnecessary  updates
                    if (isEmailTaken != _emailTaken) {
                        setIsEmailTaken(_emailTaken);
                    }

                    if (!_emailTaken && !_usernameTaken && !_phoneTaken) {
                        setErrorMessage("خطأ في الادخال!");
                    }
                }
                // request was sent but no response
                else if (!error.response && error.request) {
                    setErrorMessage("تعذر الاتصال, تحقق من الاتصال بالشبكة.");
                }
                    // server responded with an error other than 422
                else {
                    setErrorMessage("حدث خطأ ما! الرجاء المحاولة مجدداً.");
                }
            }
                // handle non Axios Errors
            else {
                setErrorMessage("حدث خطأ ما! الرجاء المحاولة مجدداً.");
            }
            console.log(error);
        }
    };

    usernameRef.current?.setCustomValidity(isUsernameTaken? "username taken!" : "");
    phoneRef.current?.setCustomValidity(isPhoneTaken? "phone taken!" : "");
    emailRef.current?.setCustomValidity(isEmailTaken? "email taken!" : "");
    return (
        <form className="login-form tajawal-extralight" onSubmit={handleSubmit}>
            <h1>ادخل بيناتك</h1>
            <div className="login-form-content">
                <div className="input-group">
                    <label htmlFor="username">اسم المستخدم</label>
                    <input
                        type="text"
                        id="username"
                        placeholder="ادخل اسم المستخدم"
                        minLength={2}
                        pattern="^[\p{L}\p{N}_]+$"
                        required
                        ref={usernameRef}
                        onChange={ () => {
                            if (isUsernameTaken) {
                                setIsUsernameTaken(false);
                            }
                        }}
                    />
                    {isUsernameTaken && (
                        <p role="alert" aria-live="assertive" className="login-sub-error">
                            تم استخدام هذا الاسم من قبل!
                        </p>
                    )}
                </div>
                <div className="input-group">
                    <label htmlFor="email">البريد الالكتروني:</label>
                    <input
                        id="email"
                        type="email"
                        placeholder="ادخل بريدك الإلكتروني"
                        required
                        ref={emailRef}
                        onChange={() => {
                            if (isEmailTaken) {
                                setIsEmailTaken(false);
                            }
                        }}
                    />

                    {isEmailTaken && (
                        <p role="alert" aria-live="assertive" className="login-sub-error">
                            تم استخدام هذا البريد من قبل!
                        </p>
                    )}
                </div>
                <div className="input-group">
                    <label htmlFor="phone">رقم الجوال:</label>
                    <input
                        pattern="^[\d+]\d*$"
                        id="phone"
                        placeholder="ادخل رقم جوالك"
                        minLength={10}
                        required
                        ref={phoneRef}
                        onChange={() => {
                            if (isPhoneTaken) {
                                setIsPhoneTaken(false);
                            }
                        }}
                    />

                    {isPhoneTaken && (
                        <p role="alert" aria-live="assertive" className="login-sub-error">
                            تم استخدام هذا الجوال من قبل!
                        </p>
                    )}
                </div>
                <PasswordInput passwordRef={passwordRef} />
                {errorMessage && (
                    <p role="alert" aria-live="assertive" className="login-error">
                        {errorMessage}
                    </p>
                )}
                <button type="submit" className="button submit-button">
                    تسجيل
                </button>
                <p>
                    لديك حساب؟
                    <Link to={"/login"}>تسجيل دخول</Link>
                </p>
            </div>
        </form>
    );
}
interface PasswordInputProps { passwordRef?: RefObject<HTMLInputElement> }
function PasswordInput({ passwordRef }: PasswordInputProps) {
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const confirmPasswordRef = useRef<HTMLInputElement>(null);
    if (password === confirmPassword) {
        confirmPasswordRef.current?.setCustomValidity("");
    } else {
        confirmPasswordRef.current?.setCustomValidity("Passwords do not match!");
    }

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newPassword = e.target.value;
        setPassword(newPassword);
    };

    const handleConfirmPasswordChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const newConfirmPassword = e.target.value;
        setConfirmPassword(newConfirmPassword);
    };

    return (
        <>
            <div className="input-group">
                <label htmlFor="password">كلمة المرور:</label>
                <input
                    onChange={handlePasswordChange}
                    id="password"
                    type="password"
                    placeholder="ادخل كلمة المرور"
                    minLength={8}
                    required
                    ref={passwordRef }
                />
            </div>
            <div className="input-group">
                <label htmlFor="confirm-password">تأكيد كلمة المرور:</label>
                <input
                    onChange={handleConfirmPasswordChange}
                    ref={confirmPasswordRef}
                    id="confirm-password"
                    type="password"
                    placeholder="تأكيد كلمة المرور"
                    required
                />
            </div>
        </>
    );
}

export default Register;