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

    const handleShowproduct = (productId: string) => {
        navigate(`/seller-portal/orders/${productId}`);
    };

    return (
        <div className="seller-orders">
            <OrderInput />
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
                        <p>المنتج: {order.product.title}</p>
                        <button
                            onClick={() => handleShowproduct(order.product.id)}
                            className="button"
                        >
                            التفاصيل
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
function OrderInput() {
    const navigate = useNavigate();
    const [orderId, setOrderId] = useState("");
    const handleNavigateToOrderDetails = () => {
        if (orderId) {
            navigate(`/seller-portal/orders/${orderId}`);
        } else {
            alert("معذره");
        }
    };
    return (
        <div className="order-id-input">
            <input
                type="text"
                placeholder="أدخل رقم الطلب"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
            />
            <button
                onClick={handleNavigateToOrderDetails}
                className="button"
                style={{ marginRight: "10px" }}
                disabled={!orderId }
            >
                عرض تفاصيل الطلب
            </button>
        </div>
    );
}

export default GetSellerOrders;
