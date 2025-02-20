import {OrderDetail} from "./orderDetails";

export interface Order {
    order_id?: number;
    customer_email: string;
    order_date: string;
    order_items: OrderDetail[]; // List of items in the placeOrder
    wrapping_charges: number;
    decoration_charges: number;
    sub_total: number;
    discount: number;
    total_amount: number;
    paid_amount: number;
    balance: number;
}