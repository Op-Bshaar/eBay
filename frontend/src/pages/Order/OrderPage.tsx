import "../../Loader.css";
import { displayMoney } from "../../constants/Constants";
import "./OrderPage.css";
import { useRequireEmailVerification } from "../login/LoginRedirect";
import { useEffect, useState } from "react";
import api from "../../api";
import { useParams } from "react-router-dom";
import Order from "../../utils/Order";
import { addressToText } from "../../components/AddressInput/Address";
import ErrorMessage from "../../components/errorMessage/Error";
import { isAxiosError } from "axios";
function OrderPage() {
    useRequireEmailVerification();
    const { id } = useParams();
    const [isLoadingOrder, setIsLoadingOrder] = useState(false);
    const [loadingOrderErrorMessage, setLoadingOrderErrorMessage] = useState("");
    const [paymentLink, setPaymentLink] = useState("");
    const [isLoadingPaymentLink, setIsLoadingPaymentLink] = useState(false);
    const [loadingPaymentLinkErrorMessage, setLoadingPaymentLinkErrorMessage] = useState("");
    const [order, setOrder] = useState<Order | undefined>();
    const [isNavigating, setIsNavigating] = useState(false);
    const orderItems = order?.items ?? [];
    const loadOrder = () => {
        setIsLoadingOrder(true);
        setLoadingOrderErrorMessage("");
        api.get(`/orders/${id}`).then(response => {
            setOrder(response.data);
        }).catch(error => {
            let message = "حدث خطأ ما.";
            if (isAxiosError(error) ) {
                if (error.request && !error.response) {
                    message = "تعذر الاتصال, تحقق من الشبكة.";
                }
            }
            setLoadingOrderErrorMessage(message);
        }
        ).finally(() => setIsLoadingOrder(false));
    }
    // load on first render
    useEffect(loadOrder,[id]);
    const handleOrder = () => {
        const openLink = (link: string) => {
            setIsNavigating(true);
            window.location.href = link;
        };
        if (paymentLink) {
            openLink(paymentLink);
        }
        else {
            setIsLoadingPaymentLink(true);
            setLoadingPaymentLinkErrorMessage("")
            api.get(`/orders/get-payment-link/${id}`).then(response => {
                const link = response.data.payment_link;
                if (link) {
                    setPaymentLink(link);
                    openLink(link);
                }
            }).catch(error => {
                let message = "حدث خطأ ما.";
                if (isAxiosError(error)) {
                    if (error.request && !error.response) {
                        message = "تعذر الاتصال, تحقق من الشبكة.";
                    }
                    // order is not pending payment
                    else if (error.response?.status === 400) {
                        /*finish later*/
                    }
                    // order doesnt exists
                    else if (error.response?.status === 404) {
                        /*finish later*/
                    }
                }
                setLoadingPaymentLinkErrorMessage(message);
            }).finally(() => setIsLoadingPaymentLink(false));
        }
    };
    if (isNavigating) {
        return (
            <div className="tajawal-extralight">
            <p>يتم التحويل إلى بوابة الدفع.</p>
                <div className="loader absolute-center" />
            </div>
        );
    }
    if (isLoadingOrder) {
        return <div className="loader absolute-center" />;
    }
    else if (loadingOrderErrorMessage) {
        return (
            <ErrorMessage className="tajawal-extralight big-message absolute-center">
                {loadingOrderErrorMessage}
                <button onClick={loadOrder } className="link">أعد المحاولة.</button>
            </ErrorMessage>
        );
    }
    const items = (
        <div className="order-items-container">
            {order &&
                <div>
                    <span>العنوان:</span>
                    <span>{addressToText(order)}</span>
                </div>
            }
            {orderItems.map((item) => (
                <div className="order-item-container" key={item.product.id}>
                    <div className="order-item">
                        <span className="order-title-image-container">
                            <span className="order-item-image-container">
                                {item.product.image && <img src={item.product.image} />}
                            </span>
                            <span>
                                {item.product.title}
                            </span>
                        </span>
                        <span>
                            {displayMoney(item.product.price) }
                        </span>
                    </div>
                </div>
            ))}
            {order && orderItems.length > 1 && (
                <div className="order-item-container">
                    <div className="order-item">
                        <span>المجموع:</span>
                        <span>
                            {displayMoney(order.total_price)}
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
    const payment = (order && orderItems.length > 0 && order.status === 'pending' &&
        <div>
            <button onClick={handleOrder} disabled={isLoadingPaymentLink } className="button pay-button">ادفع
            ( {displayMoney(order.total_price)} )
            </button>
            {loadingPaymentLinkErrorMessage && 
                <ErrorMessage>
                    {loadingPaymentLinkErrorMessage}
                </ErrorMessage>
            }
            {isLoadingPaymentLink &&
                <div className= "small-loader"/>}
            <p>الدفع بواسطة (ادفع باي).</p>
        </div>
    );
    return (
        <div className="tajawal-extralight order-page">
            {items}
            <div className="center-text">
                {payment }
            </div>
        </div>
    );
}
export default OrderPage;
