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

export const useCart = ()=>useContext(CartContext);