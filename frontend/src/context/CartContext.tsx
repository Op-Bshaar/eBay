import { createContext, useContext } from "react";
import Product from "../Product";

export interface CartItem {
    productId: number,
    quantity: number,
    product: Product;
}
class Cart{
    items: CartItem[] = [];
}
interface ICartContext { cart: Cart | null, reloadCart: () => void, errorMessage: string };
export const CartContext = createContext<ICartContext | undefined>(undefined);

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useAuthentication must be used within an AuthenticationProvider");
    }
    return context;
};