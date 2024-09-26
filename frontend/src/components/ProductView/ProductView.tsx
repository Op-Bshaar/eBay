import { Link } from "react-router-dom";
import Product from "../../utils/Product";
import "./ProductView.css";
import { displayMoney } from "../../constants/Constants";

interface ProductViewProps {
  product: Product;
  clickToGo?: boolean;
    showGoButton?: boolean;
    showNotAvailable?: boolean;
    viewer?: "buyer" | "seller";
}
function ProductView({
    product,
    clickToGo = true,
    showGoButton,
    showNotAvailable = true,
    viewer = "buyer"
}: ProductViewProps) {
    showGoButton = showGoButton != undefined ? showGoButton : !clickToGo;
    const detailsLink = viewer === 'buyer' ? `/products/${product.id}` : `/seller-portal/products/${product.id}`;
    const view = (
        <>
            <h3 className="product-title">{product.title}</h3>
            {product.image && <img src={product.image} className="product-image" loading="lazy" />}
            <p className="product-price">{displayMoney(product.price)}</p>
            {showGoButton && (
                <Link to={detailsLink} className="button product-view-button">
                    التفاصيل
                </Link>
            )}
            {!product.isAvailable && showNotAvailable &&
                <p className="error-message">المنتج غير متوفر.</p>}
        </>
    );
    return (
        clickToGo ? (
            <Link to={detailsLink}
                aria-label={`اضغط للذهاب إلى تفاصيل ${product.title}`}
                className="wrapper-button">
                <div className={`product-item ${(!product.isAvailable && showNotAvailable) ? 'product-item-not-available' : ''}`} >
                    {view}
                </div >
            </Link>
        ) : (
            <div className={`product-item ${(!product.isAvailable && showNotAvailable) ? 'product-item-not-available' : ''}`} >
                {view}
            </div>
        )
    );
}

export default ProductView;
