import React, { useState } from "react";
import api from "../../helpers/api";
import { useAuthenticationContext } from "../../context/AuthenticationContext";
import { useRequireAuthentication } from "../login/LoginRedirect";

function EditPassword() {
  // useRequireAuthentication();
  // const { user, setUser } = useAuthenticationContext();
  // const[text,setText] = useState("");
  // const [email, setEmail] = useState("");
  // const [message, setMessage] = useState("");
  // const [error, setError] = useState("");

  // const handlesubmit = async (e: React.FormEvent) => {
  //   e.preventDefault(); 
  //   setMessage("");
  //   setError("");
  // };

  return (
    <div>
      {/* <form onSubmit={handlesubmit} className="pass-content">
        <label>كلمه المرور السابقه </label>
        <input
          onChange={(e) => setEmail(e.target.value)}
          value={user?.email}
          type="text"
          id="email"
          placeholder="كلمه المرور لسابقه"
          required
        />
        <label>ادخل كلمه المرور الجديده </label>
        <input
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          type="email"
          id="email"
          placeholder="ادخل كلمة المرور الجديده "
          required
        />

        <label>تأكيد كلمه المرور الجديده </label>
        <input
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          type="email"
          id="email"
          placeholder="تأكيد كلمة المرور الجديده "
          required
        />
        <button className="button" type="submit">
          اعاده الارسال
        </button>
      </form>

      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>} */}
      <h1>hh</h1>
    </div>
  );
}

export default EditPassword;
