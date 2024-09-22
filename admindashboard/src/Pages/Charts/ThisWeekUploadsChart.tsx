import React, { useEffect, useState } from "react";
import api from "../../api";
import {Doughnut} from 'react-chartjs-2';
import { ArcElement,Tooltip,Legend } from "chart.js";
import { Chart } from "chart.js";

Chart.register(ArcElement,Legend,Tooltip);
function ThisWeekUploads() {
    const [products, setProducts] = useState<product[]>([]);
    const [error, setError] = useState<string | null>(null);
    useEffect(() => {
      
      const fetchProducts = async () => {
        try {
          const response = await api.get(`admin/statistics/UploadsThisWeek`);
          const data = await response.data;
          setProducts(data);
          console.log(data);
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

    return <NameChart total={products}/>
    
}
interface NameChartProp
    {
        total: product[];
    };
interface product
{
  title: string;
  uploads: number;
}
    const NameChart: React.FC<NameChartProp>=({total})=>
        {
            const productmap= total.reduce((acc,product)=>{
              acc[product.title]=product.uploads;
              return acc;
            },{} as Record <string,number> )




                    console.log(productmap);

                    const data = {
                        labels: Object.keys(productmap),
                        datasets: [
                            {
                                label: 'عدد البائعين',
                                data: Object.values(productmap),
                                backgroundColor: ['#FF6832', '#36A2EB', '#FFCE56'],
                                hoverBackgroundColor: ['#FF8C42 ', '#4A90E2', '#FFDD57'],
                            },
                        ],
                    };

                    return(
                        <div className="user-container">
                            <h1>عدد السلع في المتجر:</h1>
                                <div>
                                    <Doughnut data={data}/>
                                    </div>
                    
                            
                          
                        </div>)
        };
    
export default ThisWeekUploads;
