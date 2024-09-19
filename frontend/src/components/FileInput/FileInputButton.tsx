import { useEffect, useState } from 'react';
import "./FileInput.css"
interface FileInputButtonProps {
    file: File | null;
    triggerFileInput: () => void;
}
function FileInputButton({ file, triggerFileInput }: FileInputButtonProps) {
    const [imageURL, setImageURL] = useState<string | null>(null);

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
    return (
        <div>
            <button className="button" onClick={triggerFileInput}>
                اختر صورة المنتج
            </button>
            <p >
                {file ? `${file.name}` : ""}
            </p>
            {imageURL && <img className="image-view" src={imageURL} />}
        </div>
    );
}
export default FileInputButton;