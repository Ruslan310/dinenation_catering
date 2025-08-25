import { NextResponse } from "next/server";
import Stripe from "stripe";
import { updateOrder } from "@/lib/ordersStore";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
    const sig = req.headers.get("stripe-signature") as string;
    const rawBody = await req.text();

    let event: Stripe.Event;
    try {
        event = stripe.webhooks.constructEvent(rawBody, sig, endpointSecret);
    } catch (err: any) {
        console.error("❌ Invalid signature:", err.message);
        return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    if (event.type === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session;
        const orderId = session.metadata?.orderId;

        if (orderId) {
            await updateOrder(orderId, {
                status: "confirmed", // 🟢 подтверждён после успешной оплаты
            });
            console.log("✅ Order confirmed:", orderId);
        }
    }

    return NextResponse.json({ received: true });
}
