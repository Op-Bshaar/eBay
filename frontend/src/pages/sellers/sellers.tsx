import React from "react";
import {  useNavigate } from "react-router-dom";
import "./Sellers.css";

const Sellers: React.FC = () => {

  const navigate = useNavigate();

  const handleAddProduct = () => {
    navigate("/seller/products/add");
  };

  const handleEditProduct = (id: number) => {
    navigate(`/seller/products/edit/${id}`);
  };

  return (
    <div className="sellers-page">

      <button onClick={handleAddProduct}>Add New Product</button>


      <button onClick={() => handleEditProduct(1)}>Edit Product 1</button>
    </div>
  );
};

export default Sellers;
