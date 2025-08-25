import { NextResponse } from "next/server";
import Stripe from "stripe";
import { v4 as uuidv4 } from "uuid";
import { createOrder } from "@/lib/ordersStore";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, phone, email, totalAmount, items } = body;

        const orderId = uuidv4();

        // 🟢 создаём pending-заказ
        await createOrder({
            id: orderId,
            items,
            totalAmount,
            customerName: name,
            phoneNumber: phone,
            status: "pending",
            createdAt: new Date(),
        });

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            line_items: [
                {
                    price_data: {
                        currency: "eur",
                        product_data: { name: "Food Order" },
                        unit_amount: Math.round(totalAmount * 100),
                    },
                    quantity: 1,
                },
            ],
            customer_email: email,
            metadata: { orderId }, // 🔑 связка с заказом
            success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cancel`,
        });

        return NextResponse.json({ url: session.url });
    } catch (err: any) {
        console.error("Stripe error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
