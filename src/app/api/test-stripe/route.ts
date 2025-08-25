import { NextResponse } from "next/server";

export async function GET() {
    try {
        const config = {
            hasStripeSecretKey: !!process.env.STRIPE_SECRET_KEY,
            hasStripePublishableKey: !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
            hasWebhookSecret: !!process.env.STRIPE_WEBHOOK_SECRET,
            hasAppUrl: !!process.env.NEXT_PUBLIC_APP_URL,
            appUrl: process.env.NEXT_PUBLIC_APP_URL,
            stripeSecretKeyPrefix: process.env.STRIPE_SECRET_KEY?.substring(0, 7) || 'not set',
            stripePublishableKeyPrefix: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.substring(0, 7) || 'not set',
        };

        return NextResponse.json({
            status: 'ok',
            config,
            message: 'Stripe configuration check completed'
        });
    } catch (error) {
        return NextResponse.json({
            status: 'error',
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}
