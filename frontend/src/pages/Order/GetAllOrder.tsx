import React, { useEffect, useState } from "react";
import api from "../../api";
// import "../../Loader.css";
// import "./Home.css";
// import "../ProductsContainer.css";
import ErrorMessage from "../../components/errorMessage/Error";

interface IOrder {
  product_id: string;
  quantity: number;
  country: string;
  city: string;
  district: string;
  street: string;
  postal_code: string;
  status: string;
}

function GetAllOrder() {
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [order, setOrder] = useState<IOrder[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setError("");
        setIsLoading(true);
        const response = await api.get(`/orders`);
        setOrder(response.data);
      } catch (error) {
        console.error("Fetch error:", error);
        setError("An error occurred while fetching products.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filter products based on the selected category

  const OrderView =
    error || isLoading ? (
      <div className="home-message big-message">
        {isLoading && <div className="loader" />}
        {error && <ErrorMessage>معذرة حدثت مشكلة</ErrorMessage>}
      </div>
    ) : (
      <div className="Orders-container fill-flex">
        {order.map((ordr) => (
          <div>
            <h3>{ordr.city}</h3>
            <h3>{ordr.country}</h3>
            <h3>{ordr.district}</h3>
            <h3>{ordr.postal_code}</h3>
            <h3>{ordr.postal_code}</h3>
            <h3>{ordr.street}</h3>
            <h3>{ordr.status}</h3>
          </div>
        ))}
      </div>
    );

  return <div className="tajawal-extralight">
    {OrderView}
    <h1>hhh</h1>
  </div>;
}

export default GetAllOrder;
