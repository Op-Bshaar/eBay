import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Sellers.css";
import api from "../../helpers/api";
import { useRequireEmailVerification } from "../login/LoginRedirect";

const Sellers: React.FC = () => {
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
        prevProducts.map((seller) => ({
          ...seller,
          products: seller.products.filter((product: any) => product.id !== id),
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
        const response = await api.get("sellers/products");
        setProducts(response.data);
      } catch (error) {
        console.log("Error fetching products:", error);
      }
    };

    fetchProductSeller();
  }, []);

  return (
    <div className="sellers-page">
      <button onClick={handleAddProduct}>Add New Product</button>

      <div>
        {products.map((seller) => (
          <div key={seller.id}>
            <h3>Seller: {seller.title}</h3>
            {seller.products.map((product: any) => (
              <div key={product.id}>
                <p>Product Name: {product.title}</p>
                <p>Price: {product.price}</p>
                <button  onClick={() => handleEditProduct(product.id)}>Edit</button>
                <button onClick={() => handleDeleteProduct(product.id)}>Delete</button>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sellers;
