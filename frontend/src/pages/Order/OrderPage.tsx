import "../../Loader.css";
import { displayMoney } from "../../constants/Constants";
import "./OrderPage.css";
import { useRequireEmailVerification } from "../login/LoginRedirect";
import { CartItem } from "../../Cart";
import { useState } from "react";
function OrderPage() {
    useRequireEmailVerification();
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [orderItems, setOrderItems] = useState<CartItem[]>([]);
    const loadOrder = () => {
        setIsLoading(true);
        setErrorMessage("");
    }
    const handleOrder = () => {

    };
    const items = (
        <div className="order-items-container">
            {orderItems.map((item) => (
                <div className="order-item-container" key={item.product.id}>
                    <div className="order-item">
                        <span className="order-title-image-container">
                            <span className="order-item-image-container">
                                {item.product.image && <img src={item.product.image} />}
                            </span>
                            <span>
                                {item.product.title}
                            </span>
                        </span>
                        <span>
                            {displayMoney(item.product.price) }
                        </span>
                    </div>
                </div>
            ))}
            {orderItems.length > 1 && (
                <div className="order-item-container">
                    <div className="order-item">
                        <span>المجموع:</span>
                        <span>
                            {displayMoney(0)}
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
    return (
        <div className="tajawal-extralight order-page">
            {items}
            <div className="center-text">
                {orderItems.length > 0 &&
                    <button onClick={handleOrder} className="button pay-button">ادفع
                        ( {displayMoney(0)} )
                    </button>}
            </div>
        </div>
    );
}
export default OrderPage;
