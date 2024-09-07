import { CartContext } from "./cartContext";
import { BASE_URL } from "../constants/BaseUrl";
import { CartItem } from "../utils/itemdata";
import { useState, useEffect, PropsWithChildren, FC } from "react";
import { useAuthenticationContext } from "./AuthenticationContext";

const CartProvider: FC<PropsWithChildren> = ({ children }) => {
  const { token } = useAuthenticationContext();

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      return;
    }

    const fetchCart = async () => {
      try {
        const response = await fetch(`${BASE_URL}/cart`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Something went wrong while fetching the cart.");
        }

        const cart = await response.json();
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
  }, [token]);

  // Add Item to Cart
  const addItemToCart = async (productId: string) => {
    try {
      const response = await fetch(`${BASE_URL}/cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId,
          quantity: 1,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add item to the cart.");
      }

      const cart = await response.json();
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
      const response = await fetch(`${BASE_URL}/cart/{id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId,
          quantity,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update the cart.");
      }

      const cart = await response.json();
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
      const response = await fetch(`${BASE_URL}/cart/${productId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to remove the item from the cart.");
      }

      const cart = await response.json();
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
      const response = await fetch(`${BASE_URL}/cart`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to empty the cart.");
      }

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
