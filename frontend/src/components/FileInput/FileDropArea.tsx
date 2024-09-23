﻿import { useEffect, useState, DragEvent } from 'react';
import "./FileInput.css"
import ErrorMessage from '../../../../admindashboard/src/components/errorMessage/Error';
import max from 'react-phone-number-input/max';
interface FileDropAreaProps {
    file: File | null;
    setFile: (imageFile: File | null) => void;
    allowedFileTypes?: string[];
    maxLengthInKB?: number;
}
function FileDropArea({ file, setFile, allowedFileTypes, maxLengthInKB }: FileDropAreaProps) {
    const [imageURL, setImageURL] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState("");
    // Update imageURL when a new file is dropped
    useEffect(() => {
        if (file) {
            const url = URL.createObjectURL(file);
            setImageURL(url);
            return () => URL.revokeObjectURL(url); // Clean up the URL when file changes
        } else {
            setImageURL(null);
        }
    }, [file]);
    const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'copy'; // Shows a copy icon when dragging
    };

    const handleDrop = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();

        if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
            const droppedFile = event.dataTransfer.files[0];
            if (allowedFileTypes && !allowedFileTypes.includes(droppedFile.type)) {

                setErrorMessage("الملفات غير مدعومة, الرجاء رفع ملف من أحد الأنواع التالية: (jpeg, png, jpg, gif, svg).");
            }
            else if (maxLengthInKB && droppedFile.size < maxLengthInKB) {
                setErrorMessage(`حجم الملف يجب ألا يتجاوز ${maxLengthInKB}KB.`);
            }
            else {
                setErrorMessage("");
                setFile(droppedFile);
            }
            event.dataTransfer.clearData();
        }
    };

    return (
        <div className="image-drop-target" onDragOver={handleDragOver} onDrop={handleDrop}>
            {file && <p>{file.name}</p>}
            {imageURL && <img src={imageURL} />}
            <p>قم بوضع الصورة هنا.</p>
            {errorMessage  && <ErrorMessage className="file-drop-error">{errorMessage}</ErrorMessage>}
        </div>
    );
};

export default FileDropArea;