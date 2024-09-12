import { useCart } from "../../context/CartContext";
import { useRequireAuthentication } from "../login/LoginRedirect";
import ProductView from "../../components/ProductView/ProductView";
import "../../Loader.css";
import "./Cart.css";
import ErrorView from "../../components/errorMessage/Error";
import { useEffect, useState } from "react";
import { useCartOperations } from "../../Cart";
import { PAGE_URLS } from "../../constants/URL";
import { Link, useNavigate } from "react-router-dom";
import { currencySymbol } from "../../constants/Currency";
function CartPage() {
    useRequireAuthentication();
    const { cartItems, reloadCart, errorMessage, isCartLoading, isCartSynced, updateCart } = useCart();
    const [, removeFromCart, clearCart] = useCartOperations();
    const [isNavigatingToOrder, setIsNavigatingToOrder] = useState(false);
    const navigate = useNavigate();
    // reload cart on first render.
    useEffect(() => {
        if (cartItems.length === 0) {
            reloadCart();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cartItems.length]);
    const loader = <div className="absolute-center"><div className="loader" /></div>;
    if (isNavigatingToOrder) {
        if (!errorMessage && !isCartLoading && isCartSynced) {
            navigate(`/${PAGE_URLS.place_order}`);
        }
        return (
            <div className="absolute-center tajawal-extralight">
                {isCartLoading && loader}
                {errorMessage &&
                    <ErrorView className="big-message">{errorMessage}
                        <button className="link" onClick={updateCart}>أعد المحاولة</button>
                    </ErrorView>}
            </div>
        );
    }
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
    const handleOrder = async () => {
        setIsNavigatingToOrder(true);
        updateCart();
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
            <div className="cart-buttons-container">
                <p>المجموع: {`${cartItems.reduce((sum, item) => sum + Number(item.product.price), 0)}${currencySymbol}`}</p>
                <button className="button remove-from-cart-button cart-button" onClick={handleClearCart}>حذف السلة</button>
                <button onClick={handleOrder } className="button cart-button">تأكيد الطلب</button>
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

export default CartPage;