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
import { Link, useNavigate } from "react-router-dom";
import { displayMoney } from "../../constants/Constants";
import { emptyAddress } from "../../components/AddressInput/Address";
import AddressInput from "../../components/AddressInput/AddressInput";
import api from "../../api";
import { isAxiosError } from "axios";
import ErrorMessage from "../../components/errorMessage/Error";
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
    const { cartItems,reloadCart } = useCart();
    const [address, setAddress] = useState(emptyAddress);
    const [isAddressValid, setIsAddressValid] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();
    const items = cartItems.map(item => {
        return {
            product_id: item.product.id,
            quantity: item.quantity
        }
    })
    const handleOrder = () => {
        setIsLoading(true);
        setErrorMessage("");
        api.post('/orders', {
            items,
            address,
        }).then(response => {
            navigate(`/orders/${response.data.order_id}`);
        }).then(reloadCart).catch(error => {
            let message = "حدث خطأ ما.";
            if (isAxiosError(error)) {
                if (error.request && !error.response) {
                    message = "تعذر الاتصال, تحقق من الشبكة."
                }
                // some products are unavailable
                else if (error.response?.status === 400) {
                    navigate(PAGE_URLS.cart);
                }
            }
            setErrorMessage(message);
        }).
            finally(() => setIsLoading(false));
    }
    if (errorMessage) {
        return (
            <ErrorMessage className="absolute-center tajawal-extralight center-message center-text">
                {errorMessage}
                <button onClick={handleOrder} className="link">أعد المحاولة.</button>
            </ErrorMessage>
        );
    }
    if (isLoading) {
        return (
            <div className="address-page-loader-container">
                <div className="loader" />
            </div>
        );
    }
    return (
        <div className="address-page" >
            <AddressInput address={address} setAddress={setAddress} isValid={isAddressValid} setIsValid={setIsAddressValid} disabled={isLoading} />
            <button className="button" onClick={handleOrder} disabled={!isAddressValid || isLoading}>تأكيد العنوان</button>
            
        </div>
    );
}
export default CartPage;