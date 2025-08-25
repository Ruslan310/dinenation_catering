import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function POST(req: Request) {
    try {
        const body = await req.json();

        console.log('----body.totalAmount', body.totalAmount)
        console.log('----body.totalAmoun1111t', Math.round(body.totalAmount * 100))
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            line_items: [
                {
                    price_data: {
                        currency: "eur",
                        product_data: {
                            name: "Food Order",
                        },
                        unit_amount: Math.round(body.totalAmount * 100),
                    },
                    quantity: 1,
                },
            ],
            customer_email: body.email,
            success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cancel`,
        });

        console.log("Stripe session:", session); // <---- добавь для проверки

        return NextResponse.json({ url: session.url });
    } catch (err: any) {
        console.error("Stripe error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
