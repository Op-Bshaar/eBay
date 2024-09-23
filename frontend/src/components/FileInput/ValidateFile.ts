function ValidateFile(file: File, maxSizeInBytes?: number, allowedFileTypes?: string[]) {
    let errorMessage = "";
    if (allowedFileTypes && !allowedFileTypes.includes(file.type)) {

        errorMessage = "الملفات غير مدعومة, الرجاء رفع ملف من أحد الأنواع التالية: (jpeg, png, jpg, gif, svg).";
    }
    else if (maxSizeInBytes && file.size > maxSizeInBytes) {
        let size = maxSizeInBytes;
        let unit = "bytes"
        if (size > 1024) {
            size /= 1024;
            unit = "KB";
            if (size > 1024) {
                size /= 1024;
                unit = "MB";
            }
        }
        // Round size to two decimal places for readability
        size = Math.round(size * 100) / 100;
        errorMessage = `حجم الملف يجب ألا يتجاوز ${size} ${unit}.`;
    }
    return errorMessage;
}
export default ValidateFile;