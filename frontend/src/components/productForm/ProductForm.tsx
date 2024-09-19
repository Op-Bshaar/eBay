// import React, { useState, useEffect } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import api from "../../helpers/api";
// import "./ProductForm.css";

// interface IProduct {
//   id?: number;
//   title: string;
//   description: string;
//   price: string;
//   available?: boolean;
// }

// const ProductForm: React.FC = () => {
//   const [product, setProduct] = useState<IProduct>({
//     title: "",
//     description: "",
//     price: "",
//   });
//   const [isEditMode, setIsEditMode] = useState(false);
//   const { id } = useParams<{ id?: string }>();
//   const navigate = useNavigate();

//   useEffect(() => {
    
//     if (id) {
//       setIsEditMode(true);
//       fetchProduct(id); 
//     } else {
//       setIsEditMode(false);
//     }
//   }, [id]);

//   const fetchProduct = async (productId: string) => {
//     try {
//       const response = await api.get(`/products/${productId}`);
//       setProduct(response.data);
//     } catch (error) {
//       console.error("Error fetching product:", error);
//     }
//   };

//   const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = event.target;
//     setProduct({
//       ...product,
//       [name]: value,
//     });
//   };

//   const handleSubmit = async (event: React.FormEvent) => {
//     event.preventDefault();

//     try {
//       if (isEditMode) {

//         await api.put(`/products/${id}`, product);
//         alert("Product updated successfully");
//       } else {
     
//         await api.post("/products", product);
//         alert("Product added successfully");
//       }
//       navigate("/seller"); 
//     } catch (error) {
//       console.error("Error submitting product:", error);
//     }
//   };

//   return (
//     <div className="product-form-container">
//       <h1>{isEditMode ? "Edit Product" : "Add New Product"}</h1>
//       <form onSubmit={handleSubmit}>
//         <label>Product Title</label>
//         <input
//           type="text"
//           name="title"
//           value={product.title}
//           onChange={handleChange}
//           required
//         />

//         <label>Description</label>
//         <textarea
//           name="description"
//           value={product.description}
//           onChange={handleChange}
//           required
//         />

//         <label>Price</label>
//         <input
//           type="text"
//           name="price"
//           value={product.price}
//           onChange={handleChange}
//           required
//         />

//         <button type="submit">{isEditMode ? "Update Product" : "Add Product"}</button>
//       </form>
//     </div>
//   );
// };

// export default ProductForm;
