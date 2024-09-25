import { useState } from "react";
import { useCart } from "../../context/CartContext";
import { CartItem, useCartOperations } from "../../utils/Cart";
import { emptyAddress } from "../AddressInput/Address";
import { generatePath, useNavigate } from "react-router-dom";
import api from "../../helpers/api";
import { PAGE_URLS } from "../../constants/URL";
import { isAxiosError } from "axios";
import ErrorMessage from "../../components/errorMessage/Error";
import AddressInput from "../AddressInput/AddressInput";
import "./AddressPage.css";
function AddressPage({ order_items }: { order_items?:CartItem[]}) {
    const { cartItems } = useCart();
    const [, , clearCart] = useCartOperations();
    const [address, setAddress] = useState(emptyAddress);
    const [isAddressValid, setIsAddressValid] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();
    const items = (order_items || cartItems).map((item) => {
        return {
            product_id: item.product.id,
            quantity: item.quantity,
        };
    });
    const handleOrder = () => {
        setIsLoading(true);
        setErrorMessage("");
        api
            .post("/orders", {
                items,
                address,
            })
            .then((response) => {
                const path = generatePath(PAGE_URLS.place_order, { order_id: response.data.order_id });
                navigate(path)
            })
            .then(clearCart)
            .catch((error) => {
                console.log(error);
                let message = "حدث خطأ ما.";
                if (isAxiosError(error)) {
                    if (error.request && !error.response) {
                        message = "تعذر الاتصال, تحقق من الشبكة.";
                    }
                    // some products are unavailable
                    else if (error.response?.status === 400) {
                        navigate(PAGE_URLS.cart);
                    }
                }
                setErrorMessage(message);
            })
            .finally(() => setIsLoading(false));
    };
    if (errorMessage) {
        return (
            <ErrorMessage className="absolute-center tajawal-extralight center-message center-text">
                {errorMessage}
                <button onClick={handleOrder} className="link">
                    أعد المحاولة.
                </button>
            </ErrorMessage>
        );
    }
    if (isLoading) {
        return (
            <div className="address-page-loader-container">
                <div className="loader" />
            </div>
        );
    }
    return (
        <div className="address-page">
            <AddressInput
                address={address}
                setAddress={setAddress}
                isValid={isAddressValid}
                setIsValid={setIsAddressValid}
                disabled={isLoading}
            />
            <button
                className="button"
                onClick={handleOrder}
                disabled={!isAddressValid || isLoading}
            >
                تأكيد العنوان
            </button>
        </div>
    );
}

export default AddressPage;