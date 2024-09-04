import { Link } from "react-router-dom";
import "./register.css";

function Register() {
  return (
    <div className="tajawal-extralight">
      <h1>ادخل بيناتك</h1>
      <div className="register-style">
        <div className="input-group">
          <label htmlFor="name">الاسم</label>
          <input id="name" placeholder=" ادخل الاسم" />
        </div>
        <div className="input-group">
          <label htmlFor="email">البريد الالكتروني:</label>
          <input id="email" type="email" placeholder="ادخل بريدك الإلكتروني" />
        </div>
        <div className="input-group">
          <label htmlFor="phone">رقم الجوال:</label>
          <input id="phone" placeholder="ادخل رقم جوالك" />
        </div>
        <div className="input-group">
          <label htmlFor="password">كلمة المرور:</label>
          <input id="password" type="password" placeholder="ادخل كلمة المرور" />
        </div>
        <div className="input-group">
          <label htmlFor="confirm-password">تأكيد كلمه المرور:</label>
          <input
            id="confirm-password"
            type="password"
                      placeholder="تأكيد كلمة المرور"
          />
        </div>
        <div className="footer-container">
          <button type="submit" className="submit-button">
            تسجيل
                  </button>
                  <p>
                     لديك حساب بالفعل؟
                      <Link to={"/login"}>تسجيل دخول</Link>
                  </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
