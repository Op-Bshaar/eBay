import { Link, useNavigate } from "react-router-dom";
import "./login-form.css";
import { useRef, useState } from "react";
import axios from "axios";
import {  redirectAfterLogin } from "./LoginRedirect";
import { useAuthenticationContext, User } from "../../context/AuthenticationContext";
import api, { setToken } from "../../api";

function Login() {
    const navigate = useNavigate();
    const usernameRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    const phoneRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const [loginMethod, setLoginMethod] = useState<"username" | "email" | "phone">("username");
    const [errorMessage, setErrorMessage] = useState("");
    const { setUser } = useAuthenticationContext();
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage("");
        let id: string;
        let path: string;
        const password = passwordRef.current?.value ?? "";
        switch (loginMethod) {
            case "username":
                id = usernameRef.current?.value ?? "";
                path = "/login";
                break;
            case "email":
                id = emailRef.current?.value ?? "";
                path = "/loginemail";
                break;
            case "phone":
                id = phoneRef.current?.value ?? "";
                path = "/loginphone";
                break;
        }
        try {
            const response = await api.post(path, {
                [loginMethod]: id,
                password: password,
            });
            setToken(response.data.access_token);
            const _user = response.data.user;
            setUser(new User(
                _user["username"], _user["phone"], _user["email"],
                _user["email_verified_at"] != null,
                _user["phone_verified_at"] != null
            ));
            redirectAfterLogin(navigate);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                // Handle 401 Unauthorized error
                if (error.response?.status === 401) {
                    switch (loginMethod) {
                        case "username":
                            setErrorMessage("خطأ في اسم المستخدم أو كلمة المرور!");
                            break;
                        case "email":
                            setErrorMessage("خطأ في البريد الالكتروني أو كلمة المرور!");
                            break;
                        case "phone":
                            setErrorMessage("خطأ في رقم الجوال أو كلمة المرور!");
                            break;
                        default:
                            setErrorMessage("خطأ في الادخال!");
                            break;
                    }
                }
                    // request was sent but no response
                else if (!error.response && error.request) {
                    setErrorMessage("تعذر الاتصال, تحقق من الاتصال بالشبكة.");
                }
                // server responded with an error other than 401
                else {
                    setErrorMessage("حدث خطأ ما! الرجاء المحاولة مجدداً.");
                }
            }
                // handle non Axios Errors
            else {
                setErrorMessage("حدث خطأ ما! الرجاء المحاولة مجدداً.");
            }
        }
    };

    return (
        <form className="login-form tajawal-extralight" onSubmit={handleSubmit}>
            <h1>ادخل بيناتك</h1>
            <div className="login-form-content">
                <div className="input-group">
                    <label htmlFor="login-method">اختر طريقة الدخول:</label>
                    <select
                        id="login-method"
                        value={loginMethod}
                        onChange={(e) =>
                            setLoginMethod(e.target.value as "username" | "email" | "phone")
                        }
                        required
                    >
                        <option value="username">اسم المستخدم</option>
                        <option value="email">البريد الالكتروني</option>
                        <option value="phone">رقم الجوال</option>
                    </select>
                </div>

                {loginMethod === "username" && (
                    <div className="input-group">
                        <label htmlFor="username">اسم المستخدم:</label>
                        <input
                            className="hide-valid"
                            ref={usernameRef}
                            pattern="^[\p{L}\p{N}_]+$"
                            id="username"
                            minLength={2}
                            type="text"
                            placeholder="ادخل اسم المستخدم"
                            required
                        />
                    </div>
                )}

                {loginMethod === "email" && (
                    <div className="input-group">
                        <label htmlFor="email">البريد الالكتروني:</label>
                        <input
                            ref={emailRef}
                            className="hide-valid"
                            type="email"
                            id="email"
                            placeholder="ادخل بريدك الإلكتروني"
                            required
                        />
                    </div>
                )}

                {loginMethod === "phone" && (
                    <div className="input-group">
                        <label htmlFor="phone">رقم الجوال:</label>
                        <input
                            className="hide-valid"
                            ref={phoneRef}
                            pattern="^[\d+]\d*$"
                            id="phone"
                            placeholder="ادخل رقم جوالك"
                            minLength={10}
                            required
                        />
                    </div>
                )}

                <div className="input-group">
                    <label htmlFor="password">كلمة المرور:</label>
                    <input
                        className="hide-valid"
                        ref={passwordRef}
                        type="password"
                        id="password"
                        placeholder="ادخل كلمة المرور"
                        minLength={8}
                        required
                    />
                </div>
                {errorMessage && (
                    <p role="alert" aria-live="assertive" className="login-error">
                        {errorMessage}
                    </p>
                )}
                <button type="submit" className="button submit-button">
                    تسجيل الدخول
                </button>
                <Link to="/register">حساب جديد</Link>
            </div>
        </form>
    );
}
export default Login;
