import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import { displayMoney } from "../../constants/Currency";
import { useCart } from "../../context/CartContext";
import "./OrderPage.css";
import "../../Loader.css";
function OrderPage() {
    const { cartItems, isCartLoading, isCartSynced, reloadCart } = useCart();
    const [address, setAddress] = useState("");
    const addressInputRef = useRef<HTMLInputElement>(null);
    const total = useCallback(() => cartItems.reduce(
        (sum, cartItem) => sum + Number(cartItem.product.price),
        0
    ), [cartItems]);
    useEffect(() => {
        if (!isCartSynced) {
            reloadCart();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isCartSynced]);
    if (isCartLoading || !isCartSynced) {
        return (
            <div className="absolute-center">
                <div className="loader" />
            </div>
        );
    }
    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setAddress(event.currentTarget.value);
    };
    const handleOrder = () => {

    };
    const isAddressValid = addressInputRef.current?.validity.valid && !!addressInputRef.current?.value;
    const items = (
        <div className="order-items-container">
            {cartItems.map((item, index) => (
                <div className="order-item-container" key={index}>
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
            {cartItems.length > 1 && (
                <div className="order-item-container">
                    <div className="order-item">
                        <span>المجموع:</span>
                        <span>
                            {displayMoney(total())}
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
    return (
        <div className="tajawal-extralight order-page">
            <div className="address-input">
                <label htmlFor="address">عنوان الشحن:</label>
                <input
                    onChange={handleChange}
                    type="text"
                    id="address"
                    value={address}
                    ref={addressInputRef}
                    style={{ fontFamily: "Tajawal" }}
                    placeholder="أدخل العنوان كاملاً"
                    aria-label="أدخل عنوان الشحن الكامل"
                    autoComplete={"shipping street-address"}
                    required
                    minLength={10 }
                    maxLength={255 }
                />
            </div>
            {items}
            <div className="center-text">
                <button onClick={handleOrder} disabled={!isAddressValid }
                    className="button pay-button">ادفع ( {displayMoney(total())} )</button>
            </div>
        </div>
    );
}
export default OrderPage;
