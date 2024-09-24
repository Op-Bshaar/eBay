import { useEffect, useState } from "react";
import Product from "../../../frontend/src/utils/Product";
import ProductView from "../../../frontend/src/components/ProductView/ProductView";
import { Link } from "react-router-dom";
import SideBar from "../../../frontend/src/components/SideBar/SideBar";
import TopBar from "../../../frontend/src/components/TopBar/TopBar";
import api from "../../../frontend/src/helpers/api";
import "./css/AdminProducts.css";
function AdminOrders() {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get(`/admin/orders`);
        console.log(response);
  
      
        const fetchedProducts = response.data.orderes; 
  
        setProducts(fetchedProducts); 
        console.log('Fetched Products:', fetchedProducts); 
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

  return (
    <div
      className="tajawal-extralight"
      style={{ display: "flex", height: "100vh" }}
    >
      <div style={{ flex: "1" }}>{/* <SideBar /> */}</div>
      <div style={{ padding: "20px", overflowY: "auto" }}>
        {/* <TopBar /> */}
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
            products.map((product, index) => (
              <div>
                <button className="editbutton">Edit</button>
                <ProductView key={index} product={product} />
              </div>
            ))
          ) : (
            <p>No orders available</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminOrders;
