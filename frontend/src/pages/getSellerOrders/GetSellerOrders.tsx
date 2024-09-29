import { useEffect, useState } from "react";
import api from "../../helpers/api";
import { Order } from "../../utils/Order";
import { useNavigate } from "react-router-dom";
import { getOrderStatus, getSellerStatus } from "../Order/order_status";
import './GetSellerOrder.css'

function GetSellerOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setError("");
        setIsLoading(true);
        const response = await api.get(`/sellers/orders`);
        const data = await response.data;
        console.log("API Response:", data);
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

  // UseEffect to check the contents of orders and order_request_items
  useEffect(() => {
    console.log("Orders:", orders);
    orders.forEach((order) => {
      console.log("Order Object:", order);
      console.log("Order Items:", order.order_request_items);
    });
  }, [orders]);

  const handleShowproduct = (productId: number) => {
    navigate(`/seller-portal/orders/${productId}`);
  };



  const handleShipOrder = async (orderId: number) => {
    try {
      const response = await api.post(`/sellers/orders/${orderId}/ship`);
      console.log(orderId);
      if (response.status === 200) {
        const updatedOrders = orders.map((order) =>
          Number(order.id) === orderId ? { ...order, status: "shipped" } : order
        );
        console.log(response);
        setOrders(updatedOrders);
      } else {
        console.error(`فشل الشحن ${response.statusText}`);
        setError(`الطلب قاتل: ${response.data.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Shipping error:", error);
      setError("الطلب قاتل.");
    }
  };

  return (
    <div className="seller-orders">
      {isLoading && <p>جاري تحميل الطلبات...</p>}
      {error && <p>{error}</p>}
  
      {!isLoading && !error && orders.length === 0 && (
        <p>ليس لديك طلبات حاليا.</p>
      )}
  
      <div className="order-list">
        {orders.map((order) => (
          <div key={order.id} className="order-item">
            <h3>الطلب #{order.id}</h3>
            <p>الحاله: {getOrderStatus(getSellerStatus(order.status))}</p>
            <p>
              تاريخ الطلب: {new Date(order.created_at).toLocaleDateString()}
            </p>
            {order.status === "pending" && (
              <button
                onClick={() => handleShipOrder(Number(order.id))}
                className="ship-button"
              >
                شحن
              </button>
            )}
            <h4>المنتجات:</h4>
            <ul>
              {order.product ? (
                <li key={order.product.id}>
                  <p>المنتج: {order.product.title || "No title available"}</p>
                  <p>الكميه: {order.quantity}</p>
                  {/* <img>الصوره:{order.im}</img> */}
                  <button
                    onClick={() => handleShowproduct(Number(order.product.id))}
                    className="button"
                  >
                    التفاصيل
                  </button>
                </li>
              ) : (
                <p>لم يتم العثور على منتجات.</p>
              )}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
  
}

export default GetSellerOrders;
