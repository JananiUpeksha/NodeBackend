export interface OrderDetail {
    /*order_details_id?: number;*/
    order_id: number;
    item: string;
    quantity: number;
    unitPrice: number;
    total: number;
}