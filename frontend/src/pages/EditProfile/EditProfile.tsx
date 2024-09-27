import React, { useEffect, useState } from "react";
import axios from "axios";
import Input from "react-phone-number-input/input";
import { isValidNumber } from "libphonenumber-js";

const EditProfile: React.FC = () => {
  const [user, setUser] = useState({
    firstname: "",
    lastname: "",
    phone: "",
    email: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [isPhoneValid, setIsPhoneValid] = useState(true);
  const [isEmailLoading, setIsEmailLoading] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    axios
      .get("/api/user/profile")
      .then((response) => {
        setUser(response.data);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
        setErrorMessage("حدث خطا في تحميل البيانات.");
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
    axios
      .put("/api/user/profile", user)
      .then((response) => {
        setUser(response.data);
        setErrorMessage("تم تغيير الملف الشخصي بنجاح");
      })
      .catch((error) => {
        console.error("Error updating profile:", error);
        setErrorMessage("Failed to update profile");
      })
      .finally(() => setIsLoading(false));
  };

  const handleEmailChange = (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();

    setIsEmailLoading(true);
    axios
      .put("/api/user/update-email", { email: user.email })
      .then((response) => {
        setUser({ ...user, email: response.data.email });
        setErrorMessage("تم تغيير البريد بنجاح");
      })
      .catch((error) => {
        console.error("Error updating email:", error);
        setErrorMessage("فشلت العمليه");
      })
      .finally(() => setIsEmailLoading(false));
  };

  return (
    <div className="edit-profile">
      <h2>تعديل الملف الشخصي</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            name="username"
            value={user.firstname}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>الاسم الاخير:</label>
          <input
            type="text"
            name="lastname"
            value={user.lastname}
            onChange={handleChange}
            required
          />
          <button
            type="button"
            onClick={handleEmailChange}
            disabled={isEmailLoading}
          >
            {isEmailLoading ? "تغيير البريد..." : "تغيير البريد"}
          </button>
        </div>
        <div>
          <label>Phone:</label>
          <Input
            country="SA"
            value={user.phone}
            onChange={handlePhoneChange}
            required
          />
          {!isPhoneValid && (
            <span style={{ color: "red" }}>الرقم غير صحيح</span>
          )}
        </div>
        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
        <button type="submit" disabled={isLoading}>
          {isLoading ? "حفظ..." : "حفظ المتغيرات"}
        </button>
      </form>
    </div>
  );
};

export default EditProfile;
