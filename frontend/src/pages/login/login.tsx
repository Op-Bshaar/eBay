import { Link, useNavigate } from "react-router-dom";
import "../login-form.css";
import { useRef, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { BASE_URL } from "../../constants/BaseUrl";

function Login() {
  const navigate = useNavigate();
  const emailRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [loginMethod, setLoginMethod] = useState<string>("username");
  const [error, setError] = useState<string>("");

  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const email = emailRef.current?.value || "";
    const name = nameRef.current?.value || "";
    const phone = phoneRef.current?.value || "";
    const password = passwordRef.current?.value || "";

    if (!password || (!name && !email && !phone)) {
      setError("أدخل كل البيانات");
      return;
    }

    try {
      const loginData = {
        name: loginMethod === "username" ? name : undefined,
        email: loginMethod === "email" ? email : undefined,
        phone: loginMethod === "phone" ? phone : undefined,
        password,
      };

      const response = await fetch(`${BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      const result = await response.text();
      console.log(result);

      if (!response.ok) {
        throw new Error("Failed to login. Please check your credentials.");
      }

      const { token } = await response.json();
      if (!token) {
        throw new Error("Failed to retrieve token. Please try again.");
      }

      login(name, email, phone, token);
      navigate("/");
    } catch (error) {
      setError("Something went wrong.");
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
            onChange={(e) => setLoginMethod(e.target.value)}
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
              ref={nameRef}
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

        {error && <p className="error">{error}</p>}

        <button type="submit" className="button submit-button">
          تسجيل الدخول
        </button>
        <p>
          <Link to="/register">حساب جديد</Link>
        </p>
      </div>
    </form>
  );
}

export default Login;
