import { useState, useRef, useEffect } from "react";
import api from "../../helpers/api";
import React from "react";
import "./Sell.css";
import "../../styles/Loader.css";
import { useRequireAuthentication } from "../login/LoginRedirect";
import FileInputButton from "../../components/FileInput/FileInputButton";
import FileDropArea from "../../components/FileInput/FileDropArea";
import { Link, useNavigate, useParams } from "react-router-dom";
import ValidateFile from "../../components/FileInput/ValidateFile";
import { PAGE_URLS } from "../../constants/URL";

const ProductForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
    useRequireAuthentication();
    const navigate = useNavigate();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageerror, setImageError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isloadding, setIsLoadding] = useState(false);
  const [createdProductId, setCreatedProductId] = useState<number | null>(null);
    const [updateSuccess, setUpdateSuccess] = useState(false);
  const [product, setProduct] = useState({
    title: "",
    description: "",
    price: "",
    image: null,
  });
  const allowedFileTypes = [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "image/gif",
    "image/svg+xml",
  ];

  useEffect(() => {
    setIsLoadding(true);
    const fetchProduct = async () => {
      if (id) {
        try {
          const response = await api.get(`/sellers/products/${id}`);
          const { title, description, price, image } = response.data;
          setProduct({ title, description, price, image });
        } catch (error) {
          console.error("Error fetching product:", error);
        } finally {
          setIsLoadding(false);
        }
      }
    };
    fetchProduct();
  }, [id]);

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

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setUpdateSuccess(false);
    if (imageerror) {
      return;
    }
    const formData = new FormData();
    formData.append("title", product.title);
    formData.append("description", product.description);
    formData.append("price", product.price);
    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      setIsLoadding(true);
      let response;
      if (id) {
        response = await api.post(`/sellers/products/${id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setUpdateSuccess(true);
        setCreatedProductId(Number(id));
      } else {
        response = await api.post(`/sellers/products`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setCreatedProductId(response.data.id);
      }
    } catch (error) {
      console.error("Error submitting product:", error);
    } finally {
      setIsLoadding(false);
    }
  };

  if (createdProductId) {
    return (
      <div className="tajawal-extralight product-created-successfully">
        <p>{updateSuccess ? "تم تحديث المنتج" : "تمت إضافة المنتج بنجاح"}</p>
        <Link to={`/products/${createdProductId}`} className="button">
          عرض المنتج
            </Link>
            <button className="button" onClick={() => navigate("/seller-portal/add-product") }>إضافة منتج آخر</button>
      </div>
    );
  }

  return (
    <form className="sell-form tajawal-extralight" onSubmit={handleSubmit}>
      <div>
        <>
          <h2 className="objective">مواصفات المنتج:</h2>
          <br />
          <label htmlFor="title" className="lab">
            الاسم
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={product.title}
            onChange={handleChange}
            className="name"
          />
          <label htmlFor="description" className="lab">
            المواصفات
          </label>
          <input
            type="text"
            id="description"
            name="description"
            value={product.description}
            onChange={handleChange}
            className="description"
          />
          <label htmlFor="price" className="lab">
            السعر
          </label>
          <input
            type="text"
            id="price"
            name="price"
            pattern="^\d+(\.\d{1,2})?$"
            inputMode="numeric"
            value={product.price}
            onChange={handleChange}
            className="price"
          />

          {/* Display existing image if present */}
          {product.image && !imageFile && (
            <div className="current-image">
              <img src={product.image} alt="Current product" />
              <p>الصورة الحالية</p>
            </div>
          )}

          <label htmlFor="image" className="lab">
            الصوره
          </label>
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
            اختر صورة المنتج
          </FileInputButton>
          <FileDropArea
            maxSizeInBytes={2048 * 1024}
            allowedFileTypes={allowedFileTypes}
            file={imageFile}
            setFile={setImageFile}
          />
        </>
      </div>

      {updateSuccess && (
        <div>
          <p> تم تحديث المنتج</p>
          <Link to={`/products/${createdProductId}`} className="button">
            عرض المنتج
          </Link>
        </div>
      )}

      <button type="submit" className="submittionbutton" disabled={isLoading}>
        {isLoading ? "جار تحديث المنتج" : "ارسل"}
      </button>
    </form>
  );
};

export default ProductForm;
