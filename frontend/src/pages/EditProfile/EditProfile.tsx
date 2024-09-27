import React, { useEffect, useState } from "react";
import api from "../../helpers/api";
import Input from "react-phone-number-input/input";
import { isValidNumber } from "libphonenumber-js";

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

  useEffect(() => {

    api
      .get("/user/profile")
      .then((response:any) => {
        setUser(response.data);
      })
      .catch((error:any) => {
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
    api
      .put("/user/profile", user)
      .then((response:any) => {
        setUser(response.data);
        setErrorMessage("تم تغيير الملف الشخصي بنجاح");
      })
      .catch((error:any) => {
        console.error("Error updating profile:", error);
        setErrorMessage("فشلت العمليه");
      })
      .finally(() => setIsLoading(false));
  };

  const handleEmailChange = (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();

    setIsEmailLoading(true);
    api
      .put("/user/update-email", { email: user.email })
      .then((response:any) => {
        setUser({ ...user, email: response.data.email });
        setErrorMessage("تم تغيير البريد بنجاح");
      })
      .catch((error:any) => {
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
          <label>الاسم الاول:</label>
          <input
            type="text"
            name="first_name"
            value={user.first_name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>الاسم الاخير:</label>
          <input
            type="text"
            name="last_name"
            value={user.last_name}
            onChange={handleChange}
            required
          />
          <label>الاسم الاخير:</label>
          <input
            type="text"
            name="email"
            value={user.email}
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
          <label>الهاتف:</label>
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
