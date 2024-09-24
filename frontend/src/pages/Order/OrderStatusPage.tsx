import { generatePath, Navigate, useParams } from "react-router-dom";
import OrderLoadingMessage from "./OrderLoadingMessage";
import useOrder from "./useOrder";
import { PAGE_URLS } from "../../constants/URL";
import OrderItemsView from "./OrderItemsView";
import "./OrderPage.css";
import { getOrderStatus } from "./order_status";

function OrderStatusPage() {
    const { order_id } = useParams();
    const { order, isLoadingOrder, loadingOrderErrorMessage, reloadOrder } = useOrder(order_id);
    if (isLoadingOrder || loadingOrderErrorMessage || !order) {
        return <OrderLoadingMessage isLoadingOrder={isLoadingOrder} loadingOrderErrorMessage={loadingOrderErrorMessage} reloadOrder={reloadOrder} order={order} />
    }
    if (order.status === 'pending') {
        return <Navigate to={generatePath(PAGE_URLS.place_order, { order_id }) } />
    }
    return (
        <div className="tajawal-extralight order-page">
            <div className="center-text">
                {getOrderStatus(order.status)}
            </div>
            <OrderItemsView orderItems={order.items} showStatus={order.status === 'paid' } />
        </div>
    );
}

export default OrderStatusPage;