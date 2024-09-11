import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { PAGE_URLS } from "../../constants/URL";
import { useCart } from "../../context/CartContext";
import Product, { readProduct } from "../../Product";
import ErrorMessage from "../../components/errorMessage/Error";
import "../../Loader.css";
import api from "../../api";
import { isAxiosError } from "axios";
import { cartContainsItem, useCartOperations } from "../../Cart";

function ProductsDeatils() {

  const id = useParams<{ id: string }>().id ?? "";
  const [product, setProduct] = useState<Product | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isLoadingProduct, setIsLoadingProduct] = useState(false);
  const { cartItems } = useCart();
  const isProductInCart = product
    ? cartContainsItem(cartItems, product)
    : false;
  const [addToCart, removeFromCart] = useCartOperations();
  const fetchProduct = async (id: string) => {
    try {
      setErrorMessage("");
      setIsLoadingProduct(true);
      setProduct(null);
      const response = await api.get(`/products/${id}`);
      const data = response.data;
      setProduct(readProduct(data));
    } catch (error) {
      const genericError = "حدث خطأ ما.";
      if (isAxiosError(error)) {
        if (error.request && !error.response) {
          setErrorMessage("تعذر الاتصال, تحقق من الاتصال بالشبكة.");
        }
        // not found
        else if (error.response?.status === 404) {
          setErrorMessage("");
        } else {
          setErrorMessage(genericError);
        }
      } else {
        setErrorMessage(genericError);
      }
      console.error("get error:", error);
    } finally {
      setIsLoadingProduct(false);
    }
  };
  useEffect(() => {
    fetchProduct(id);
  }, [id]);
  const productLoader = <div className="loader" />;
  const errorElement = (
    <ErrorMessage className="big-message">
      {errorMessage}
      <button className="link" onClick={() => fetchProduct(id)}>
        أعد المحاولة.
      </button>
    </ErrorMessage>
  );
  const productNotFound = <div className="big-message">المنتج غير موجود.</div>;
  if (!product) {
    return (
      <div className="tajawal-extralight product-details-page">
        <div className="absolute-center ">
          {isLoadingProduct
            ? productLoader
            : errorMessage
            ? errorElement
            : productNotFound}
        </div>
      </div>
    );
  }
  return (
    <div className="product-details-page">
      <article className=" product-details">
        <h1>{product.title}</h1>
        <img
          src={product.image}
          alt={product.title}
          style={{ width: "200px" }}
        />
        <p>{product.description}</p>
        <p>Price: ${product.price}</p>
        <button
          className="button"
          onClick={
            isProductInCart
              ? () => removeFromCart(product)
              : () => addToCart(product)
          }
        >
          {isProductInCart ? "احذف من السلة" : "أضف إلى السلة"}
        </button>
      </article>

      {isProductInCart && (
        <aside>
          <p>تمت إضافة المنتج إلى السلة</p>
          <Link to={PAGE_URLS.cart} className="link">
            اذهب إلى السلة.
          </Link>
        </aside>
      )}
    </div>
  );
}

export default ProductsDeatils;
