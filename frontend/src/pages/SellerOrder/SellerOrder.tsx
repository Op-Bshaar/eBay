import { Link, useParams } from "react-router-dom";
import ErrorMessage from "../../components/errorMessage/Error";
import { useEffect, useState } from "react";
import api from "../../helpers/api";
import { OrderItem } from "../../utils/Order";
import { useRequireAuthentication } from "../login/LoginRedirect";
import "../../styles/Loader.css";
import "./SellerOrder.css";
import { isAxiosError } from "axios";
import ProductView from "../../components/ProductView/ProductView";
import { getOrderStatus } from "../Order/order_status";
import { addressToText } from "../AddressInput/Address";

function SellerOrder() {
    useRequireAuthentication();
    const { order_id } = useParams();
    const { order, messageElement } = useOrder(order_id);
    if (!order) {
        return messageElement;
    }
    const product = <ProductView product={order.product} clickToGo={false} showGoButton={false} showNotAvailable={false} />
    const isReadyForShipment = order.status === 'paid' || order.status === 'notified-seller';
    const status = isReadyForShipment ? 'paid' : order.status;
    const shipment = isReadyForShipment &&
        <>
            <p>
                <span>
                    الرجاء شحن المنتج إلى العنوان التالي: 
                </span>
                <span> {order.order_request && addressToText(order.order_request)}</span>
            </p>
        </>;
    return (
        <div className="seller-order-page">
            <div className="seller-order-status">
                حالة الطلب: {getOrderStatus(status)}
            </div>
            {product}
            <Link to={`/seller-portal/products/${order.product.id}`} className="button">عرض المنتج</Link>
            {shipment }
        </div>
    );
}
function useOrder(order_id?: string) {
    const [order, setOrder] = useState<OrderItem | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const fetchOrder = (order_id?: string) => {
        if (order_id) {
            if (!isLoading) {
                setIsLoading(true);
            }
            if (errorMessage) {
                setErrorMessage("");
            }
            if (order) {
                setOrder(null);
            }
            api
                .get(`/sellers/orders/${order_id}`)
                .then((response) => {
                    const data = response.data;
                    setOrder(data.order);
                })
                .catch((error) => {
                    console.log(error);
                    if (isAxiosError(error) && error.response?.status === 404) {
                        /* empty */
                    } else {
                        setErrorMessage("حدث خطأ ما.");
                    }
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => fetchOrder(order_id), [order_id]);
    let messageElement;
    if (order) {
        messageElement = null;
    }
    else if (!order_id || (!order && !errorMessage && !isLoading)) {
        messageElement = (
            <ErrorMessage className="center-text big-message">
                الطلب غير موجود.
            </ErrorMessage>
        );
    } else if (isLoading) {
        messageElement = (
            <div>
                <div className="loader center-loader" />
            </div>
        );
    } else if (errorMessage) {
        messageElement = (
            <ErrorMessage className="center-text big-message">
                {errorMessage}
                <button className="link" onClick={() => fetchOrder(order_id)}>
                    إعادة المحاولة.
                </button>
            </ErrorMessage>
        );
    }
    return { order, messageElement };
}
export default SellerOrder;
