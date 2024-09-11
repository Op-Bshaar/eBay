import { Link } from 'react-router-dom';
import Product from '../../Product';
import './ProductView.css'

interface ProductViewProps { product: Product, clickToGo?: boolean, showGoButton?:boolean }
function ProductView({ product, clickToGo = true, showGoButton }: ProductViewProps) {
    showGoButton = showGoButton != undefined ? showGoButton : !clickToGo;
    const view = (
        <div className="product-item">
            <img src={product.image} alt={"لا توجد صورة"} className="product-image" />
            <div className="product-properties">
                <h2 className="product-title">{product.title}</h2>
                <p className="product-description">{product.description}</p>
                <p className="product-price">${product.price}</p>
            </div>
            {showGoButton && <button className = "button">عرض المنتج</button> }
        </div>
    ); 
    return ( 
        clickToGo ?
            <Link to={`/products/${product.id}`} className="wrapper-button">
                {view}
            </Link> :
            view
    );
}

export default ProductView;