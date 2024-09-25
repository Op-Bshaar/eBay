import "../../styles/Loader.css";
import { displayMoney } from "../../constants/Constants";
import "./OrderPage.css";
import { useRequireEmailVerification } from "../login/LoginRedirect";
import { useState } from "react";
import api from "../../helpers/api";
import { generatePath, Navigate, useParams } from "react-router-dom";
import { addressToText } from "../AddressInput/Address";
import ErrorMessage from "../../components/errorMessage/Error";
import { isAxiosError } from "axios";
import useOrder from "./useOrder";
import OrderLoadingMessage from "./OrderLoadingMessage";
import OrderItemsView from "./OrderItemsView";
import { ignore } from "antd/es/theme/useToken";
import { PAGE_URLS } from "../../constants/URL";
function OrderPage() {
    useRequireEmailVerification();
    const { order_id } = useParams();
    const { order, isLoadingOrder, loadingOrderErrorMessage, reloadOrder } = useOrder(order_id);
    const [paymentLink, setPaymentLink] = useState("");
    const [isLoadingPaymentLink, setIsLoadingPaymentLink] = useState(false);
    const [loadingPaymentLinkErrorMessage, setLoadingPaymentLinkErrorMessage] =
        useState("");
    const [isNavigating, setIsNavigating] = useState(false);
    const orderItems = order?.items ?? [];
    const handleOrder = () => {
        const openLink = (link: string) => {
            setIsNavigating(true);
            window.location.href = link;
        };
        if (paymentLink) {
            openLink(paymentLink);
        } else {
            setIsLoadingPaymentLink(true);
            setLoadingPaymentLinkErrorMessage("");
            api
                .get(`/orders/get-payment-link/${order_id}`)
                .then((response) => {
                    const link = response.data.payment_link;
                    if (link) {
                        setPaymentLink(link);
                        openLink(link);
                    }
                })
                .catch((error) => {
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
                })
                .finally(() => setIsLoadingPaymentLink(false));
        }
    };
    if (isNavigating) {
        return (
            <div className="tajawal-extralight big-message absolute-center">
                <p>يتم التحويل إلى بوابة الدفع.</p>
                <div className="loader center-loader" />
            </div>
        );
    }
    if (isLoadingOrder || loadingOrderErrorMessage || !order) {
        return <OrderLoadingMessage isLoadingOrder={isLoadingOrder} loadingOrderErrorMessage={loadingOrderErrorMessage} reloadOrder={reloadOrder} order={order} />
    }
    if (order.status !== 'pending') {
        return <Navigate to={generatePath(PAGE_URLS.view_order, { order_id: order.id })} />
    }
    const items = (
        <div className="order-items-container">
            {order && (
                <div>
                    <span>العنوان:</span>
                    <span>{addressToText(order)}</span>
                </div>
            )}
            <OrderItemsView orderItems={orderItems} />
            {order && orderItems.length > 1 && (
                <div className="order-item-container">
                    <div className="order-item">
                        <span style={{ color: "#81E68C" }}>المجموع:</span>
                        <span style={{ color: "#81E68C" }}>
                            {displayMoney(order.total_price)}
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
    const payment = order &&
        orderItems.length > 0 &&
        order.status === "pending" && (
            <div>
                <button
                    onClick={handleOrder}
                    disabled={isLoadingPaymentLink}
                    className="button pay-button"
                >
                    ادفع عن طريق ادفع باي
                </button>
                <img src="/assets/WhatsApp Image 2024-09-16 at 11.49.42 AM.jpeg" />
                {loadingPaymentLinkErrorMessage && (
                    <ErrorMessage>{loadingPaymentLinkErrorMessage}</ErrorMessage>
                )}
                {isLoadingPaymentLink && <div className="small-loader" />}
            </div>
        );
    return (
        <div className="tajawal-extralight order-page">
            {items}
            <div className="center-text">{payment}</div>
        </div>
    );
}
export default OrderPage;
