import { Link, useNavigate } from "react-router-dom";
import "../login-form.css";
import { useRef, useState } from "react";
import api, { setToken, setUser } from "../api";
import axios from "axios";

interface LoginProps {redirectTo?:string };
function Login({redirectTo = "/" }:LoginProps) {
  const navigate = useNavigate();
  const emailRef = useRef<HTMLInputElement>(null);
    const usernameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null); 
    const [loginMethod, setLoginMethod] = useState<('username' | 'email' | 'phone')>('username');
    const [errorMessage, setErrorMessage] = useState("");
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage("");
        let id: string;
        let path: string;
        const password = passwordRef.current?.value ?? "";
        switch (loginMethod) {
            case 'username':
                id = usernameRef.current?.value ?? '';
                path = "/login";
                break;
            case 'email':
                id = emailRef.current?.value ?? '';
                path = "/loginemail";
                break;
            case 'phone':
                id = phoneRef.current?.value ?? '';
                path = "/loginphone";
                break;
        }
        try {
            const response = await api.post(path, {
                [loginMethod]: id,
                "password": password,
            });
            setToken(response.data.access_token);
            setUser(response.data.user["username"], response.data.user["email"], response.data.user["phone"]);
            navigate(redirectTo);
        }
        catch (error) {
            // Handle 401 Unauthorized error
            if (axios.isAxiosError(error)) {


                if (error.response && error.response.status === 401) {
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
                else if (error.request) {
                    setErrorMessage("تعذر الاتصال, تحقق من الاتصال بالشبكة.");

                }
                else {
                    setErrorMessage("حدث خطأ ما! الرجاء المحاولة مجدداً.")
                }
            }
            else {
                setErrorMessage("حدث خطأ ما! الرجاء المحاولة مجدداً.")
            }
        }
    }

    return (
        <form className="login-form tajawal-extralight" onSubmit={handleSubmit}>
            <h1>ادخل بيناتك</h1>
            <div className="login-form-content">
                <div className="input-group">
                    <label htmlFor="login-method">اختر طريقة الدخول:</label>
                    <select
                        id="login-method"
                        value={loginMethod}
                        onChange={(e) => setLoginMethod(e.target.value as ("username" | "email" | "phone"))}
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
                        ref={passwordRef}
                        type="password"
                        id="password"
                        placeholder="ادخل كلمة المرور"
                        minLength={8}
                        required
                    />
                </div>
                {errorMessage && <p className="login-error">{errorMessage }</p>}
                <button type="submit" className="button submit-button">
                    تسجيل الدخول
                </button>
                <Link to="/register">حساب جديد</Link>
            </div>
        </form>
    );
}
export default Login;
