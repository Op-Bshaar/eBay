import { Link, useNavigate } from "react-router-dom";
import "../login-form.css";
import { useRef, useState } from "react";
import { useAuth } from "../../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const emailRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string>("");

  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const email = emailRef.current?.value || "";
    const name = nameRef.current?.value || "";
    const phone = phoneRef.current?.value || "";
    const password = passwordRef.current?.value || "";

    if (!name || !password || !email || !phone) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          phone,
          password,
        }),
      });

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
          <label htmlFor="username">اسم المستخدم:</label>
          <input
            ref={nameRef}
            pattern="^[\p{L}\p{N}_]+$"
            id="username"
            minLength={4}
            type="text"
            placeholder="ادخل اسم المستخدم"
            required
          />
        </div>
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
