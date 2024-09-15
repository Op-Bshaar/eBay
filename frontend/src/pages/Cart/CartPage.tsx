import { useCart } from "../../context/CartContext";
import { useRequireAuthentication } from "../login/LoginRedirect";
import ProductView from "../../components/ProductView/ProductView";
import "../../Loader.css";
import "./Cart.css";
import "./AddressPage.css";
import ErrorView from "../../components/errorMessage/Error";
import { useCallback, useEffect, useState } from "react";
import { useCartOperations } from "../../Cart";
import { PAGE_URLS } from "../../constants/URL";
import { Link } from "react-router-dom";
import { displayMoney } from "../../constants/Constants";
import { emptyAddress } from "../../components/AddressInput/Address";
import AddressInput from "../../components/AddressInput/AddressInput";
function CartPage() {
    useRequireAuthentication();
    const { cartItems, reloadCart, errorMessage, isCartLoading } = useCart();
    const [, removeFromCart, clearCart] = useCartOperations();
    const [shouldInputAddress, setShouldInputAddress] = useState(false);
    const allProductsAvailable = useCallback(() => cartItems.every(item => item.product.isAvailable),[cartItems]);
    // reload cart on first render.
    useEffect(() => {
        if (cartItems.length === 0) {
            reloadCart();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    if (shouldInputAddress) {
        return <AddressPage/>;
    }
    const loader = <div className="absolute-center"><div className="loader" /></div>;
    const errorElement = <ErrorView className="absolute-center big-message">{errorMessage}</ErrorView>;
    const emptyCart =
        <p className="absolute-center empty-cart">
            <span>
                السلة فارغة,
            </span>
            <Link className="link" to={PAGE_URLS.home}> تصفح منتجاتنا.</Link>
        </p>;
    const handleClearCart = () => {
        const confirmClear = window.confirm("هل تريد حذف جميع العناصر من السلة؟");
        if (confirmClear) {
            clearCart();
        }
    };
    const handleOrder = () => {
        setShouldInputAddress(true);
    };
    const cart = (
        <div className="cart-page">
            <div className="cart-items-container">
                {
                    cartItems.map((item, index) =>
                        <div className="cart-item" key={index}>
                            <ProductView product={item.product} clickToGo={false} />
                            <button className="button remove-from-cart-button" onClick={() => removeFromCart(item.product)}>احذف من السلة</button>
                        </div>
                    )}
            </div>
            <div>
                <p className="center-text">المجموع: {`${displayMoney(cartItems.reduce((sum, item) => sum + Number(item.product.price), 0))}`}</p>
                <div className="cart-buttons-container">
                    <button className="button remove-from-cart-button cart-button" onClick={handleClearCart}>حذف السلة</button>
                    <button onClick={handleOrder} disabled={!allProductsAvailable()} className="button cart-button">تأكيد الطلب</button>
                </div>
            </div>
        </div>);

    return (
        <div className="tajawal-extralight">
            {
                cartItems.length > 0 ? cart :
                    errorMessage ? errorElement :
                        isCartLoading ? loader : emptyCart
            }
        </div>
    );
}
function AddressPage() {
    const [address, setAddress] = useState(emptyAddress);
    const [isAddressValid, setIsAddressValid] = useState(false);
    const handleOrder = () => {

    }
    return (
        <div className="address-page" >
            <AddressInput address={address} setAddress={setAddress} isValid={isAddressValid} setIsValid={setIsAddressValid} />
            <button className="button" onClick={handleOrder} disabled={!isAddressValid }>تأكيد العنوان</button>
        </div>);
}
export default CartPage;