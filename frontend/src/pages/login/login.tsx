import { Link } from "react-router-dom";
import "../login-form.css"

function Login() {
  return (
      <form className="login-form tajawal-extralight">
      <h1>ادخل بيناتك</h1>
          <div className="login-form-content">
        <div className="input-group">
          <label htmlFor="user">البريد الالكتروني / رقم الجوال:</label>
          <input id="user" type="text" placeholder="ادخل بريدك الإلكتروني أو رقم الجوال" required/>
        </div>
        <div className="input-group">
                  <label htmlFor="password"> كلمه المرور:</label>
                  <input type="password" id="password" placeholder="ادخل كلمه المرور" required/>
        </div>
              <button type="submit" className="button submit-button">تسجيل الدخول</button>
              <p><Link to="/register">حساب جديد</Link></p>
          </div>
    </form>
  );
}

export default Login;
