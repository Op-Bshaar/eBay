import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Sellers.css";
import "../../styles/Loader.css";
import api from "../../helpers/api";
import { useRequireEmailVerification } from "../login/LoginRedirect";
import Product from "../../utils/Product";

const Sellers: React.FC = () => {
  useRequireEmailVerification();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

    const fetchProducts = async () => {
        try {
            setIsLoading(true)
            const response = await api.get(`sellers/products`);
            setProducts(response.data);
        } catch (error) {
            console.error("Error fetching products:", error);
        }
        finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        fetchProducts();
    }, []);
    if (isLoading) {
        return (
            <div className="seller-products-loader-container">
                <div className="loader" />
            </div>
        );
    }
   
 
  if (isLoading) {
    return (
      <div className="seller-products-loader-container">
        <div className="loader" />
      </div>
    );
  }
  const handleEditProduct = (id: string) => {
    navigate(`/seller-portal/products/${id}`);
  };
  const handleDeleteProduct = async (id: string) => {
    await api
      .delete(`sellers/products/${id}`)
      .then(fetchProducts)
      .catch((error) => {
        console.error("Error deleting product:", error);
      });
  };

  return (
    <div className="seller-products-container">
      {products.length === 0 ? (
        <p>No products available.</p>
      ) : (
        products.map((product) => (
          <div className="seller-product" key={product.id}>
            <h2>اسم المنتج: {product.title}</h2>
            <p>السعر: {product.price}</p>
            <div>
              <button
                className="button"
                onClick={() => handleEditProduct(product.id)}
              >
                تعديل
              </button>
              <button
                className="button delete-product-button"
                onClick={() => handleDeleteProduct(product.id)}
              >
                حذف
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
    return (
        <div className="seller-products-container">
            {products.length === 0 ? (
                <p>No products available.</p>
            ) : (
                products.map((product) => (
                    <div className="seller-product" key={product.id}>
                        <h2>اسم المنتج: {product.title}</h2>
                        <p>السعر: {product.price}</p>
                        {product.isAvailable ?
                            <div>
                                <button
                                    className="button"
                                    onClick={() => handleEditProduct(product.id)}
                                >
                                    تعديل
                                </button>
                                <button
                                    className="button delete-product-button"
                                    onClick={() => handleDeleteProduct(product.id)}
                                >
                                    حذف
                                </button>
                            </div> :
                            <div>المنتج غير متاح للبيع حالياً.</div>
                        }
                    </div>
                ))
            )}
        </div>
    );
};

export default Sellers;
