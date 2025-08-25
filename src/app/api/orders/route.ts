import { NextResponse } from "next/server";
import { Order, CartItem } from "@/types";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { items, totalAmount, customerName, phoneNumber, email } = body as {
            items: CartItem[];
            totalAmount: number;
            customerName: string;
            phoneNumber: string;
            email: string;
        };

        // Валидация
        if (!items || !totalAmount || !customerName || !phoneNumber || !email) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Создаем заказ
        const order: Order = {
            id: `order-${Date.now()}`,
            items,
            totalAmount,
            status: "pending",
            createdAt: new Date(),
            customerName,
            phoneNumber,
            email,
            paymentStatus: 'pending'
        };

        // Тут должна быть запись в БД
        console.log("✅ Order created:", order);

        return NextResponse.json({ order });
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.error("Error creating order:", err.message);
            return NextResponse.json({ error: err.message }, { status: 500 });
        }
        console.error("Unknown error:", err);
        return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
    }
}
