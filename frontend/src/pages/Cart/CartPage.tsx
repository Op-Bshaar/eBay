import { useCart } from "../../context/CartContext";
import { useRequireAuthentication } from "../login/LoginRedirect";
import "../../Loader.css";
function CartPage() {
    useRequireAuthentication();
    const { cartItems, setCartItems, isSynced,
        isLoading, updateCart, reloadCart, errorMessage } = useCart();
    const loading = <div className="absolute-center"><div className="loader" /></div>;
    return (
        <div>
            {loading}
        </div>
    );
}

export default CartPage;