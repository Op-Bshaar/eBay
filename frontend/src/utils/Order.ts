import Address from "../pages/AddressInput/Address";
import { CartItem } from "./Cart";

export interface Order extends Address {
    order_request_items?: OrderItem[];
    created_at: string | number | Date;
    id: string;
    total_price: string;
    paid_amount: string;
    status: string;
    items: OrderItem[];
    first_name: string;
    last_name: string;
    phone: string;
}
export interface OrderItem extends CartItem {
    id:string;
    status: string;
    order_request?: Order;
}
export default Order;