import { useParams } from "react-router-dom";
import useOrderItem from "../../../frontend/src/helpers/useOrderItem";
function AdminOrder() {
    const { orderId } = useParams();
    const { order, messageElement } = useOrderItem(orderId);
    if (!order) {
        return messageElement;
    }
    return (
        <div>
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