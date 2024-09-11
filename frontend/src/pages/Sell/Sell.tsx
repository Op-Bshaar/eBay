import { useState } from "react";
import api from "../../api";
import React from "react";
import "./Sell.css";
import { useRequireAuthentication } from "../login/LoginRedirect";

const ProductForm: React.FC = () => {
  useRequireAuthentication();

  const [product, setProduct] = useState({
    title: "",
    description: "",
    price: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null); // Image file

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setProduct({
      ...product,
      [name]: value,
    });
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
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
      const response = await api.post("/products", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Product submitted successfully:", response.data);
    } catch (error) {
      console.error("Error submitting product:", error);
    }
  };

  return (
    <form className="sell-form" onSubmit={handleSubmit}>
      <div>
        <label className="objective">مواصفات المنتج:</label>
        <br />
        <label className="lab">Name</label>
        <input
          type="text"
          name="title"
          value={product.title}
          onChange={handleChange}
          className="name"
        />
        <label className="lab">Description</label>
        <input
          type="text"
          name="description"
          value={product.description}
          onChange={handleChange}
          className="description"
        />
        <label className="lab">Price</label>
        <input
          type="text"
          name="price"
          value={product.price}
          onChange={handleChange}
          className="price"
        />
        <label className="lab">Image</label>
        <input
          type="file"
          name="image"
          onChange={handleImageChange}
          className="image"
        />
      </div>
      <button type="submit" className="submittionbutton">
        Submit
      </button>
    </form>
  );
};

export default ProductForm;
