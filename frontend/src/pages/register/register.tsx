import { Link, useNavigate } from "react-router-dom";
import "../login-form.css";
import { useRef, useState } from "react";
import { useAuth } from "../../context/AuthContext";

function Register() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);

  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {

    const name = nameRef.current?.value || "";
    const email = emailRef.current?.value || "";
    const password = passwordRef.current?.value || "";
    const phone = phoneRef.current?.value || "";

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          phone,
        }), 
      });
      if (!response.ok) {
        throw new Error("Failed to register. Please try again.");
      }
      const { token } = await response.json();
      if (!token) {
        throw new Error("Failed to retrieve token. Please try again.");
      }

      login(phone, email, name, token);
      navigate("/");
    } catch (error) {
      setError("حدث خطأ أعد المحاوله");
    }
  };

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
            minLength={4}
            pattern="^[\p{L}\p{N}_]+$"
            required
            ref={nameRef}
          />
        </div>
        <div className="input-group">
          <label htmlFor="email">البريد الالكتروني:</label>
          <input
            id="email"
            type="email"
            placeholder="ادخل بريدك الإلكتروني"
            required
            ref={emailRef}
          />
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
          />
        </div>
        <PasswordInput />
        {error && <p className="error">{error}</p>}
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

function PasswordInput() {
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const confirmPasswordRef = useRef<HTMLInputElement>(null);

  const validatePassword = () => {
    if (password === confirmPassword) {
      confirmPasswordRef.current?.setCustomValidity("");
    } else {
      confirmPasswordRef.current?.setCustomValidity("Passwords do not match!");
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    validatePassword();
  };

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newConfirmPassword = e.target.value;
    setConfirmPassword(newConfirmPassword);
    validatePassword();
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
