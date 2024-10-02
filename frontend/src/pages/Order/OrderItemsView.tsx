import { useEffect, useRef, useState } from 'react';
import { displayMoney } from '../../constants/Constants';
import { OrderItem } from '../../utils/Order';
import { getOrderStatus } from './order_status';
import RateOrder from '../../components/Rate/RateOrder';

function OrderItemsView({ orderItems }: { orderItems: OrderItem[] }) {
    const [showRateMenu, setShowRateMenu] = useState(false);
    const ratPopupRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (ratPopupRef.current && !ratPopupRef.current.contains(event.target as Node)) {
                setShowRateMenu(false);
            }
        }
        if (showRateMenu) {
            // Attach the event listener to the document
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            // Remove the event listener if the menu is not expanded
            document.removeEventListener('mousedown', handleClickOutside);
        }
        // Cleanup function to remove the event listener on unmount or when `expanded` changes
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showRateMenu]);

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
                    <span>{getOrderStatus(item.status)}</span>
                    {(item.status === "shipped") &&
                        <button className="link rate-button"
                            onClick={()=>setShowRateMenu(true) }>
                            قييم المنتج
                        </button>
                    }
                    {showRateMenu && <RateOrder order={item} ref={ratPopupRef } />}
                    <span>{displayMoney(item.product.price)}</span>
                </div>
            </div>
        ))
    );
}
export default OrderItemsView;