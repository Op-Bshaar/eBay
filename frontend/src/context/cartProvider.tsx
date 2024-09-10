import { CartContext, CartItem } from "./CartContext";
import { useState, useEffect, PropsWithChildren, FC } from "react";
import api from "../api";

const CartProvider: FC<PropsWithChildren> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await api.get("/cart");
        const cart = response.data;
        const cartItemsMapped = cart.items.map(
          ({ product, quantity, price }: any) => ({
            productId: product.id,
            title: product.title,
            image: product.image,
            quantity,
            price,
          })
        );
        setCartItems(cartItemsMapped);
        setTotalAmount(cart.totalAmount);
      } catch (error: any) {
        setError(error.message || "Something went wrong.");
      }
    };
    fetchCart();
  }, []);

  // Add Item to Cart
  const addItemToCart = async (productId: string) => {
    try {
      const response = await api.post("/cart", {
        productId,
        quantity: 1,
      });

      const cart = response.data;
      const cartItemsMapped = cart.items.map(
        ({ product, quantity, price }: any) => ({
          productId: product.id,
          title: product.title,
          image: product.image,
          quantity,
          price,
        })
      );

      setCartItems(cartItemsMapped);
      setTotalAmount(cart.totalAmount);
    } catch (error: any) {
      setError(error.message);
    }
  };

  // Update Item Quantity in Cart
  const updateItemToCart = async (productId: string, quantity: number) => {
    try {
      const response = await api.put(`cart}/${productId}`, {
        quantity,
      });

      const cart = response.data;
      const cartItemsMapped = cart.items.map(
        ({ product, quantity, price }: any) => ({
          productId: product.id,
          title: product.title,
          image: product.image,
          quantity,
          price,
        })
      );

      setCartItems(cartItemsMapped);
      setTotalAmount(cart.totalAmount);
    } catch (error: any) {
      setError(error.message);
    }
  };

  // Remove Item from Cart
  const removeItemToCart = async (productId: string) => {
    try {
      const response = await api.delete(`cart/${productId}`);

      const cart = response.data;
      const cartItemsMapped = cart.items.map(
        ({ product, quantity, price }: any) => ({
          productId: product.id,
          title: product.title,
          image: product.image,
          quantity,
          price,
        })
      );

      setCartItems(cartItemsMapped);
      setTotalAmount(cart.totalAmount);
    } catch (error: any) {
      setError(error.message);
    }
  };

  // Clear Cart
  const clearItems = async () => {
    try {
      const response = await api.delete(`/cart`);

      setCartItems([]); // Clear the cart
      setTotalAmount(0);
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <CartContext.Provider
      value={{
        CartItem: cartItems,
        price: totalAmount,
        addItemToCart,
        updateItemToCart,
        removeItemToCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
