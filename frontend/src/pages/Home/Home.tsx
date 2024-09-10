import { useEffect, useState } from "react";
import { Product } from "../../utils/itemdata";
import { Link } from "react-router-dom";
import SideBar from "../../components/SideBar/SideBar";
import TopBar from "../../components/TopBar/TopBar";
import api from "../../api";

function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get(`/products`);
          const data = await response.data;
        setProducts(data);
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
                        products.map(({ id, title, image, price, description }) => (
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

export default Home;
