import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./Sellers.css";
import api from "../../helpers/api";
import { useRequireEmailVerification } from "../login/LoginRedirect";

const Sellers: React.FC = () => {
    const { id } = useParams<{ id: string }>();
  useRequireEmailVerification();
  const [products, setProducts] = useState<any[]>([]);
  const navigate = useNavigate();

  const handleAddProduct = () => {
    navigate("/seller/products/add");
  };

  const handleEditProduct = (id: number) => {
    navigate(`/seller/products/${id}`);
  };

  const handleDeleteProduct = async (id: number) => {
    try {
      await api.delete(`sellers/products/${id}`);

      setProducts((prevProducts) =>
        prevProducts
          .map((seller) => ({
            ...seller,
            products: seller.products.filter(
              (product: any) => product.id !== id
            ),
          }))
          .filter((seller) => seller.products.length > 0)
      );
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  useEffect(() => {
    const fetchProductSeller = async () => {
        try {
            const response = await api.get(`sellers/${id}/products`);
            console.log("API Response:", response);
            setProducts(response.data);
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    if (id) {
        console.log("Fetching products for seller ID:", id);
        fetchProductSeller();
    } else {
        console.warn("No seller ID provided."); 
    }
}, [id]); 

  return (
    <div>
      <button className="button" onClick={handleAddProduct}>
        Add New Product
      </button>
  
      <div>
        {products.length === 0 ? (
          <p>No products available.</p>
        ) : (
          products.map((product: any) => (
            <div key={product.id}>
              <p>اسم المنتج: {product.title}</p>
              <p>السعر: {product.price}</p>
              <button
                className="button"
                onClick={() => handleEditProduct(product.id)}
              >
                تعديل
              </button>
              <button
                className="button"
                onClick={() => handleDeleteProduct(product.id)}
              >
                حذف
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
  
};

export default Sellers;
