import { createContext, useContext } from "react";
import { CartItem } from "../Cart";
interface ICartContext {
    cartItems: CartItem[],
    isCartLoading: boolean,
    isCartSynced: boolean,
    setCartItems: (cartItems: CartItem[]) => void,
    updateCart: () => Promise<void>,
    reloadCart: () => Promise<void>,
    errorMessage: string,
};
export const CartContext = createContext<ICartContext | undefined>(undefined);
/**
 * Get current cart context. Must be called in a component within a CartContext provider.
 * 
 * @returns setCartItems: Locally set cart items, isSynced: Whether local cart matches server cart
 * updateCart: Send local cart to server
 * reloadCart: Fetch cart from server and update local cart if no changes were made locally while fetching
 */
export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within an CartProvider");
    }
    return context;
};