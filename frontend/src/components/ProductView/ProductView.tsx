import { Link } from "react-router-dom";
import Product from "../../Product";
import "./ProductView.css";
import { displayMoney } from "../../constants/Currency";

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
          <p className="product-price">{displayMoney(product.price)}</p>
      {showGoButton && (
        <Link to={`/products/${product.id}`} className="button product-view-button">
          التفاصيل
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
