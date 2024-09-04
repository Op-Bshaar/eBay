import { Link } from "react-router-dom";
import "./login.css";

function Login() {
  return (
    <form className="tajawal-extralight">
      <h1>ادخل بيناتك</h1>
      <div className="login-style">
        <div className="input-group">
          <label htmlFor="user">الايميل الالكتروني/رقم الجوال:</label>
          <input id="user" type="text" placeholder="أدخل بريدك الإلكتروني أو رقم الجوال" required/>
        </div>
        <div className="input-group">
          <label htmlFor="password"> كلمه السر:</label>
                  <input type="password" id="password" placeholder="أدخل كلمه السر" required/>
        </div>
              <button type="submit" className="submit-button">تسجيل الدخول</button>
              <p><Link to="/register">حساب جديد</Link></p>
          </div>
    </form>
  );
}

export default Login;
