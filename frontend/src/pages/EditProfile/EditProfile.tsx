import React, { useEffect, useState } from "react";
import api from "../../helpers/api";
import Input from "react-phone-number-input/input";
import { isValidNumber } from "libphonenumber-js";
import './EditProfile.css';
import { Link } from "react-router-dom";
import { PAGE_URLS } from "../../constants/URL";

const EditProfile: React.FC = () => {
  const [user, setUser] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [isPhoneValid, setIsPhoneValid] = useState(true);
  const [isEmailLoading, setIsEmailLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false); 


  useEffect(() => {
    api
      .get("/user/profile")
      .then((response: any) => {
        setUser({
          first_name: response.data.first_name || "",
          last_name: response.data.last_name || "",
          phone: response.data.phone || "",
          email: response.data.email || "",
        });
        setIsDataLoaded(true); 
      })
      .catch((error: any) => {
        console.error("Error fetching user data:", error);
        setErrorMessage("حدث خطأ في تحميل البيانات.");
      });
  }, []);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };


  const handlePhoneChange = (value: string | undefined) => {
    if (value && isValidNumber(value)) {
      setIsPhoneValid(true);
      setUser({ ...user, phone: value });
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

  // Handle email change request
  // const handleEmailChange = (e: React.FormEvent<HTMLButtonElement>) => {
  //   e.preventDefault();
  //   setIsEmailLoading(true);
  //   api
  //     .put("/user/update-email", { email: user.email })
  //     .then((response: any) => {
  //       setUser({ ...user, email: response.data.email });
  //       setErrorMessage("تم تغيير البريد بنجاح");
  //     })
  //     .catch((error: any) => {
  //       console.error("Error updating email:", error);
  //       setErrorMessage("فشلت العملية");
  //     })
  //     .finally(() => setIsEmailLoading(false));
  // };

  // Show a loading indicator until data is fetched
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
            value={user.first_name}
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
            value={user.last_name} 
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
            value={user.email} 
            onChange={handleChange}
            required
            className="input-edit"
          />
          <Link to={PAGE_URLS.update_email}>
          <button
            type="button"
            // onClick={handleEmailChange}
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
            value={user.phone} // Pre-fill the data from the fetched response
            onChange={handlePhoneChange}
            required
            className="input-edit"
          />
          {!isPhoneValid && (
            <span style={{ color: "red" }}>الرقم غير صحيح</span>
          )}
        </div>

        {/* Error message */}
        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

        {/* Submit button */}
        <button type="submit" className="saving" disabled={isLoading}>
          {isLoading ? "حفظ..." : "حفظ المتغيرات"}
        </button>
      </form>
    </div>
  );
};

export default EditProfile;
