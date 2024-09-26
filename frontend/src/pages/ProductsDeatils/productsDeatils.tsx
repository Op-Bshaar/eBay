import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { PAGE_URLS } from "../../constants/URL";
import { useCart } from "../../context/CartContext";
import Product, { readProduct } from "../../utils/Product";
import ErrorMessage from "../../components/errorMessage/Error";
import "../../styles/Loader.css";
import "../Cart/Cart.css";
import api, { useIsAuthenticated } from "../../helpers/api";
import './ProductDetails.css'
import { isAxiosError } from "axios";
import { cartContainsItem, CartItem, useCartOperations } from "../../utils/Cart";
import { displayMoney } from "../../constants/Constants";
import { useRedirectToLogin } from "../login/LoginRedirect";
import AddressPage from "../AddressPage/AddressPage";

function ProductsDeatils({ viewer = "buyer" }: { viewer?: "buyer" | "seller" }) {
    const id = useParams<{ id: string }>().id ?? "";
    const isAthenticated = useIsAuthenticated();
    const redirectToLogin = useRedirectToLogin();
    const [product, setProduct] = useState<Product | null>(null);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [isLoadingProduct, setIsLoadingProduct] = useState(true);
    const { cartItems } = useCart();
    const [addToCart, removeFromCart] = useCartOperations();
    const [shouldInputAddress, setShouldInputAddress] = useState(false);
    const isProductInCart = product
        ? cartContainsItem(cartItems, product)
        : false;
    const fetchProduct = async (id: string) => {
        try {
            if (errorMessage) {
                setErrorMessage("");
            }
            if (!isLoadingProduct) {
                setIsLoadingProduct(true);
            }
            if (product) {
                setProduct(null);
            }
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);
    if (shouldInputAddress && product) {
        const item: CartItem = { product: product, quantity: 1 };
        return <AddressPage order_items={[item]} />;
    }
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
                {product.image &&
                    <img
                        src={product.image}
                        style={{ width: "200px" }}
                    />}
                <p>{product.description}</p>
                <p>السعر: {displayMoney(product.price)}</p>
                {
                    product.isAvailable && viewer === "buyer" &&
                    <>
                        <button
                            className={`button ${isProductInCart ? "remove-from-cart-button" : ""}`}
                            onClick={isAthenticated ?
                                isProductInCart
                                    ? () => removeFromCart(product)
                                    : () => addToCart(product) :
                                redirectToLogin
                            }
                        >
                            {isProductInCart ? "احذف من السلة" : "أضف إلى السلة"}
                        </button>
                        {!isProductInCart && <button className="button" onClick={() => setShouldInputAddress(true)}>شراء</button>}
                    </>
                }
            </article>

            {isProductInCart && (
                <aside>
                    <p>تمت إضافة المنتج إلى السلة</p>
                    <Link to={PAGE_URLS.cart} className="link">
                        اذهب إلى السلة.
                    </Link>
                </aside>
            )}
            {!product.isAvailable &&
                <p className="error-message">المنتج غير متوفر.</p>}
        </div>
    );
}

export default ProductsDeatils;
