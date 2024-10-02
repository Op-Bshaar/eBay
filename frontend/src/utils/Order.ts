import { ReactNode } from "react";
import Address from "../pages/AddressInput/Address";
import { CartItem } from "./Cart";
import Product from "./Product";

export interface Order extends Address {
    image: ReactNode;
    quantity: ReactNode;
    product: Product;
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
    review: number | null;
    shipping_company: string;
    shipment_id: string;
}
export default Order;