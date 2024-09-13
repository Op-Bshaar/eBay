import React, { useEffect, useState } from "react";
import SideBar from "../../components/SideBar/SideBar";
import HeroItem from "../../components/TopBar/TopBar";
import api from "../../api";
import Product from "../../Product";
import ProductView from "../../components/ProductView/ProductView";
import "../../Loader.css";
import "./Home.css";
import "../ProductsContainer.css";
import ErrorMessage from "../../components/errorMessage/Error";
import { Category } from "../../Category";

function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
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
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchProducts();
    fetchCategories();
  }, []);

  const handleCategoryChange = (categoryId: number) => {
    console.log(categoryId);
    setSelectedCategory(categoryId);
  };

  // Filter products based on the selected category
  const filteredProducts = selectedCategory
    ? products.filter((product) => product.category?.id === selectedCategory)
    : products;

  const productsView =
    error || isLoading ? (
      <div className="tajawal-extralight home-message big-message">
        {isLoading && <div className="loader" />}
        {error && <ErrorMessage>معذره حدثت مشكله</ErrorMessage>}
      </div>
    ) : (
      <div className="products-container fill-flex">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product, index) => (
            <ProductView key={index} product={product} />
          ))
        ) : (
          <p>No products available</p>
        )}
      </div>
    );

  return (
    <div className="tajawal-extralight">
      <div className="topbar-container">
        <HeroItem onCategorySelect={handleCategoryChange} />
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
