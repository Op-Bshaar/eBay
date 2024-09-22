import { Link, useNavigate } from "react-router-dom";
import "../register/register.css";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import api,{setToken} from "../../helpers/api";
import PasswordInput from "../login/PasswordInput";
import { PAGE_URLS } from "../../constants/URL";
import "../../styles/Loader.css";
import { useAuthenticationContext } from "../../context/AuthenticationContext";
import { readUser } from "../../utils/User";
import ErrorMessage from "../../../../admindashboard/src/components/errorMessage/Error";
import Input from 'react-phone-number-input/input'
import { E164Number } from "libphonenumber-js"; 
import { isValidPhoneNumber } from 'libphonenumber-js';
function Register() {
    const navigate = useNavigate();
    const [isUsernameTaken, setIsUsernameTaken] = useState<boolean>(false);
    const [isPhoneTaken, setIsPhoneTaken] = useState<boolean>(false);
    const [phonevalue, SetValue] = useState<E164Number | undefined>();
    const [isEmailTaken, setIsEmailTaken] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const formRef = useRef<HTMLFormElement>(null);
    const usernameRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const phoneRef = useRef<HTMLInputElement>(null);
    const firstNameRef = useRef<HTMLInputElement>(null);
    const lastNameRef = useRef<HTMLInputElement>(null);
    const [triggerValidate, setTriggerValidate] = useState(false);
    const { setUser } = useAuthenticationContext();
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!triggerValidate) {
            setTriggerValidate(true);
        }
        const username = usernameRef.current?.value || "";
        const email = emailRef.current?.value || "";
        const password = passwordRef.current?.value || "";
        const phone = phoneRef.current?.value || "";
        const first_name = firstNameRef.current?.value || "";
        const last_name = lastNameRef.current?.value || "";
        if (!formRef.current || !formRef.current.checkValidity()) {
            setErrorMessage("تحقق من الإدخال.");
            return;
        }
        try {
            setIsLoading(true);
            setErrorMessage(null);

            const response = await api.post("register", {
                username,
                email,
                phone,
                password,
                first_name,
                last_name,
            });

            setToken(response.data.access_token);
            const _user = response.data.user;
            setUser(readUser(_user));
            sessionStorage.setItem("verification_email_sent", "true");
            navigate(PAGE_URLS.request_email_verification);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 422 && error.response?.data?.errors) {
                    const _errors = error.response.data.errors;
                    const _usernameTaken = !!_errors["username"];
                    if (isUsernameTaken !== _usernameTaken) {
                        setIsUsernameTaken(_usernameTaken);
                    }

                    const _phoneTaken = !!_errors["phone"];
                    if (isPhoneTaken !== _phoneTaken) {
                        setIsPhoneTaken(_phoneTaken);
                    }

                    const _emailTaken = !!_errors["email"];
                    if (isEmailTaken !== _emailTaken) {
                        setIsEmailTaken(_emailTaken);
                    }

                    if (!_emailTaken && !_usernameTaken && !_phoneTaken) {
                        setErrorMessage("خطأ في الادخال!");
                    }
                } else if (!error.response && error.request) {
                    setErrorMessage("تعذر الاتصال, تحقق من الاتصال بالشبكة.");
                } else {
                    setErrorMessage("حدث خطأ ما! الرجاء المحاولة مجدداً.");
                }
            } else {
                setErrorMessage("حدث خطأ ما! الرجاء المحاولة مجدداً.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form className="login-form1 tajawal-extralight" ref={formRef} onChange={() => setErrorMessage("")}>
            <h1>ادخل بياناتك</h1>
            <div>
                <div className="login-form-content1">
                    <div className="input-group1">
                        <label htmlFor="username">اسم المستخدم:</label>
                        <input
                            type="text"
                            id="username"
                            autoComplete="username"
                            placeholder="ادخل اسم المستخدم"
                            ref={usernameRef}
                            onChange={() => {
                                if (isUsernameTaken) setIsUsernameTaken(false);
                            }}
                            minLength={2}
                            maxLength={30}
                            required
                        />
                        <InputError input={usernameRef.current} name="اسم المستخدم" triggerValidate={triggerValidate} />
                        {isUsernameTaken && (
                            <ErrorMessage>
                                تم استخدام هذا الاسم من قبل!
                            </ErrorMessage>
                        )}
                    </div>

                    <div className="input-group1">
                        <label htmlFor="first-name">الاسم الأول:</label>
                        <input
                            id="first-name"
                            autoComplete="given-name"
                            placeholder="أدخل الاسم الأول"
                            ref={firstNameRef}
                            minLength={2}
                            maxLength={30}
                            required
                        />
                        <InputError input={firstNameRef.current} name="الاسم" triggerValidate={triggerValidate} />
                    </div>

                    <div className="input-group1">
                        <label htmlFor="last-name">الاسم الأخير:</label>
                        <input
                            id="last-name"
                            autoComplete="family-name"
                            placeholder="أدخل الاسم الأخير"
                            ref={lastNameRef}
                            minLength={2}
                            maxLength={30}
                            required
                        />
                        <InputError input={lastNameRef.current} name="الاسم" triggerValidate={triggerValidate} />
                    </div>

                    <div className="input-group1">
                        <label htmlFor="email">البريد الالكتروني:</label>
                        <input
                            id="email"
                            type="email"
                            autoComplete="email"
                            placeholder="ادخل بريدك الإلكتروني"
                            ref={emailRef}
                            onChange={() => {
                                if (isEmailTaken) setIsEmailTaken(false);
                            }}
                            required
                        />
                        <InputError input={emailRef.current} name="البريد الإلكتروني" triggerValidate={triggerValidate} />
                        {isEmailTaken && (
                            <ErrorMessage>
                                تم استخدام هذا البريد من قبل!
                            </ErrorMessage>
                        )}
                    </div>

                    <div className="input-group1">
                        <label htmlFor="phone">رقم الجوال:</label>
                        <Input
                            id="phone"
                            type="tel"
                            placeholder="ادخل رقم جوالك"
                            country="SA"
                            withCountryCallingCode
                            value={phonevalue}
                            international
                            ref={phoneRef}
                            required
                            onChange={(e) => {
                                if (isPhoneTaken)
                                    setIsPhoneTaken(false);
                                SetValue(e);
                            }} />
                        <InputError input={phoneRef.current} name="رقم الجوال" triggerValidate={triggerValidate} />
                        {isPhoneTaken && (
                            <ErrorMessage>
                                تم استخدام هذا الجوال من قبل!
                            </ErrorMessage>
                        )}
                    </div>

                    <PasswordInput passwordRef={passwordRef} />
                    <InputError name="كلمة المرور" input={passwordRef.current} detailedLengthError triggerValidate={triggerValidate} />
                    {errorMessage && (
                        <ErrorMessage>
                            {errorMessage}
                        </ErrorMessage>
                    )}
                </div>
            </div>

            <button
                type="submit"
                onClick={handleSubmit}
                className="button submit-button"
                disabled={isLoading}
            >
                تسجيل
            </button>

            <p style={{ width: "100%" }}>
                لديك حساب؟
                <Link className="link" to={PAGE_URLS.login}>
                    تسجيل دخول
                </Link>
            </p>
        </form>
    );
}
interface InputErrorProps {
    input: HTMLInputElement | null;
    name?: string;
    required?: boolean;
    className?: string;
    detailedLengthError?: boolean;
    triggerValidate?: boolean;
}

function InputError({
    input,
    name = "هذا الحقل",
    className = "",
    detailedLengthError = false,
    triggerValidate = false,
}: InputErrorProps) {
    const [errorMessage, setErrorMessage] = useState("");
    const [touched, setTouched] = useState<boolean>(false);
    useEffect(() => {
        const handleInput = () => {
            input?.checkValidity();
            const validity = input?.validity;
            let error = "";
            if (validity && !validity.valid) {
                error = 'خطأ في الإدخال.';
                if (validity.valueMissing) {
                    error = `الرجاء إدخال ${name}.`;
                }
                else if (validity.patternMismatch || validity.badInput || validity.typeMismatch) {
                    error = `${name} غير صالح.`;
                }
                else if (validity.tooShort) {
                    if (detailedLengthError) {
                        error = `${name} لا يقل عن ${input.minLength} حروف.`;
                    }
                    else {
                        error = `${name} غير صالح.`;
                    }
                }
                else if (validity.tooLong) {
                    if (detailedLengthError) {
                        error = `${name} لا يزيد عن ${input.maxLength} حروف.`;
                    }
                    else {
                        error = `${name} غير صالح.`;
                    }
                }
            }

            // Update state with error messages
            setErrorMessage(error);
        };
        const handleBlur = () => {
            if (!touched) {
                setTouched(true);
            }
        };
        if (input) {
            handleInput();
            input.addEventListener('input', handleInput);
            input.addEventListener('change', handleInput);
            if (!touched) {
                input.addEventListener("blur", handleBlur);
            }
            // Clean up the event listener
            return () => {
                input.removeEventListener('input', handleInput);
                input.removeEventListener('change', handleInput);
                if (!touched) {
                    input.removeEventListener("blur", handleBlur);
                }
            };
        }
    }, [detailedLengthError, input, name, touched]);

    // Render error messages if any
    return (touched || triggerValidate) && errorMessage && <ErrorMessage className={className }>{errorMessage}</ErrorMessage>
}
export default Register;
