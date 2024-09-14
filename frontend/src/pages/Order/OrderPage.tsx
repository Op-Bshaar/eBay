import { useCallback, useEffect, useState } from "react";
import "../../Loader.css";
import { emptyAddress } from "../../components/AddressInput/Address";
import AddressInput from "../../components/AddressInput/AddressInput";
import { displayMoney } from "../../constants/Constants";
import { useCart } from "../../context/CartContext";
import "./OrderPage.css";
import ErrorMessage from "../../components/errorMessage/Error";
function OrderPage() {
    const { cartItems, isCartLoading, isCartSynced, reloadCart,errorMessage } = useCart();
    const [address, setAddress] = useState(emptyAddress);
    const [isAddressValid, setIsAddressValid] = useState(false);
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
    if (isCartLoading || !isCartSynced || errorMessage) {
        return (
            <div className="absolute-center">
                {errorMessage ?
                    <ErrorMessage>{errorMessage}</ErrorMessage> :
                    <div className="loader" />}
            </div>
        );
    }
    const handleOrder = () => {

    };
    const items = (
        <div className="order-items-container">
            {cartItems.map((item) => (
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
            <div className="address-input-container">
                <h1>عنوان الشحن:</h1>
                <AddressInput className="order-address-form" address={address} setAddress={setAddress}
                    isValid={isAddressValid} setIsValid={setIsAddressValid} />
            </div>
            {items}
            <div className="center-text">
                <button onClick={handleOrder} disabled={!isAddressValid}
                    className="button pay-button">ادفع ( {displayMoney(total())} )</button>
            </div>
        </div>
    );
}
export default OrderPage;
