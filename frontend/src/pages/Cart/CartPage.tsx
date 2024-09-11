﻿import { useCart } from "../../context/CartContext";
import { useRequireAuthentication } from "../login/LoginRedirect";
import ProductView from "../../components/ProductView/ProductView";
import "../../Loader.css";
import "./Cart.css";
import ErrorView from "../../components/errorMessage/Error";
import { useEffect } from "react";
import { useCartOperations } from "../../Cart";
import { PAGE_URLS } from "../../constants/URL";
import { Link } from "react-router-dom";
function CartPage() {
    useRequireAuthentication();
    const { cartItems, reloadCart, errorMessage,isCartLoading } = useCart();
    const [, removeFromCart] = useCartOperations();
    // reload cart on first render.
    useEffect(() => {
        reloadCart();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const loader = <div className="absolute-center"><div className="loader" /></div>;
    const errorElement = <ErrorView className="absolute-center big-message">{errorMessage}</ErrorView>;
    const emptyCart =
        <p className="absolute-center empty-cart">
            <span>
                السلة فارغة,
            </span>
            <Link className="link" to={PAGE_URLS.home}> تصفح منتجاتنا.</Link>
        </p>;
    const cart = (
        <div className="cart-items-container">
            {
                cartItems.map((item, index) =>
                    <div className ="cart-item" key={index}>
                        <ProductView product={item.product}  />
                        <button className="button remove-from-cartbutton" onClick={() => removeFromCart(item.product)}>احذف من السلة</button>
                    </div>
                )}
        </div>);

    return (
        <div className="tajawal-extralight">
            {
                errorMessage ? errorElement :
                    cartItems.length > 0 ? cart :
                        isCartLoading ? loader : emptyCart
            }
        </div>
    );
}

export default CartPage;