import { useEffect, useState } from "react";
import SideBar from "../../components/SideBar/SideBar";
import TopBar from "../../components/TopBar/TopBar";
import api from "../../api";
import Product from "../../Product";
import ProductView from "../../components/ProductView/ProductView";
import "../../Loader.css";
import "./Home.css";
import "../ProductsContainer.css";
import ErrorMessage from "../../components/errorMessage/Error";
function Home() {
    const [products, setProducts] = useState<Product[]>([]);
    const [error, setError] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setError("");
                setIsLoading(true);
                const response = await api.get(`/products`);
                const data = await response.data;
                setProducts(data);
            } catch (error) {
                console.error("Fetch error:", error);
                setError("An error occurred while fetching products.");
            }
            finally {
                setIsLoading(false);
            }
        };

        fetchProducts();
    }, []);
    const productsView = error || isLoading ?
        <div className="tajawal-extralight home-message big-message">
            {isLoading && <div className="loader" />}
            {error && <ErrorMessage>معذره حدثت مشكله</ErrorMessage>}
        </div> :
        <div className="products-container fill-flex">
            {products.length > 0 ? (
                products.map((product, index) => <ProductView key={index} product={product} />)
            ) : (
                <p>No products available</p>
            )}
        </div>;
    return (
        <div className="tajawal-extralight">
            <div className="topbar-container">
                <TopBar />
                <div className="sidebar-container">
                    <SideBar />
                    {productsView}
                </div>
            </div>
        </div>
    );
}

export default Home;
