import "./login.css";

function Login() {
  return (
    <div className="tajawal-extralight">
      <h1>أدخل بيناتك</h1>
      <div className="login-style">
        <div className="input-group">
          <label>الايميل الالكتروني/رقم الجوال:</label>
          <input id="email" type="email" placeholder="أدخل بريدك الإلكتروني أو رقم الجوال" />
        </div>
        <div className="input-group">
          <label> كلمه السر:</label>
          <input id="phone" placeholder="أدخل كلمه السر" />
        </div>
        <button type="submit" className="submit-button">تسجيل الدخول</button>
      </div>
    </div>
  );
}

export default Login;
