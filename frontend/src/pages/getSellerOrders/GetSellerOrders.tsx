import React, { useEffect, useState } from "react";
import api from "../../helpers/api";
import { Order } from "../../utils/Order";
import Product from "../../utils/Product";

function GetSellerOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setError("");
        setIsLoading(true);
        const response = await api.get(`/sellers/orders`);
        const data = await response.data;
        setOrders(data);
      } catch (error) {
        console.error("Fetch error:", error);
        setError("An error occurred while fetching orders.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="seller-orders">
      <h2>Seller Orders</h2>
      {isLoading && <p>Loading orders...</p>}
      {error && <p>{error}</p>}

      {!isLoading && !error && orders.length === 0 && (
        <p>No orders found for this seller.</p>
      )}

      <div className="order-list">
        {orders.map((order) => (
          <div key={order.id} className="order-item">
            <h3>Order #{order.id}</h3>
            <p>Status: {order.status}</p>
            <p>Order Date: {new Date(order.created_at).toLocaleDateString()}</p>

            <h4>Products:</h4>
            <ul>
              {order.order_request_items.map((item:any) => (
                <li key={item.id}>
                  <p>Product: {item.product.name}</p>
                  <p>Quantity: {item.quantity}</p>
                  <p>Price: ${item.product.price}</p>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export default GetSellerOrders;
