import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function POST(req: Request) {
    try {
        const body = await req.json();

        console.log('Request body:', body);
        console.log('STRIPE_SECRET_KEY exists:', !!process.env.STRIPE_SECRET_KEY);
        console.log('NEXT_PUBLIC_APP_URL:', process.env.NEXT_PUBLIC_APP_URL);
        
        if (!process.env.STRIPE_SECRET_KEY) {
            throw new Error('STRIPE_SECRET_KEY is not configured');
        }
        
        if (!process.env.NEXT_PUBLIC_APP_URL) {
            throw new Error('NEXT_PUBLIC_APP_URL is not configured');
        }

        // Валидация входных данных
        if (!body.totalAmount || body.totalAmount <= 0) {
            throw new Error('Invalid total amount');
        }
        
        if (!body.email) {
            throw new Error('Email is required');
        }
        
        if (!body.name) {
            throw new Error('Name is required');
        }
        
        if (!body.phone) {
            throw new Error('Phone is required');
        }
        
        if (!body.orderId) {
            throw new Error('Order ID is required');
        }

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
            metadata: {
                orderId: body.orderId,
                customerName: body.name,
                phoneNumber: body.phone,
                email: body.email,
                totalAmount: body.totalAmount.toString(),
                itemsCount: (body.items || []).length.toString(),
            },
            success_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/cancel?order_id=${body.orderId}`,
        });

        console.log("Stripe session created successfully:", session.id);

        if (!session.url) {
            throw new Error('Stripe session URL is missing');
        }

        return NextResponse.json({ url: session.url });
    } catch (err: any) {
        console.error("Stripe error:", err);
        console.error("Error details:", {
            message: err.message,
            type: err.type,
            code: err.code,
            statusCode: err.statusCode
        });
        return NextResponse.json({ 
            error: err.message,
            details: {
                type: err.type,
                code: err.code,
                statusCode: err.statusCode
            }
        }, { status: 500 });
    }
}
