import { NextResponse } from "next/server";
import Stripe from "stripe";
import { headers } from "next/headers";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET as string;

export async function POST(req: Request) {
    try {
        const body = await req.text();
        const signature = (await headers()).get("stripe-signature"); // ✅ await здесь

        if (!signature) {
            return NextResponse.json({ error: "No signature" }, { status: 400 });
        }

        let event: Stripe.Event;

        try {
            event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
        } catch (err: unknown) {
            if (err instanceof Error) {
                console.error("Webhook signature verification failed:", err.message);
                return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
            }
            console.error("Unknown error verifying signature:", err);
            return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
        }

        console.log("✅ Webhook event:", event.type);

        switch (event.type) {
            case "checkout.session.completed": {
                const session = event.data.object as Stripe.Checkout.Session;
                console.log("💰 Payment successful for session:", session.id);

                const orderId = session.metadata?.orderId;
                if (orderId) {
                    console.log("✅ Payment successful for order:", orderId);
                    // TODO: updateOrderPaymentStatus(orderId, "paid", session.id);
                } else {
                    console.warn("⚠️ No order ID found in session metadata");
                }
                break;
            }

            case "checkout.session.expired": {
                const expiredSession = event.data.object as Stripe.Checkout.Session;
                console.log("⌛ Payment session expired:", expiredSession.id);
                break;
            }

            default:
                console.log(`ℹ️ Unhandled event type: ${event.type}`);
        }

        return NextResponse.json({ received: true });
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.error("Webhook error:", err.message);
            return NextResponse.json({ error: err.message }, { status: 500 });
        }
        console.error("Unknown webhook error:", err);
        return NextResponse.json({ error: "Unexpected webhook error" }, { status: 500 });
    }
}