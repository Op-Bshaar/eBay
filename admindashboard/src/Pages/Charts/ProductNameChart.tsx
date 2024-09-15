import React, { useEffect, useState } from "react";
import api from "../../../../frontend/src/api";
import {Doughnut} from 'react-chartjs-2';
import { ArcElement,Tooltip,Legend } from "chart.js";
import { Chart } from "chart.js";
import  Product from "../../../../frontend/src/Product";
Chart.register(ArcElement,Legend,Tooltip);
function ProductNameChart() {
    const [products, setProducts] = useState<Product[]>([]);
    const [error, setError] = useState<string | null>(null);
    useEffect(() => {
      
      const fetchProducts = async () => {
        try {
          const response = await api.get(`/admin/products`);
          const data = await response.data;
          setProducts(data.product);
          console.log(data.product);
        } catch (error) {
          console.error("Fetch error:", error);
          setError("An error occurred while fetching products.");
        }
      };
  
      fetchProducts();
    }, []);
    if (error) {
      return <div>{error}</div>;
    }

    return <NameChart products={products}/>
    
}
interface NameChartProp
    {
        products: Product[];
    };
    const NameChart: React.FC<NameChartProp>=({products})=>
        {
            const productmap= products.reduce((acc:{[key:string]: number},prod) =>
                {
                    if(acc[prod.title])
                        {
                            acc[prod.title]++;
                        }
                    else{acc[prod.title] = 1;}
                    
                    return acc},{})




                    console.log(productmap);

                    const data = {
                        labels: Object.keys(productmap),
                        datasets: [
                            {
                                label: 'Product Distribution',
                                data: Object.values(productmap),
                                backgroundColor: ['#FF6832', '#36A2EB', '#FFCE56'],
                                hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
                            },
                        ],
                    };

                    return(
                        <div className="user-container">
                            <h1>product name chart:</h1>
                                <div>
                                    <Doughnut data={data}/>
                                    </div>
                    
                            
                          
                        </div>)
        };
    
export default ProductNameChart;
