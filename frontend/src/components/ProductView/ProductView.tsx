import React from 'react';
import Product from '../../Product';

function ProductView({ product }: { product: Product }) {
    console.log(product);
    // TODO: Render Product
    return (
        <div className="product-view">  
            <h2 className="product-title">{product.title}</h2>
            <p className="product-description">{product.description}</p>
            <p className="product-price">${product.price}</p>
        </div>
    );
}

export default ProductView;