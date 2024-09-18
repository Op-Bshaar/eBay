import { useEffect, useState } from "react";
import  Product from "../../../frontend/src/utils/Product";
import ProductView from "../../../frontend/src/components/ProductView/ProductView";
import { Link } from "react-router-dom";
import SideBar from "../../../frontend/src/components/SideBar/SideBar";
import TopBar from "../../../frontend/src/components/TopBar/TopBar";
import Navbar from "../../../frontend/src/components/nav/Navbar"
import api from "../../../frontend/src/helpers/api";
import EditForm from "./AdminEdit";
import "./css/AdminProducts.css";
import Editpopup from "./Editpopup";


function AdminProducts() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [EditIsVisible, Showpopup] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    useEffect(() => {
      
      const fetchProducts = async () => {
        try {
          const response = await api.get(`/admin/products`);
          const data = await response.data;
          setProducts(data.product);
          console.log(data.product);
        } catch (error) {
          console.error("Fetch error:", error);
          setError("An error occurred while fetching products.");
        }
      };
  
      fetchProducts();
    }, []);
    if (error) {
      return <div>{error}</div>;
    }
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
    console.log(products);
    
    return (
      <div
            className="tajawal-extralight"
            style={{ display: "flex", height: "100vh" }}
        >
        
            <div style={{ flex: "1" }}>
            <SideBar
                        categories={categories}
                        // onCategorySelect={handleCategoryChange}
                    />
            </div>
            <div style={{ padding: "20px", overflowY: "auto" }}>
                <TopBar />
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(4, 1fr)",
                        gap: "1px",
                        justifyContent: "center",
                        padding: "20px",
                        boxSizing: "border-box",
                    }}
                >
                  
                    {products.length > 0 ? (
                      
                        products.map((product, index) =>
                          <div>
                            <button className="editbutton" onClick={()=>handleEditClick(product)}>Edit</button>
                            <ProductView key={index} product={product}/>
                          </div> )
                        
                        
                    ) : (
                        <p>No products available</p>
                    )}
                </div>
            </div>
            <Editpopup isVisible={EditIsVisible} onClose={handleEditClose}>
              {selectedProduct && <EditForm product={selectedProduct}/>}
            </Editpopup>
        </div>
      
    );
  }
  
  export default AdminProducts;
  