import { ChangeEvent, useEffect, useState } from "react";
import { currencySymbol } from "../../constants/Currency";
import { useCart } from "../../context/CartContext";
import "./OrderPage.css";
import "../../Loader.css";
function OrderPage() {
    const { cartItems, isCartLoading, isCartSynced, reloadCart } = useCart();
    const [address, setAddress] = useState("");
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
            </div>);
    }
    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setAddress(event.currentTarget.value);
    }
    const total = cartItems.reduce((sum,cartItem) => sum + Number(cartItem.product.price),0)
    const items = (
        <div className="order-items-container">
            {cartItems.map((item, index) =>
                <div className="order-item-container" key={index}>
                    <div className="order-item">
                        <span>{item.product.title}</span>
                        <span>{item.product.price}{currencySymbol}</span>
                    </div>
                </div>
            )}
            < div className="order-item-container">
            <div className="order-item">
                <span>المجموع:</span>
                    <span>{total}{currencySymbol }</span>
            </div>
        </div>
        </div>)
    return (
        <div className="tajawal-extralight order-page">
            <div className="address-input">
                <label htmlFor="address">العنوان:</label>
                <input onChange={handleChange} type="text" id="address" value={address}
                    placeholder="القاهرة, حدائق الأهرام ...." maxLength={255} autoComplete={"shipping street-address" } />
            </div>
            {items}
        </div>
    );
}
export default OrderPage;