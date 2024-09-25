import { Link } from "react-router-dom";


 interface Order {
  id: number;
  city: string;
  country: string;
  total_price: string;
  status: string;
}

interface OrderViewProps {
  order: Order;
}

function OrderView({ order }: OrderViewProps) {
  return (
    <div className="order-item">
      <h3 className="order-title">Order #{order.id}</h3>
      <p className="order-city">{order.city}, {order.country}</p>
      <p className="order-status">Status: {order.status}</p>
      <p className="order-total">Total Price: {order.total_price}</p>
      <Link to={`/admin/orders/${order.id}`} className="button order-view-button">
        View Details
      </Link>
    </div>
  );
}

export default OrderView;
