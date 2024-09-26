import React, { useEffect, useState } from 'react'
import Order from '../../utils/Order';
import api from '../../helpers/api';

function GetSellerOrders() {
    const [products, setProducts] = useState<Order[]>([]);

    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [error, setError] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);


    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setError("");
                setIsLoading(true);
                const response = await api.get(`/sellers/orders`);
                const data = await response.data;
                setProducts(data);
            } catch (error) {
                console.error("Fetch error:", error);
                setError("An error occurred while fetching products.");
            } finally {
                setIsLoading(false);
            }
        };

       

 
        fetchProducts();
    }, []);
  return (
    <div>GetSellerOrders</div>
  )
}

export default GetSellerOrders