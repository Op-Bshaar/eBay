import { useEffect, useState } from "react";
import  Product from "../../../frontend/src/utils/Product";
import ProductView from "../../../frontend/src/components/ProductView/ProductView";
import { Link } from "react-router-dom";
import SideBar from "../../../frontend/src/components/SideBar/SideBar";
import TopBar from "../../../frontend/src/components/TopBar/TopBar";
import Navbar from "../../../frontend/src/components/nav/Navbar"
import api from "../../../frontend/src/helpers/api";
import { Category } from "../../../frontend/src/utils/Category";
import ErrorMessage from "../components/errorMessage/Error";
import HeroItem from "../../../frontend/src/components/TopBar/TopBar";
import "./css/AdminProducts.css";
import Editpopup from "./Editpopup";
import EditForm from "./AdminEdit";


  function AdminProducts() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
    const [error, setError] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);
    const [EditIsVisible, Showpopup] = useState(false);

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

        fetchProducts();
        fetchCategories();
    }, []);

    
     const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
     const handleEditClick=(product: Product)=>
       {
         setSelectedProduct(product);
         Showpopup(true);
       };
       const handleEditClose=()=>
        {
          setSelectedProduct(null);
          Showpopup(false);
        };
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
            <div className="fill-flext home-message big-message">
                {isLoading && <div className="loader" />}
                {error && <ErrorMessage>معذرة حدثت مشكلة</ErrorMessage>}
            </div>
        ) : (
            <div className="products-container fill-flex">
                {filteredProducts.length > 0 ? (
                    filteredProducts.map((product, index) => (
                      <div>
                        <ProductView key={index} product={product} />
                        <button className="editbutton" onClick={()=>handleEditClick(product)}>Edit</button>
                        </div>
                        
                    ))
                ) : (
                    <p>لا توجد منتجات حالياً.</p>
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
            <Editpopup isVisible={EditIsVisible} onClose={handleEditClose}>
               {selectedProduct && <EditForm product={selectedProduct}/>}
             </Editpopup>
        </div>
        
    );
}

export default AdminProducts;


 
     
     
     
  