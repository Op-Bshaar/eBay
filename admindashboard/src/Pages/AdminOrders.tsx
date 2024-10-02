import { useEffect, useState } from "react";
import Product from "../../../frontend/src/utils/Product";
import ProductView from "../../../frontend/src/components/ProductView/ProductView";
import api from "../../../frontend/src/helpers/api";
import './adminorder.css';
import OrderView from "../../../frontend/src/components/orderview/OrdersVeiw";

interface Order {
  id: number;
  city: string;
  country: string;
  total_price: string;
  status: string;
}

function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get(`/admin/orders`);
        console.log("Full API Response:", response); 
        const fetchedOrders = response?.data?.orderes;  
        console.log("Fetched Orders:", fetchedOrders);  
        setOrders(fetchedOrders);
      } catch (error) {
        console.error("Fetch error:", error);
        setError("An error occurred while fetching orders.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchOrders();
  }, []);
  

  if (error) {
    return <div>{error}</div>;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="orders-container">
      {orders && orders.length > 0 ? (
        orders.map((order, index) => (
          <OrderView key={index} order={order} />
        ))
      ) : (
        <p>No orders available</p>
      )}
    </div>
  );
}



export default AdminOrders;
