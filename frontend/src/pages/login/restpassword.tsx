import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../../api";
import './restpassword.css'

function RestPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Get token and email from URL parameters
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("معذره كلمات المرور غير متطابقه");
      return;
    }

    try {
      const response = await api.post("/rest-password", {
        email,
        token,
        password,
        password_confirmation: confirmPassword, 
      });
      
      setMessage(response.data.message);
      navigate("/login"); 
    } catch (error) {
      console.error("Error resetting password:", error);
      setError("معذره حدثت مشكله");
    }
  };

  return (
    <div className="content-restpass">
      <form onSubmit={handleSubmit}>
        <label>كلمه مرور جديده</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="ادخل كلمه المرور"
          required
        />
        <label>تأكيد كلمه المرور الجديدة</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="تأكيد كلمه المررو"
          required
        />
        <button type="submit">اعاده كلمه المرور</button>
      </form>

      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default RestPassword;
