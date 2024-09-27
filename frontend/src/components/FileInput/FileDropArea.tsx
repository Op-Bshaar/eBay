import { useEffect, useState, DragEvent } from 'react';
import "./FileInput.css"
interface FileDropAreaProps {
    file: File | null;
    setFile: (imageFile: File | null) => void;
}
function FileDropArea({ file, setFile }: FileDropAreaProps) {
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
    const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'copy'; // Shows a copy icon when dragging
    };

    const handleDrop = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();

        if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
            const droppedFile = event.dataTransfer.files[0];
            setFile(droppedFile);
        }
    };

    return (
        <div className="image-drop-target" onDragOver={handleDragOver} onDrop={handleDrop}>
            {file && <p>{file.name}</p>}
            {imageURL && <img src={imageURL} />}
            <p>قم بوضع الصورة هنا.</p>
            </div>
    );
};

export default FileDropArea;