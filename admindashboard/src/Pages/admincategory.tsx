import { useRef, useState } from 'react';
import api from "../../../frontend/src/helpers/api";
import ValidateFile from "../../../frontend/src/components/FileInput/ValidateFile";
import FileInputButton from "../../../frontend/src/components/FileInput/FileInputButton";
import FileDropArea from "../../../frontend/src/components/FileInput/FileDropArea";

const allowedFileTypes = [
  "image/jpeg",
  "image/png",
  "image/jpg",
  "image/gif",
  "image/svg+xml",
];

const AddCategory = () => {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageerror, setImageError] = useState<string | null>(null);




  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      console.log(file);
      const errorMessage = ValidateFile(file, 2048 * 1024, allowedFileTypes);
      if (!errorMessage) {
        event.currentTarget?.setCustomValidity("");
        setImageFile(file);
        setImageError(null);
      } else {
        event.currentTarget?.setCustomValidity(errorMessage);
        setImageFile(null);
        setImageError(errorMessage);
      }
    }
    event.currentTarget.value = "";
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append("name", name);
    if (imageFile) {
        formData.append("icon", imageFile);
    }
    console.log(formData);
    api.post(`/admin/AddCategory`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
  }).then((response) => {
        setMessage(response.data.message);
        setName('');
      })
      .catch((error) => {
        console.error('Error adding category:', error);
      });
  };

  return (
    <div>
      <h2>Add New Category</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Category Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <input
          type="file"
          id="image"
          name="image"
          accept={allowedFileTypes.join(",")}
          onChange={handleImageChange}
          ref={fileInputRef}
          className="hidden"
        />
        <FileInputButton file={imageFile} triggerFileInput={triggerFileInput}>
          اختر صورة التصنيف
        </FileInputButton>
        <FileDropArea
          file={imageFile}
          setFile={setImageFile}
        />
        <button type="submit">Add Category</button>
      </form>
    </div>
  );
};

export default AddCategory;

