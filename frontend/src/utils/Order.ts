import Address from "../pages/AddressInput/Address";
import { CartItem } from "./Cart";

interface Order extends Address {
    id: string;
    total_price: string;
    paid_amount: string;
    status: string;
    items: CartItem[];
}
export default Order;