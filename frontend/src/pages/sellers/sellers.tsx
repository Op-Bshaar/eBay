import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Sellers.css";
import "../../styles/Loader.css";
import api from "../../helpers/api";
import { useRequireEmailVerification } from "../login/LoginRedirect";
import Product from "../../utils/Product";
import ProductView from "../../components/ProductView/ProductView";

const Sellers: React.FC = () => {
    useRequireEmailVerification();
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const fetchProducts = async () => {
        try {
            setIsLoading(true)
            const response = await api.get(`sellers/products`);
            const _products = response.data as Product[];
            setProducts(_products.sort((a, b) => {
                if (a.isAvailable === b.isAvailable) return 0;
                return a.isAvailable ? -1 : 1;
            }));
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
        navigate(`/seller-portal/products/edit/${id}`);
    };
    const handleDeleteProduct = (product:Product) => {
        const confirmDelete = window.confirm(`هل تريد حذف المنتج الآتي ${product.title}؟`);
        if (!confirmDelete) {
            return;
        }
        api
            .delete(`sellers/products/${product.id}`)
            .then(fetchProducts)
            .catch((error) => {
                console.error("Error deleting product:", error);
            });
    };
    return (
        <div className="seller-products-container">
            {products.length === 0 ? (
                <p>ليس لديك منتجات.</p>
            ) : (
                products.map((product) => (
                    <div className="seller-product" key={product.id}>
                        <ProductView product={product} viewer="seller" clickToGo={false} />
                        {product.isAvailable ?
                            <div className="center-text">
                                <button
                                    className="button"
                                    onClick={() => handleEditProduct(product.id)}
                                >
                                    تعديل
                                </button>
                                <button
                                    className="button delete-product-button"
                                    onClick={() => handleDeleteProduct(product)}
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
