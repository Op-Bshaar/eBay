import { Link } from "react-router-dom";
import "./register.css";

function Register() {
  return (
    <div className="tajawal-extralight">
      <h1>أدخل بيناتك</h1>
      <div className="register-style">
        <div className="input-group">
          <label>الاسم</label>
          <input id="phone" placeholder=" أدخل الاسم" />
        </div>
        <div className="input-group">
          <label>الايميل الالكتروني:</label>
          <input id="email" type="email" placeholder="أدخل بريدك الإلكتروني" />
        </div>
        <div className="input-group">
          <label>رقم الجوال:</label>
          <input id="phone" placeholder="أدخل رقم جوالك" />
        </div>
        <div className="input-group">
          <label htmlFor="password">كلمه السر:</label>
          <input id="password" type="password" placeholder="أدخل كلمة السر" />
        </div>
        <div className="input-group">
          <label htmlFor="confirm-password">تأكيد كلمه السر:</label>
          <input
            id="confirm-password"
            type="password"
            placeholder="تأكيد كلمة السر"
          />
        </div>
        <div className="footer-container">
          <h4>
            <Link to={"../login"}>هل لديك حساب بالفعل؟</Link>
          </h4>
          <button type="submit" className="submit-button">
            تسجيل
          </button>
        </div>
      </div>
    </div>
  );
}

export default Register;
