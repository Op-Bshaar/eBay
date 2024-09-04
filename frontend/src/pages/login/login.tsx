import { Link } from "react-router-dom";
import "../login-form.css"

function Login() {
    return (
        <form className="login-form tajawal-extralight">
            <h1>ادخل بيناتك</h1>
            <div className="login-form-content">
                <div className="input-group">
                    <label htmlFor="username">
                        اسم المستحدم:
                    </label>
                    <input pattern="^[\p{L}\p{N}_]+$" id="username" minLength={4} type="text" placeholder="ادخل اسم المستخدم" required />
                </div>
                <div className="input-group">
                    <label htmlFor="password"> كلمه المرور:</label>
                    <input type="password" id="password" placeholder="ادخل كلمه المرور" minLength={8} required />
                </div>
                <button type="submit" className="button submit-button">تسجيل الدخول</button>
                <p><Link to="/register">حساب جديد</Link></p>
            </div>
        </form>
    );
}

export default Login;
