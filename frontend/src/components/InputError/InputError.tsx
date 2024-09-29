import { useEffect, useState } from "react";
import ErrorMessage from "../errorMessage/Error";

interface InputErrorProps {
    input: HTMLInputElement | null;
    value?: unknown;
    name?: string;
    className?: string;
    detailedLengthError?: boolean;
    triggerValidate?: boolean;
}

function InputError({
    input,
    value,
    name = "هذا الحقل",
    className = "",
    detailedLengthError = false,
    triggerValidate = false,
}: InputErrorProps) {
    const [errorMessage, setErrorMessage] = useState("");
    const [touched, setTouched] = useState<boolean>(false);
    value = value ?? input?.value;
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
                else if (validity.rangeUnderflow) {
                    const min = input?.min;
                    error = min ? `${name} لا يقل عن ${min}.` : `${name} أقل من القيمة المطلوبة.`;
                }
                else if (validity.rangeOverflow) {
                    const max = input?.max;
                    error = max ? `${name} لا يزيد عن ${max}.` : `${name} أكبر من القيمة المطلوبة.`;
                }

                else if (validity.customError) {
                    error = input.validationMessage;
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
    }, [detailedLengthError, input, name, touched, value]);

    // Render error messages if any
    return (touched || triggerValidate) && errorMessage && <ErrorMessage className={className}>
        <span>{errorMessage}</span></ErrorMessage>
}
export default InputError;