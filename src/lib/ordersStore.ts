import { Order } from "@/types";

let orders: Order[] = [];

export function createOrder(order: Order) {
    orders.push(order);
    return order;
}

export function updateOrder(orderId: string, data: Partial<Order>) {
    const idx = orders.findIndex((o) => o.id === orderId);
    if (idx !== -1) {
        orders[idx] = { ...orders[idx], ...data };
    }
    return orders[idx];
}

export function getOrders() {
    return orders;
}
