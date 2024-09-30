import React, { useState } from "react";
import api from "../../helpers/api";
import Input from "react-phone-number-input/input";
import { isValidNumber } from "libphonenumber-js";
import "./EditProfile.css";
import "../../styles/Loader.css";
import { Link } from "react-router-dom";
import { PAGE_URLS } from "../../constants/URL";
import ErrorMessage from "../../../../admindashboard/src/components/errorMessage/Error";
import { useAuthenticationContext } from "../../context/AuthenticationContext";
import { useRequireAuthentication } from "../login/LoginRedirect";

const EditProfile: React.FC = () => {
  useRequireAuthentication();
  const { user, setUser } = useAuthenticationContext();
  const [firstName, setFirstName] = useState(user?.firstName ?? "");
  const [lastName, setLastName] = useState(user?.lastName ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [currentPassword, setCurrentPassword] = useState(user?.currentPassword??"");
  const [newPassword, setNewPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isPhoneValid, setIsPhoneValid] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handlePhoneChange = (value: string | undefined) => {
    if (value && isValidNumber(value)) {
      setIsPhoneValid(true);
    } else {
      setIsPhoneValid(false);
    }
    setPhone(value || "");
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isPhoneValid) {
      setErrorMessage("رقم الجوال غير صحيح");
      return;
    }

    setIsLoading(true);
    
    const updatedData = {
      firstName,
      lastName,
      phone,
      currentPassword,
      newPassword,
    };

    api
      .put("/user/profile", updatedData) 
      .then((response: any) => {
        setUser(response.data);
        setErrorMessage("تم تغيير الملف الشخصي بنجاح");
      })
      .catch((error: any) => {
        console.error("Error updating profile:", error);
        setErrorMessage("فشلت العملية");
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <div className="edit-profile">
      <h2>تعديل الملف الشخصي</h2>
      <form onSubmit={handleSubmit} className="edit-form">
        {/* First Name */}
        <div className="label-edit">
          <label>الاسم الاول:</label>
          <input
            type="text"
            name="first_name"
            value={firstName}
            onChange={(e) => setFirstName(e.currentTarget.value)}
            required
            className="input-edit"
          />
        </div>

        {/* Last Name */}
        <div className="label-edit">
          <label>الاسم الاخير:</label>
          <input
            type="text"
            name="last_name"
            value={lastName}
            onChange={(e) => setLastName(e.currentTarget.value)}
            required
            className="input-edit"
          />
        </div>

        {/* Phone Number */}
        <div className="label-edit">
          <label>الهاتف:</label>
          <Input
            country="SA"
            value={phone}
            onChange={handlePhoneChange}
            required
            className="input-edit"
          />
          {!isPhoneValid && <ErrorMessage>الرقم غير صحيح</ErrorMessage>}
        </div>

        {/* Current Password */}
        <div className="label-edit">
          <label>كلمه المرور الحاليه:</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.currentTarget.value)}
            required
            className="input-edit"
          />
        </div>

        {/* New Password */}
        <div className="label-edit">
          <label>كلمه المرور الجديدة:</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.currentTarget.value)}
            className="input-edit"
          />
        </div>


        {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}

        <button type="submit" className="saving" disabled={isLoading}>
          {isLoading ? "يتم الحفظ" : "حفظ التغييرات"}
        </button>
        {isLoading && <span className="small-loader center-loader" />}
      </form>
    </div>
  );
};

export default EditProfile;
