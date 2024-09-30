import React, { useEffect, useState } from "react";
import api from "../../helpers/api";
import Input from "react-phone-number-input/input";
import { isValidNumber } from "libphonenumber-js";
import "./EditProfile.css";
import { Link } from "react-router-dom";
import { PAGE_URLS } from "../../constants/URL";
import ErrorMessage from "../../../../admindashboard/src/components/errorMessage/Error";
import { useAuthenticationContext } from "../../context/AuthenticationContext";
import { useRequireAuthentication } from "../login/LoginRedirect";

const EditProfile: React.FC = () => {
  useRequireAuthentication();
  const { user, setUser } = useAuthenticationContext();

  const [errorMessage, setErrorMessage] = useState("");
  const [isPhoneValid, setIsPhoneValid] = useState(true);
  const [isEmailLoading, setIsEmailLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  useEffect(() => {
    api
      .get("/user/profile")
      .then((response: any) => {
        setUser(response.data);
        setIsDataLoaded(true);
      })
      .catch((error: any) => {
        console.error("Error fetching user data:", error);
        setErrorMessage("حدث خطأ في تحميل البيانات.");
      });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value || "" });
  };

  const handlePhoneChange = (value: string | undefined) => {
    if (value && isValidNumber(value)) {
      setIsPhoneValid(true);
      setUser({ ...user, phone: value|| ""  });
    } else {
      setIsPhoneValid(false);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isPhoneValid) {
      setErrorMessage("رقم الجوال غير صحيح");
      return;
    }

    setIsLoading(true);
    api
      .put("/user/profile", user)
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

  if (!isDataLoaded) {
    return <div>Loading...</div>;
  }

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
            value={user?.firstName}
            onChange={handleChange}
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
            value={user?.lastName}
            onChange={handleChange}
            required
            className="input-edit"
          />
        </div>

        {/* Email */}
        <div className="label-edit">
          <label>البريد الاكتروني:</label>
          <input
            type="text"
            name="email"
            value={user?.email}
            onChange={handleChange}
            required
            className="input-edit"
          />
          <Link to={PAGE_URLS.update_email}>
            <button
              type="button"
              disabled={isEmailLoading}
              className="edit-email"
            >
              {isEmailLoading ? "تغيير البريد..." : "تغيير البريد"}
            </button>
          </Link>
        </div>

        {/* Phone Number */}
        <div className="label-edit">
          <label>الهاتف:</label>
          <Input
            country="SA"
            value={user?.phone} // Pre-fill the data from the fetched response
            onChange={handlePhoneChange}
            required
            className="input-edit"
          />
          {!isPhoneValid && <ErrorMessage>الرقم غير صحيح</ErrorMessage>}
        </div>
        <Link to={PAGE_URLS.edit_password}>اعد كلمه المرور</Link>

        {/* Error message */}
        {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}

        {/* Submit button */}
        <button type="submit" className="saving" disabled={isLoading}>
          {isLoading ? "حفظ..." : "حفظ المتغيرات"}
        </button>
      </form>
    </div>
  );
};

export default EditProfile;
