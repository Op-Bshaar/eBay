import { displayMoney } from '../../constants/Constants';
import { CartItem } from '../../utils/Cart';

function OrderItemsView({ orderItems }: { orderItems :CartItem[]}) {
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
                    <span>{displayMoney(item.product.price)}</span>
                </div>
            </div>
        ))
    );
}

export default OrderItemsView;