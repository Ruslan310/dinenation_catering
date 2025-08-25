import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const sessionId = searchParams.get("session_id");

        if (!sessionId) {
            return NextResponse.json(
                { error: "Session ID is required" },
                { status: 400 }
            );
        }

        const session = await stripe.checkout.sessions.retrieve(sessionId);

        return NextResponse.json({ session });
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.error("Error retrieving session:", err.message);
            return NextResponse.json({ error: err.message }, { status: 500 });
        }

        console.error("Unknown error retrieving session:", err);
        return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
    }
}
