import { useEffect, useState } from "react";
import { useCart } from "./context/CartContext";
import Product from "./Product";

export interface CartItem {
    product: Product;
    quantity: number,
}
/**
 * Adds an item to the cart if it doesn't already exist.
 * 
 * @param cart - An array of CartItem objects representing the current cart.
 * @param item - The item to be added to the cart, which can be either a CartItem or a Product.
 * @returns A new CartItem array with the item added if it doesn't already exist.
 */
export function addToCartIfNotExists(cart: CartItem[], item: CartItem | Product): CartItem[] {
    const [cartItem, product] = getItemProduct(item);
    // item already in cart
    if (cartContainsItem(cart, product)) {
        return [...cart];
    }
    return [...cart, cartItem];
}
export function removeFromCartIfExists(cart: CartItem[], item: CartItem | Product): CartItem[] {
    const [, product] = getItemProduct(item);
    return cart.filter(x => x.product.id !== product.id);
}
export function cartContainsItem(cart: CartItem[], item: CartItem | Product) {
    const [, product] = getItemProduct(item);
    // item already in cart
    return cart.some(x => x.product.id === product.id)

}
function getItemProduct(item: CartItem | Product): [CartItem, Product] {
    let product: Product;
    let cartItem: CartItem;
    if ('product' in item) {
        cartItem = item as CartItem;
        product = cartItem.product;
    }
    else {
        product = item as Product;
        cartItem = {
            quantity: 1,
            product: product,
        }
    }
    return [cartItem, product];
}
export function useCartOperations(updateCartAfterOperations = true):
    [(product: Product) => void,
        (product: Product) => void,
        () => void] {
    const { cartItems, setCartItems, updateCart } = useCart();
    const [shouldUpdateCart, setShouldUpdateCart] = useState(false);
    useEffect(() => {
        if (shouldUpdateCart) {
            updateCart();
            setShouldUpdateCart(false); // Reset after updating the cart
        }
    }, [cartItems, shouldUpdateCart, updateCart]); 
    const addToCart = (product: Product) => {
        const newCart = addToCartIfNotExists(cartItems, product);
        setCartItems(newCart);
        if (updateCartAfterOperations) {
            setShouldUpdateCart(true);
        }
    }
    const removeFromCart = (product: Product) => {
        const newCart = removeFromCartIfExists(cartItems, product);
        setCartItems(newCart);
        if (updateCartAfterOperations) {
            setShouldUpdateCart(true);
        }
    }
    const clearCart = () => {
        setCartItems([]);
        if (updateCartAfterOperations) {
            setShouldUpdateCart(true);
        }
    }
    return [addToCart, removeFromCart, clearCart];
}