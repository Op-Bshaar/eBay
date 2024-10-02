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
    return (
        <div className="center-text">
            <div className="admin-order-info">
            <article>
                <h2>
                    معلومات البائع
                </h2>
                <div>
                    {order.product.seller_id }
                </div>
            </article>
            <article>
                <h2>
                    معلومات المشتري
                </h2>
                <div>
                    {order.order_request?.user_id }
                </div>
            </article>
            <article>
                <h2>
                    معلومات الشحن
                </h2>
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
            <p>تأكد من إيصال المنتج إلى العميل, ثم قم بتحويل المبلغ إلى البائع.</p>
        </div>
    );
}
export default AdminOrder;