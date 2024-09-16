import { useState } from "react";
import api from "../../../frontend/src/api";
import React from "react";
import { useRequireAuthentication } from "../../../frontend/src/pages/login/LoginRedirect";
import ProductsDeatils from "../../../frontend/src/pages/ProductsDeatils/productsDeatils"
import Product from "../../../frontend/src/Product";
const EditForm: React.FC<{product: Product}> = ({product: initialProduct }) => {
  useRequireAuthentication();

  
  const [product, updateProduct] = useState({
    title: `${initialProduct.title}`,
    description: `${initialProduct.description}`,
    price: `${initialProduct.price}`,
    image: `${initialProduct.image}`,

  });
  
  const [imageFile, setImageFile] = useState<File | null>(null); // Image file

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    updateProduct({
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
    console.log(formData);
    try {
      const response = await api.put(`/products/${initialProduct.id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        
      });
      console.log(response)
      console.log("Product submitted successfully:", response.data);
    } catch (error) {
      console.error("Error submitting product:", error);
    }
  };

  return (
    <div>
    <div className="currentstate">

    </div>
    <form className="sell-form" onSubmit={handleSubmit}>
      <div>
        <label className="objective">مواصفات المنتج:</label>
        <br />
        <label className="lab">Name</label>
        <input
          type="text"
          name="title"
          onChange={handleChange}
          className="name"
          value={product.title}
        />
        <label className="lab">Description</label>
        <input
          type="text"
          name="description"
          onChange={handleChange}
          className="description"
          value={product.description}
        />
        <label className="lab">Price</label>
        <input
          type="text"
          name="price"
          onChange={handleChange}
          className="price"
          value={product.price}
        />
        <input
          type="text"
          name="category_id"
          onChange={handleChange}
          className="category_id"/>
        <label className="lab">Image</label>
        <img src={product.image}/>
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
    </div>
  );
};

export default EditForm;
