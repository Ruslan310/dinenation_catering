'use client';

import { Suspense } from 'react';
import PaymentCancelContent from "@/app/payment/cancel/CancelPageContent";

export default function PaymentCancelPage() {
    return (
        <Suspense fallback={<div>Loading cancel page...</div>}>
            <PaymentCancelContent />
        </Suspense>
    );
}
