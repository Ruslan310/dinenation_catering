import { NextResponse } from "next/server";
import Stripe from "stripe";
import { headers } from "next/headers";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET as string;

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = headers().get("stripe-signature");

    if (!signature) {
      return NextResponse.json({ error: "No signature" }, { status: 400 });
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
      console.error("Webhook signature verification failed:", err.message);
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    console.log("Webhook event:", event.type);

    switch (event.type) {
      case "checkout.session.completed":
        const session = event.data.object as Stripe.Checkout.Session;
        console.log("Payment successful for session:", session.id);
        
        // Здесь можно добавить логику для создания заказа
        // В реальном приложении здесь была бы сохранение в базу данных
        // и отправка уведомления клиенту
        
        // Обновляем статус оплаты заказа
        try {
          const orderId = session.metadata?.orderId;
          if (orderId) {
            console.log('Payment successful for order:', orderId);
            // В реальном приложении здесь был бы вызов API для обновления статуса заказа
            // updateOrderPaymentStatus(orderId, 'paid', session.id);
          } else {
            console.warn('No order ID found in session metadata');
          }
        } catch (error) {
          console.error('Error processing payment success:', error);
        }
        
        break;
        
      case "checkout.session.expired":
        const expiredSession = event.data.object as Stripe.Checkout.Session;
        console.log("Payment session expired:", expiredSession.id);
        break;
        
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error("Webhook error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
