import { useCart } from "../../context/CartContext";
import { useRequireAuthentication } from "../login/LoginRedirect";

function CartPage() {
    useRequireAuthentication();
    const { cartItems, setCartItems, isSynced,
        isLoading, updateCart, reloadCart, errorMessage } = useCart();
  return (
    <p>Hello world!</p>
  );
}

export default CartPage;