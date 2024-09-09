import {HtmlHTMLAttributes, useState} from "react";
import Product from "../../Product";
import api from "../../api";
import React from "react";
import "./Sell.css"
//TODO: finish sell
const ProductForm: React.FC = () => {
    const [product, setProduct] = useState<Product>(
      new Product('', '', '', '', '', '')
    );
const handleChange = async(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    {
        const {name,value}= event.target;
        setProduct
        (
            {
            ...product,
            [name]:value
            }
        );
    }
const handleSubmit = async(event: React.FormEvent) =>
    {
        event.preventDefault();
        try
        {
            const response = await api.post("/products",
                {title: product.title,
                 price: product.price,
                 description: product.description,
                 image: product.image
                }
            )
        }
        catch(error){}
    };
    
return (
     <form onSubmit={handleSubmit}>
      
      <div>
        <label className="objective">مواصفات المنتج:</label>
        <br></br>
        <label className="lab">Name</label>
        <input type="text" name="اسم المنتج" value={product.price} onChange={handleChange} className="name"/>
        <label className="lab">description</label>
        <input type="text" name="الوصف" value={product.description} onChange={handleChange} className="description"/>
        <label className="lab">price</label>
        <input type="text" name="السعر" value={product.price} onChange={handleChange} className="price"/>
        <label className="lab">image</label>
        <input type="text" name="الصورة" value={product.image} onChange={handleChange} className="image"/>
      </div>
      <button type="submit" className="submittionbutton">Submit</button>
    </form>
    )
};
export default ProductForm;