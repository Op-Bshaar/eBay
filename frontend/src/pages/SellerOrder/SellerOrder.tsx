import { Link, useParams } from "react-router-dom";
import ErrorMessage from "../../components/errorMessage/Error";
import { FormEvent, useEffect, useRef, useState } from "react";
import api from "../../helpers/api";
import Order, { OrderItem } from "../../utils/Order";
import { useRequireAuthentication } from "../login/LoginRedirect";
import "../../styles/Loader.css";
import "./SellerOrder.css";
import { isAxiosError } from "axios";
import ProductView from "../../components/ProductView/ProductView";
import { getOrderStatus, getSellerStatus } from "../Order/order_status";
import { addressToText } from "../AddressInput/Address";

function SellerOrder() {
    useRequireAuthentication();
    const { order_id } = useParams();
    const { order, messageElement } = useOrder(order_id);
    if (!order) {
        return messageElement;
    }
    const product = <ProductView product={order.product} clickToGo={false} showGoButton={false} showNotAvailable={false} />
    const status = getSellerStatus(order.status);
    const isReadyForShipment = status === 'paid' || order.status === 'notified-seller';
    return (
        <div className="seller-order-page">
            <div className="seller-order-container">
                <div className="seller-order-status">
                    حالة الطلب: {getOrderStatus(status)}
                </div>
                {product}
                <Link to={`/seller-portal/products/${order.product.id}`} className="button">عرض المنتج</Link>
            </div>
            {isReadyForShipment && order.order_request && <Shipment orderRequest={order.order_request} orderId={order.id} />}
        </div>
    );
}
function Shipment({ orderRequest, orderId }: { orderRequest: Order, orderId:string }) {
    const [isInputting, setIsInputting] = useState(false);
    const [shippingCompany, setShippingCompany] = useState('');
    const [shipmentNumber, setShipmentNumber] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const formRef = useRef<HTMLFormElement>(null);
    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();
        if (!formRef.current?.checkValidity()) {
            formRef.current?.reportValidity();
            return;
        }
        setIsSubmitting(true);
        api.post(`sellers/orders/ship/${orderId}`, {
            ["shipment_number"]:shipmentNumber,
            ["shipping_company"]: shippingCompany,
        }).then(() => {
            window.location.reload();
        }).finally(() => setIsSubmitting(false));
    }
    return (
        <article>
            <h2>
                معلومات الشحن
            </h2>
            <strong>الرجاء شحن الطلب ,ثم رفع معلومات الشحن.</strong>
            <div>
                <span>العنوان:</span>
                <span> {addressToText(orderRequest)}</span>
            </div>
            <div>
                <span>الاسم:</span>
                <span> {orderRequest.first_name} {orderRequest.last_name}</span>
            </div>
            <div>
                <span>رقم الجوال:</span>
                <span dir="ltr"> {orderRequest.phone}</span>
            </div>
            {isInputting ?
                <form ref={formRef }>
                    <div>الرجاء إدخال معلومات الشحن.</div>
                    <div className="shipping-input-group">
                        <label htmlFor="shipping_company" >شركة الشحن</label>
                        <input id="shipping_company" name="shipping_company" minLength={3} maxLength={100}
                            onChange={e => setShippingCompany(e.currentTarget.value) }
                            value={shippingCompany} required />
                    </div>
                    <div className="shipping-input-group">
                        <label htmlFor="shipment_number" >رقم الشحنة</label>
                        <input id="shipment_number" name="shipment_number" minLength={3} maxLength={100}
                            onChange={e => setShipmentNumber(e.currentTarget.value)}
                            value={shipmentNumber} required />
                    </div>
                    <div className="shipment-button-container">
                        <button type="button" onClick={() => {
                            setIsInputting(false);
                            setShippingCompany("");
                            setShipmentNumber("");
                        }}
                            disabled={isSubmitting }
                            className="button">
                            الغاء
                        </button>
                        <button onClick={handleSubmit} type="submit" className="button"
                            disabled={isSubmitting}>
                            تأكيد
                        </button>
                    </div>
                </form> :
                <button onClick={() => setIsInputting(true)} className="button">رفع معلومات الشحن</button>
            }

        </article>
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
