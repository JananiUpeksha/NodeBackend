import {PrismaClient} from '@prisma/client';
import {Order} from "../model/order";

const prisma = new PrismaClient();


// save order
export async function OrderAdd(order: Order) {
    try {
        // create the order
        const newOrder = await prisma.order.create({
            data: {
                customer_email: order.customer_email,
                order_date: order.order_date,
                wrapping_charges: order.wrapping_charges,
                decoration_charges: order.decoration_charges,
                sub_total: order.sub_total,
                discount: order.discount,
                total_amount: order.total_amount,
                paid_amount: order.paid_amount,
                balance: order.balance,
            },
        });

        // save the order details
        let savedOrderDetails = await prisma.orderDetail.createMany({
            data: order.order_items.map((item) => ({
                order_id: newOrder.order_id,
                item: item.item,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                total: item.total,
            })),
        });

        // Update flower quantities based on order items
        for (const item of order.order_items) {
            await prisma.flower.updateMany({
                where: { flower_code: parseInt(item.item, 10) }, // Convert item to a number
                data: {
                    flower_qty_on_hand: {
                        decrement: item.quantity, // Reduce quantity by the ordered amount
                    },
                },
            });
        }

        console.log("Order Added : ", newOrder);
        return newOrder;
    } catch (error) {
        console.error("Error adding order : ", error);
        throw error;
    }
}


// get all orders
export async function getAllOrders() {
    try {
        const orders = await prisma.order.findMany();
        return await Promise.all(
            orders.map(async (order) => {
                const orderDetails = await prisma.orderDetail.findMany({
                    where: {order_id: order.order_id},
                });
                return {...order, order_items: orderDetails};
            })
        );
    } catch (err) {
        console.error("Error getting orders:", err);
        throw err;
    }
}