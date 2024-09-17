import { CartItem } from "./Cart";

interface Order {
    total_price: string;
    paid_amount: string;
    status: string;
    country: string;
    city: string;
    district: string;
    street: string;
    postal_code: string;
    items: CartItem[];
}
export default Order;