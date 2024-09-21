import { useState, useRef } from "react";
import api from "../../helpers/api";
import React from "react";
import "./Sell.css";
import { useRequireAuthentication } from "../login/LoginRedirect";
import FileInputButton from "../../components/FileInput/FileInputButton";
import FileDropArea from "../../components/FileInput/FileDropArea";
import { Link } from "react-router-dom";

const ProductForm: React.FC = () => {
  useRequireAuthentication();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [createdProductId, setCreatedProductId] = useState<number | null>(null);
  const [product, setProduct] = useState({
    title: "",
    description: "",
    price: "",
  });
  const allowedFileTypes = [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "image/gif",
    "image/svg+xml",
  ];
  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setProduct({
      ...product,
      [name]: value,
    });
  };
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    event.currentTarget.value = "";
    setImageFile(file);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("title", product.title);
    formData.append("description", product.description);
    formData.append("price", product.price);

    // Append image file if selected
    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      if (createdProductId) {
        setCreatedProductId(null);
      }
      setIsLoading(true);
      const response = await api.put("/sellers/products/${id}", product, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setCreatedProductId(response.data.id);
    } catch (error) {
      console.error("Error submitting product:", error);
    } finally {
      setIsLoading(false);
    }
  };
  if (createdProductId) {
    return (
      <div className="tajawal-extralight product-created-successfully">
        <p>تمت إضافة المنتج بنجاج.</p>
        <Link to={`/products/${createdProductId}`} className="button">
          عرض المنتج
        </Link>
      </div>
    );
  }
  return (
    <form className="sell-form tajawal-extralight" onSubmit={handleSubmit}>
      <div>
        <label className="objective">مواصفات المنتج:</label>
        <br />
        <label className="lab">الاسم</label>
        <input
          type="text"
          name="title"
          value={product.title}
          onChange={handleChange}
          className="name"
        />
        <label className="lab">المواصفات</label>
        <input
          type="text"
          name="description"
          value={product.description}
          onChange={handleChange}
          className="description"
        />
        <label className="lab">السعر</label>
        <input
          type="text"
          name="price"
          pattern="^\d+(\.\d{1,2})?$"
          inputMode="numeric"
          value={product.price}
          onChange={handleChange}
          className="price"
        />
        <label className="lab">الصوره</label>
        <input
          type="file"
          name="image"
          accept={allowedFileTypes.join(",")}
          onChange={handleImageChange}
          ref={fileInputRef}
          className="hidden"
        />
        <FileInputButton file={imageFile} triggerFileInput={triggerFileInput} />
        <FileDropArea
          allowedFileTypes={allowedFileTypes}
          file={imageFile}
          setFile={setImageFile}
        />
      </div>
      <button type="submit" className="submittionbutton" disabled={isLoading}>
        Submit
      </button>
    </form>
  );
};
export default ProductForm;
