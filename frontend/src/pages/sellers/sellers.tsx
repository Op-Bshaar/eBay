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
    console.log(products);
    return (
        <div className="sellers-page">
            <button className="button" onClick={handleAddProduct}>Add New Product</button>

            <div>
                {products.map((seller) => (
                    <div className="center-text" key={seller.id}>
                        {seller.products.map((product: any) => (
                            <div key={product.id}>
                                <p>اسم المنتج: {product.title}</p>
                                <p>السعر: {product.price}</p>
                                <button className="button" onClick={() => handleEditProduct(product.id)}>تعديل</button>
                                <button className="button" onClick={() => handleDeleteProduct(product.id)}>حذف</button>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Sellers;
