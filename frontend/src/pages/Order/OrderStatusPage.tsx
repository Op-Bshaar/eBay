import { useParams } from "react-router-dom";
import OrderLoadingMessage from "./OrderLoadingMessage";
import useOrder from "./useOrder";

function OrderStatusPage() {
    const { order_id } = useParams();
    const { order, isLoadingOrder, loadingOrderErrorMessage, reloadOrder } = useOrder(order_id);
    if (isLoadingOrder || loadingOrderErrorMessage || !order) {
        return <OrderLoadingMessage isLoadingOrder={isLoadingOrder} loadingOrderErrorMessage={loadingOrderErrorMessage} reloadOrder={reloadOrder} order={order} />
    }
    return null;
}

export default OrderStatusPage;