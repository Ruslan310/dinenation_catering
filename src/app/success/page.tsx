'use client';

import { useEffect } from "react";
import { useApp } from "@/contexts/AppContext";

export default function SuccessPage() {
    const app = useApp();

    useEffect(() => {
        if (app) {
            app.clearCart();
        }
    }, [app]);

    return (
        <div className="success-page">
            <h1>🎉 Thank you!</h1>
            <p>Your payment was successful. We are processing your order.</p>
        </div>
    );
}
