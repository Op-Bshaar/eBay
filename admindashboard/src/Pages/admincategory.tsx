import { useRef, useState } from 'react';
import api from "../../../frontend/src/helpers/api";
import ValidateFile from "../../../frontend/src/components/FileInput/ValidateFile";
import FileInputButton from "../../../frontend/src/components/FileInput/FileInputButton";
import FileDropArea from "../../../frontend/src/components/FileInput/FileDropArea";
import './admincatg.css'
import { Link } from 'react-router-dom';


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
  const [successful, setSucces] = useState(Boolean);



  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  const handlereset = ()=>
    {
      setName('');
      setImageFile(null);
      setSucces(false);
    }
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
        setSucces(true);
      })
      .catch((error) => {
        console.error('Error adding category:', error);
      });
  };
if(successful)
  {
    return (
      <div className="product-created-successfully">
        <p>تمت إضافة الصنف بنجاح</p>
        <button className="button" onClick={handlereset}>
          إضافة منتج آخر
        </button>
      </div>
    );
  }
  return (
    <div className="add-category-container">
      <h2>إضافة صنف جديد</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div  className="form-group">
          <label>اسم الصنف:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
              placeholder="أدخل اسم الصنف"
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
        <button type="submit" className='button'>Add Category</button>
      </form>
    </div>
  );
};

export default AddCategory;

