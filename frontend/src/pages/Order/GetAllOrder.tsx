import { useEffect, useState } from "react";
import api from "../../helpers/api";
// import "./Loader.css"; // Load styles for loader
// import "./Orders.css"; // Custom styles for the Orders page
import ErrorMessage from "../../components/errorMessage/Error";
import "./GetAllOrder.css";
import Order from "../../utils/Order";
import { addressToText } from "../AddressInput/Address";

function GetAllOrder() {
    const [error, setError] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);
    const [order, setOrder] = useState<Order[]>([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setError("");
                setIsLoading(true);
                const response = await api.get(`/orders`);
                setOrder(response.data);
            } catch (error) {
                console.error("Fetch error:", error);
                setError("An error occurred while fetching orders.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchProducts();
    }, []);
    const OrderView =
        error || isLoading ? (
            <div className="home-message big-message">
                {isLoading && <div className="loader" />} {/* Loader while loading */}
                {error && <ErrorMessage>معذرة حدثت مشكلة</ErrorMessage>}
            </div>
        ) : (
            <div className="orders-container fill-flex">
                {order.map((order) => (
                    <div key={order.id} className="order-card">
                        <div>
                            العنوان: {addressToText(order) }
                        </div>
                        {order.status === "executed" ? (
                            <p>تم الدفع بنجاح</p>
                        ) : (
                            <p>حاله الطلب:{order.status}</p>
                        )}
                    </div>
                ))}
            </div>
        );

    return (
        <div className="tajawal-extralight orders-page">
            <h1 className="all-orders">كل الطلبات</h1>
            {OrderView}
        </div>
    );
}

export default GetAllOrder;
