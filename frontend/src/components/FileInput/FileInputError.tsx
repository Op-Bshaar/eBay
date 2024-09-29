import { ReactNode, useEffect, useState } from 'react';
import ErrorMessage from '../../../../admindashboard/src/components/errorMessage/Error';
import ValidateFile from './ValidateFile';
interface FileInputErrorProps {
    file: File | null;
    maxSizeInBytes?: number;
    allowedTypes?: string[];
    required?: boolean;
    className?: string;
    name?: string;
    input?: HTMLInputElement | null;
    triggerValidate?: boolean;
}
function FileInputError({
    file,
    maxSizeInBytes,
    allowedTypes,
    required = false,
    className,
    name = "الصورة",
    input,
    triggerValidate = false,
}: FileInputErrorProps): ReactNode {
    const [errorMessage, setErrorMessage] = useState("");
    const [touched, setTouched] = useState(!!file || triggerValidate);

    // Update error message when any of the input props or validation triggers change
    useEffect(() => {
        if (file && !touched) {
            setTouched(true);
        }
        let newErrorMessage = "";
        // If required and no file is provided
        if (required && !file) {
            newErrorMessage = `الرجاء اخيار ${name}.`;
        } else if (file) {
            // Validate the file for size and type restrictions
            newErrorMessage = ValidateFile(file, maxSizeInBytes, allowedTypes);
        }

        // Update the input's custom validity message if input is provided
        if (input) {
            input.setCustomValidity(newErrorMessage);
        }

        setErrorMessage(newErrorMessage);
    }, [file, required, name, maxSizeInBytes, allowedTypes, input, triggerValidate, touched]);

    // Conditionally render the error message
    return errorMessage ? (triggerValidate || touched) &&
        <ErrorMessage className={className}>{errorMessage}</ErrorMessage> : null;
}
export default FileInputError;