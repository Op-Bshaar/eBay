import React from 'react';
import Product from '../../Product';

function ProductView({ product }: { product: Product }) {
    // TODO: Render Product
    return (
        <p>{`${product}`}</p>
    );
}

export default ProductView;