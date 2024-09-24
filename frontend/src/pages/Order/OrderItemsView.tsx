import { displayMoney } from '../../constants/Constants';
import { OrderItem } from '../../utils/Order';
import { getOrderStatus } from './order_status';

function OrderItemsView({ orderItems, showStatus = false }: { orderItems: OrderItem[], showStatus? :boolean}) {
    return (
        orderItems.map((item) => (
            <div className="order-item-container" key={item.product.id}>
                <div className="order-item">
                    <span className="order-title-image-container">
                        <span className="order-item-image-container">
                            {item.product.image && <img src={item.product.image} />}
                        </span>
                        <span>{item.product.title}</span>
                    </span>
                    {showStatus && <span>{getOrderStatus(item.status)}</span>}
                    <span>{displayMoney(item.product.price)}</span>
                </div>
            </div>
        ))
    );
}

export default OrderItemsView;