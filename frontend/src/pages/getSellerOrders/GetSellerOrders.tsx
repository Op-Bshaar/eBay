import { useEffect, useState } from "react";
import api from "../../helpers/api";
import { Order } from "../../utils/Order";
import { useNavigate } from "react-router-dom";

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
        console.log(data);
        if (Array.isArray(data)) {
          setOrders(data);
          console.log(data);
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

  const handleShowproduct = (productId: number) => {
    navigate(`/seller-portal/orders/${productId}`);
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
            <p>الحاله: {order.status}</p>
            <p>
              تاريخ الطلب: {new Date(order.created_at).toLocaleDateString()}
            </p>
            <h4>المنتجات:</h4>
            <ul>
              {order.order_request_items &&
              Array.isArray(order.order_request_items) ? (
                order.order_request_items.length > 0 ? (
                  order.order_request_items.map((item) => (
                    <li key={item.id}>
                      <p>المنتج: {item.product?.title || "N/A"}</p>
                      <p>الكميه: {item.quantity}</p>
                      <p>السعر: ${item.product?.price || 0}</p>
                      <button
                        onClick={() => handleShowproduct(item.product?.id)}
                      >
                        عرض المنتج
                      </button>
                    </li>
                  ))
                ) : (
                  <p>لا توجد منتجات حاليا.</p>
                )
              ) : (
                <p>لا توجد منتجات حاليا.</p>
              )}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export default GetSellerOrders;
