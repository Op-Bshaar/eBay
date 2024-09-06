import React, { useEffect, useState } from "react";
import Hero from "../../components/Hero/Hero";
import HeroItem from "../../components/Hero-item/HeroItem";
import { Products } from "../../utils/itemdata";
import { BASE_URL } from "../../constants/BaseUrl";

function Home() {
  const [products, setProducts] = useState<Products[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/products`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
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
    <>
      <div style={{ display: "flex" }}>
        <Hero />
        <HeroItem />
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "1px",
          justifyContent: "center",
          margin: "0 auto",
        }}
      >
        {products.length > 0 ? (
          products.map(({ id, title, image, price }) => (
            <div key={id} style={{ textAlign: "center" }}>
              <h2>{title}</h2>
              <img
                style={{ width: "100px", height: "100px" }}
                src={image}
                alt={title}
              />
              <p>{price}</p>
            </div>
          ))
        ) : (
          <p>No products available</p>
        )}
      </div>
    </>
  );
}

export default Home;
