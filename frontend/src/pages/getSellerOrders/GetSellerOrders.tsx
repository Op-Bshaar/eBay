import React, { useEffect, useState } from "react";
import api from "../../helpers/api";
import { Order, Product } from "../../utils/Order";

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
        if (Array.isArray(data)) {
          setOrders(data);
        } else {
          setError("Unexpected data structure from API");
        }
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
              {order.order_request_items &&
              Array.isArray(order.order_request_items) ? (
                order.order_request_items.map((item) => (
                  <li key={item.id}>
                    <p>Product: {item.product?.name || "N/A"}</p>
                    <p>Quantity: {item.quantity}</p>
                    <p>Price: ${item.product?.price || 0}</p>
                  </li>
                ))
              ) : (
                <p>No products found for this order.</p>
              )}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export default GetSellerOrders;
