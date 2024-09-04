import { Link } from "react-router-dom";
import "../login-form.css"
import { useRef, useState } from "react";

function Register() {
    return (
        <form className="login-form tajawal-extralight">
            <h1>ادخل بيناتك</h1>
            <div className="login-form-content">
                <div className="input-group">
                    <label htmlFor="name">الاسم</label>
                    <input type="text" id="name" placeholder=" ادخل الاسم" minLength={2} required />
                </div>
                <div className="input-group">
                    <label htmlFor="email">البريد الالكتروني:</label>
                    <input id="email" type="email" placeholder="ادخل بريدك الإلكتروني" required />
                </div>
                <div className="input-group">
                    <label htmlFor="phone">رقم الجوال:</label>
                    <input pattern="^[\d+]\d*$" id="phone" placeholder="ادخل رقم جوالك" minLength={10} required />
                </div>
                <PasswordInput/>
                <button type="submit" className="button submit-button">تسجيل</button>
                <p>
                    لديك حساب؟
                    <Link to={"/login"}>تسجيل دخول</Link>
                </p>
            </div>
        </form>
    );
}
function PasswordInput() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const confirmPasswordRef = useRef<HTMLInputElement>(null);
    const validatePassword = () => {
        if (password === confirmPassword) {

            confirmPasswordRef.current?.setCustomValidity('');
        }
        else {
            confirmPasswordRef.current?.setCustomValidity('passwords do not match!');
        }
    }
    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newPassword = e.target.value;
        setPassword(newPassword);
        validatePassword();
    };

    const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newConfirmPassword = e.target.value;
        setConfirmPassword(newConfirmPassword);
        validatePassword();
    };
    return <>
        <div className="input-group">
            <label htmlFor="password">كلمة المرور:</label>
            <input onChange={handlePasswordChange} id="password" type="password" placeholder="ادخل كلمة المرور" minLength={8} required />
        </div>
        <div className="input-group">
            <label htmlFor="confirm-password">تأكيد كلمه المرور:</label>
            <input
                onChange={handleConfirmPasswordChange}
                ref={confirmPasswordRef}
                id="confirm-password"
                type="password"
                placeholder="تأكيد كلمة المرور"
                required />
        </div>
    </>
}
export default Register;
