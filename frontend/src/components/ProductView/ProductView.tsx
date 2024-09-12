import { Link } from "react-router-dom";
import Product from "../../Product";
import "./ProductView.css";

interface ProductViewProps {
  product: Product;
  clickToGo?: boolean;
  showGoButton?: boolean;
}
function ProductView({
  product,
  clickToGo = true,
  showGoButton,
}: ProductViewProps) {
  showGoButton = showGoButton != undefined ? showGoButton : !clickToGo;
  const view = (
    <>
      <h3 className="product-title">{product.title}</h3>
      {product.image && <img src={product.image} className="product-image" />}
      <p className="product-price">${product.price}</p>
      {showGoButton && (
        <Link to={`/products/${product.id}`} className="button">
          عرض المنتج
        </Link>
      )}
    </>
  );
  return (
    <article className="product-item">
      {clickToGo ? (
        <Link to={`/products/${product.id}`} className="wrapper-button">
          {view}
        </Link>
      ) : (
        view
      )}
    </article>
  );
}

export default ProductView;
