import { generatePath, Navigate, useParams } from "react-router-dom";
import { PAGE_URLS } from "../../constants/URL";
import OrderItemsView from "./OrderItemsView";
import { getOrderStatus } from "./order_status";
import "./OrderPage.css";
import OrderLoadingMessage from "../../components/OrderLoadingMessage/OrderLoadingMessage";
import useOrder from "../../helpers/useOrder";

function OrderStatusPage() {
  const { order_id } = useParams();
  const { order, isLoadingOrder, loadingOrderErrorMessage, reloadOrder } = useOrder(order_id);
    if (isLoadingOrder || loadingOrderErrorMessage || !order) {
    return (
      <OrderLoadingMessage
        isLoadingOrder={isLoadingOrder}
        loadingOrderErrorMessage={loadingOrderErrorMessage}
        reloadOrder={reloadOrder}
        order={order}
      />
    );
  }

  if (order.status === "pending") {
    return <Navigate to={generatePath(PAGE_URLS.place_order, { order_id })} />;
  }

  return (
    <div className="order-page center-text">
      <div className="center-text order-status">
        {getOrderStatus(order.status)}
          </div>
      <OrderItemsView
        orderItems={order.items}
      />
    </div>
  );
}

export default OrderStatusPage;
