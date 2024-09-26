import Address from "../pages/AddressInput/Address";
import { CartItem } from "./Cart";

export interface Order extends Address {
    order_request_items: any;
    created_at: string | number | Date;
    id: string;
    total_price: string;
    paid_amount: string;
    status: string;
    items: OrderItem[];
}
export interface OrderItem extends CartItem {
    status: string;
    order_request?: Order;
}
export default Order;