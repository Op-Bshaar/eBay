import { useEffect, useState } from "react";
import SideBar from "../../components/SideBar/SideBar";
import HeroItem from "../../components/TopBar/TopBar";
import api from "../../helpers/api";
import Product from "../../utils/Product";
import ProductView from "../../components/ProductView/ProductView";
import "../../styles/Loader.css";
import "./Home.css";
import "../../styles/ProductsContainer.css";
import ErrorMessage from "../../components/errorMessage/Error";
import { Category } from "../../utils/Category";

function Home() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
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
            } finally {
                setIsLoading(false);
            }
        };

        const fetchCategories = async () => {
            try {
                const response = await api.get(`/categories`);
                console.log(response.data);
                setCategories(response.data);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };

        fetchCategories();
        fetchProducts();
    }, []);

    const handleCategoryChange = (categoryId: string) => {
        setSelectedCategory(categoryId);
    };

  // Filter products based on the selected category
  const filteredProducts = selectedCategory
  ? products.filter((product) => product.category_id === selectedCategory)
  : products;

    
    const productsView =
        error || isLoading ? (
            <div className="fill-flex home-message big-message">
                {isLoading && <div className="loader" />}
                {error && <ErrorMessage>معذرة حدثت مشكلة</ErrorMessage>}
            </div>
        ) : (
            <div className="products-container fill-flex">
                {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                        <ProductView key={product.id} product={product} />
                    ))
                ) : (
                    <p>لا توجد منتجات حالياً.</p>
                )}
            </div>
        );

    return (
        <div>
            <div className="topbar-container">

                <HeroItem categories={categories } onCategorySelect={handleCategoryChange} />
                <HeroItem categories={categories}  onCategorySelect={handleCategoryChange} />
                <div className="sidebar-container">
                    <SideBar
                        categories={categories}
                        onCategorySelect={handleCategoryChange}
                    />
                    {productsView}
                </div>
            </div>
        </div>
    );
}

export default Home;
