import "./login-form.css";
import { RefObject, useRef, useState } from "react";
interface PasswordInputProps {
    passwordRef?: RefObject<HTMLInputElement>;
    passwordLable?: string;
}
function PasswordInput({ passwordRef, passwordLable = "كلمة المرور:" }: PasswordInputProps) {
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const confirmPasswordRef = useRef<HTMLInputElement>(null);
    if (password === confirmPassword) {
        confirmPasswordRef.current?.setCustomValidity("");
    } else {
        confirmPasswordRef.current?.setCustomValidity("Passwords do not match!");
    }

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newPassword = e.target.value;
        setPassword(newPassword);
    };

    const handleConfirmPasswordChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const newConfirmPassword = e.target.value;
        setConfirmPassword(newConfirmPassword);
    };

    return (
        <>
            <div className="input-group1">
                <label htmlFor="password">{passwordLable}</label>
                <input
                    onChange={handlePasswordChange}
                    id="password"
                    type="password"
                    placeholder="أدخل كلمة المرور"
                    minLength={8}                   
                    ref={passwordRef}
                />
            </div>
            <div className="input-group1">
                <label htmlFor="confirm-password">تأكيد كلمة المرور:</label>
                <input
                    onChange={handleConfirmPasswordChange}
                    ref={confirmPasswordRef}
                    id="confirm-password"
                    type="password"
                    placeholder="تأكيد كلمة المرور"
                    
                />
            </div>
        </>
    );
}
export default PasswordInput;