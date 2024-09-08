import React from 'react';
import Product from '../../Product';
import './ProductView.css'

function ProductView({ product }: { product: Product }) {
    console.log(product);
    // TODO: Render Product
    return (
        <div className="product-view"> 
            <img src= {product.image} alt= {"لا توجد صورة"} className="product-image" />
            <div className="product-properties"> 
            <h2 className="product-title">{product.title}</h2>
            <p className="product-description">{product.description}</p>
            <p className="product-price">${product.price}</p>
            </div>
        </div>
    );
}

export default ProductView;