import { useCart } from "../../context/CartContext";
import { useRequireAuthentication } from "../login/LoginRedirect";
import ProductView from "../../components/ProductView/ProductView";
import "../../Loader.css";
import "./Cart.css";
import ErrorView from "../../components/errorMessage/Error";
import { useEffect } from "react";
import { useCartOperations } from "../../Cart";
import { PAGE_URLS } from "../../constants/URL";
import { Link } from "react-router-dom";
import { currencySymbol } from "../../constants/Currency";
function CartPage() {
    useRequireAuthentication();
    const { cartItems, reloadCart, errorMessage, isCartLoading } = useCart();
    const [, removeFromCart, clearCart] = useCartOperations();
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
    const handleClearCart = () => {
        const confirmClear = window.confirm("هل تريد حذف جميع العناصر من السلة؟");
        if (confirmClear) {
            clearCart();
        }
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
                <button className="button remove-from-cart-button" onClick={handleClearCart}>حذف السلة</button>
                <button className="button">شراء</button>
            </div>
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