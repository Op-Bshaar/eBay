import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../../api"; // Your configured Axios instance

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
      const response = await api.post("/reset-password", {
        email,
        token,
        password,
        password_confirmation: confirmPassword, 
      });
      
      setMessage(response.data.message);
      navigate("/login"); 
    } catch (error) {
      console.error("Error resetting password:", error);
      setError("There was an error resetting your password. Please try again.");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>:كلمه مرور جديده</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter new password"
          required
        />
        <label>تأكيد كلمه المرور الجديدة</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm new password"
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
