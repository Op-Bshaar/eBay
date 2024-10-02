import { useParams } from "react-router-dom";
import useOrderItem from "../../../frontend/src/helpers/useOrderItem";

import "./css/AdminOrder.css";
import { addressToText } from "../../../frontend/src/pages/AddressInput/Address";
function AdminOrder() {
    const { orderId } = useParams();
    const { order, messageElement } = useOrderItem(orderId);
    if (!order) {
        return <div className="admin-order-message">{messageElement}</div>;
    }
    const cancelled = order.status === 'canceled' || order.status === 'failed' || order.status === 'timeout';
    const shipped = order.status === 'shipped';
    const paid = order.status === 'paid' || order.status === 'notified-seller' || order.status === 'shipped';
    return (
        <div className="admin-order-page">
            <div className="admin-order-info">
                {order.order_request ?
                    <BuyerInfo userId={order.order_request?.user_id} /> :
                    <p>معلومات المشتري غير متوفرة.</p>
                    }
                <SellerInfo sellerId={order.product.seller_id } />
                <article>
                    <h2>
                        معلومات الشحن
                    </h2>

                    {!shipped ? <p>لم يتم الشحن.</p> :
                        <>
                            <div>
                                <span>
                                    شركة الشحن:
                                </span>
                                <span>
                                    {order.shipping_company}
                                </span>
                            </div>
                            <div>
                                <span>
                                    رقم الشحنة:
                                </span>
                                <span>
                                    {order.shipment_number}
                                </span>
                            </div>
                        </>
                    }
                    <div>
                        <span>
                            العنوان:
                        </span>
                        <span>
                            {order.order_request && addressToText(order.order_request)}
                        </span>
                    </div>
                    <div>
                        <span>
                            اسم المستلم:
                        </span>
                        <span>
                            {order.order_request?.first_name} {order.order_request?.last_name}
                        </span>
                    </div>
                    <div>
                        <span>
                            جوال المستلم:
                        </span>
                        <span dir="ltr">
                            {order.order_request?.phone}
                        </span>
                    </div>
                </article>
            </div>
            {cancelled && <p>تم إلغاء الطلب, حالة الطلب: {(order.status)}</p>}
            {order.status === 'pending' && <p>بانتظار الدفع.</p> }
            {paid && !shipped && <p>بانتظار البائع لشحن النتج.</p> }
            {shipped && <p>تأكد من إيصال المنتج إلى العميل, ثم قم بتحويل المبلغ إلى البائع.</p>}
        </div>
    );
}
function BuyerInfo({ userId }: {userId:string}) {
    return (
        <article>
            <h2>
                معلومات المشتري
            </h2>
            <div>
                {userId}
            </div>
        </article>
    );
}
function SellerInfo({ sellerId }: { sellerId: string }) {
    return (
        <article>
            <h2>
                معلومات البائع
            </h2>
            <div>
                {sellerId }
            </div>
        </article>
    );
}
export default AdminOrder;