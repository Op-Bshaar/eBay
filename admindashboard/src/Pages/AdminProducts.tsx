import { useEffect, useState } from "react";
import { Product } from "../../../frontend/src/utils/itemdata";
import { Link } from "react-router-dom";
import SideBar from "../../../frontend/src/components/SideBar/SideBar";
import TopBar from "../../../frontend/src/components/TopBar/TopBar";
import api from "../../../frontend/src/api";
import "./css/AdminProducts.css"
function AdminProducts() {
    const [products, setProducts] = useState<Product[]>([]);
    const [error, setError] = useState<string | null>(null);
  
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
    console.log(products);
    return (
      <div
        className="tajawal-extralight"
        style={{ display: "flex", height: "100vh" }}
      >
        <div style={{ flex: "1" }}>
          <SideBar />
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
              products.map (({ id, title, image, price, description }) => (
                <div key={id} style={{ textAlign: "center" }}>
                  <Link to={`/products/${id}`}>
                    <h2>{title}</h2>
                    <img
                      style={{ width: "100px", height: "100px" }}
                      src={image}
                      alt={title}
                    />
                  </Link>
                  <p>{price}</p> 
                  <p>{description}</p>
                  <div className="Edit">
                  <button className="editbutton">Edit title</button>
                  <button className="editbutton">Edit price</button>
                  <button className="editbutton">Edit description</button>
                  <button className="editbutton">Edit image</button>
                  </div>
                </div>
              ))
            ) : (
              <p>No products available</p>
            )}
          </div>
        </div>
      </div>
    );
  }
  
  export default AdminProducts;
  