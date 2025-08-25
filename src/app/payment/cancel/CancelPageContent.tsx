'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useApp } from '@/contexts/AppContext';

export default function PaymentCancelContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const appContext = useApp();
    const [isProcessing, setIsProcessing] = useState(true);
    const [hasRedirected, setHasRedirected] = useState(false);

    useEffect(() => {
        const handlePaymentCancel = async () => {
            if (hasRedirected) return;

            try {
                if (!appContext) {
                    setIsProcessing(false);
                    return;
                }

                const orderId = searchParams.get('order_id');
                if (orderId) {
                    appContext.updateOrderPaymentStatus(orderId, 'cancelled');
                }

                const referrer = document.referrer;
                const isFromCart =
                    referrer.includes('/cart') || referrer.includes('localhost:3000/cart');

                setHasRedirected(true);

                if (isFromCart) {
                    router.replace('/cart?payment=cancelled');
                } else if (orderId) {
                    router.replace(`/orders/${orderId}`);
                } else {
                    router.replace('/orders');
                }
            } catch (error) {
                console.error('Payment cancel error:', error);
                setIsProcessing(false);
            }
        };

        handlePaymentCancel();
    }, [router, searchParams, appContext, hasRedirected]);

    return (
        <div className="payment-cancel-page">
            <div className="cancel-content">
                <div className="loading-spinner">
                    <div
                        style={{
                            animation: 'spin 1s linear infinite',
                            borderRadius: '50%',
                            height: '3rem',
                            width: '3rem',
                            border: '2px solid #ef4444',
                            borderTopColor: 'transparent',
                            margin: '0 auto 1rem',
                        }}
                    />
                    <div
                        style={{
                            fontSize: '1.5rem',
                            color: '#6b7280',
                            fontWeight: '500',
                        }}
                    >
                        {isProcessing ? 'Redirecting...' : 'Redirecting...'}
                    </div>
                </div>

                <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                    <button
                        onClick={() => router.push('/')}
                        style={{
                            padding: '0.75rem 1.5rem',
                            backgroundColor: '#3b82f6',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.5rem',
                            cursor: 'pointer',
                            fontSize: '1rem',
                        }}
                    >
                        Go to Home
                    </button>
                </div>
            </div>
        </div>
    );
}
