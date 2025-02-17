export interface Customer {
    customer_id?: number;  // Optional, as it will be auto-generated
    customer_firstName: string;
    customer_lastName: string;
    customer_phone: string;
    customer_email: string;
    customer_address: string;
    gender: string;
}
