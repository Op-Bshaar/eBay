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
import axios from "axios";

function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
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
        handleError(error);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await api.get(`/categories`);
        setCategories(response.data);
      } catch (error) {
        handleError(error);
      }
    };

    fetchCategories();
    fetchProducts();
  }, []);
  const handleError = (error: unknown) => {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        setError("حدثت مشكلة في الاتصال بالخادم");
      } else if (error.request) {
        setError("تعذر الاتصال بالخادم. يرجى التحقق من اتصالك بالإنترنت.");
      } else {
        setError("حدث خطأ غير معروف.");
      }
    } else {
      setError("حدث خطأ. حاول إعادة تحميل الصفحة.");
    }
  };

  const handleCategoryChange = (category: Category) => {
    setSelectedCategory(category);
  };

  // Filter products based on the selected category
  const filteredProducts = selectedCategory
    ? products.filter((product) => product.category_id === selectedCategory.id)
    : products;

  const productsView =
    error || isLoading ? (
      <div className="fill-flex home-message big-message">
        {isLoading && <div className="loader" />}
        {error && <ErrorMessage> تعذر الاتصال..حاول مجددا </ErrorMessage>}
      </div>
    ) : (
      <div className="products-container fill-flex">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <ProductView key={product.id} product={product} />
          ))
        ) : selectedCategory ? (
          <p>لا توجد {selectedCategory.name} حالياً.</p>
        ) : (
          <p>لا توجد منتجات حالياً.</p>
        )}
      </div>
    );

  return (
    <div className="main-container">
      
      <div className="topbar-container">
      <button className="deselect-button" onClick=
        {()=>{
          setSelectedCategory(null)
          handleCategoryChange
        }
        }>
          x
        </button>
        <HeroItem
          categories={categories}
          onCategorySelect={handleCategoryChange}
        />
      </div>
      <div className="sidebar-container">
        <div className="sidebar">
          <SideBar
            categories={categories}
            onCategorySelect={handleCategoryChange}
          />
        </div>
        <div className="products-container">{productsView}</div>
      </div>
    </div>
  );
}

export default Home;
