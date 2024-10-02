import { useParams } from "react-router-dom";
import useOrderItem from "../../../frontend/src/helpers/useOrderItem";
import "./css/AdminOrder.css";
function AdminOrder() {
    const { orderId } = useParams();
    const { order, messageElement } = useOrderItem(orderId);
    if (!order) {
        return <div className="admin-order-message">{messageElement}</div>;
    }
    return (
        <div className ="admin-order">
            <article>
                <h2>
                    معلومات الشحن
                </h2>
            </article>
            <article>
                <h2>
                    معلومات البائع
                </h2>
            </article>
            <article>
                <h2>
                    معلومات المشتري
                </h2>
            </article>
        </div>
    );
}
export default AdminOrder;