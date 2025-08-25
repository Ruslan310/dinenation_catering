// src/app/cancel/page.tsx
'use client';

import { useSearchParams } from "next/navigation";

export default function CancelPage() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get("orderId");

    return (
        <div className="cancel-page">
            <h1>❌ Payment canceled</h1>
            <p>Your order {orderId ? `(${orderId})` : ""} was not paid.</p>
        </div>
    );
}
