import React, { useState } from "react";
import api from "../../helpers/api";
import "./password.css";
function RequestPasswordReset() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handlesubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      const response = await api.post("/forgot-password", { email });
      setMessage("لقد تم ارسال رابط اعاده كلمه المرور الى البريد الالكتروني");
    } catch (error) {
      setError("حدثت مشكله الرجاء المحاوله لاحقا");
    }
  };

  return (
    <>
      <form onSubmit={handlesubmit} className="pass-content">
        <label>أدخل البريد الالكتروني لاعاده ارسال كلمه المرور </label>
        <input
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          type="email"
          id="email"
          placeholder="ادخل بريدك الإلكتروني"
          required
        />
        <button className="button" type="submit">اعاده الارسال</button>
      </form>

      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </>
  );
}

export default RequestPasswordReset;
