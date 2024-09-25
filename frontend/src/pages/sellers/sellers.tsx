import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Sellers.css";
import api from "../../helpers/api";
import { useRequireEmailVerification } from "../login/LoginRedirect";

const Sellers: React.FC = () => {
    useRequireEmailVerification();
    const [products, setProducts] = useState<any[]>([]);
    const navigate = useNavigate();

    const handleEditProduct = (id: number) => {
        navigate(`/seller/products/${id}`);
    };

    const handleDeleteProduct = async (id: number) => {
        try {
            await api.delete(`sellers/products/${id}`)
                .then(response => {
                    const data = response.data;
                    setProducts(data);
                });
        } catch (error) {
            console.error("Error deleting product:", error);
        }
    };

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await api.get(`sellers/products`);
                setProducts(response.data);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };
        fetchProducts();
    });

    return (
        <div className="seller-products-container">
            {products.length === 0 ? (
                <p>No products available.</p>
            ) : (
                products.map((product: any) => (
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
};

export default Sellers;
