import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BASE_URL } from "../../constants/URL";
import "../../context/cartProvider"
import { useCart } from "../../context/cartContext";
import Product from "../../Product";


function ProductsDeatils() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const {addItemToCart,CartItem,removeItemToCart} = useCart();
  useEffect(() => {
    console.log("Cart size is:", CartItem.length);
  }, [CartItem]);
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/products/${id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setProduct(data);
        setLoading(false);
      } catch (error) {
        console.error("Fetch error:", error);
        setError("An error occurred while fetching product details.");
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!product) {
    return <div>Product not found.</div>;
  }
  const handleBuy = () =>
    {
      console.log("id is:")
      console.log(product.id)
      addItemToCart(product.id)
    }
    
  return (
    <div>
      <h1>{product.title}</h1>
      <img src={product.image} alt={product.title} style={{ width: "200px" }} />
      <p>{product.description}</p>
      <p>Price: ${product.price}</p>
      <button onClick={handleBuy}>buy</button>
      
      <div>
        <p>your cart</p>
        
        {CartItem.length==0?
        (<p>your cart is empty</p>)
        :
        (<div>
          <ul>
            {CartItem.map((item =>
              (<li key={item.productId}>
                <img src={item.product.image} alt={item.product.title}/>
                <span>{item.product.title}: {item.quantity}x${item.product.price}</span>
              </li>)
              ))
            }
          </ul>
        </div>)};
      </div>
    </div>
  );
}

export default ProductsDeatils;
