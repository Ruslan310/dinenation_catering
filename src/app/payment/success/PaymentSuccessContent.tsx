'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useApp } from '@/contexts/AppContext';

export default function PaymentSuccessContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const appContext = useApp();
    const [isProcessing, setIsProcessing] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [hasRedirected, setHasRedirected] = useState(false);

    useEffect(() => {
        const handlePaymentSuccess = async () => {
            if (hasRedirected) return;

            try {
                if (!appContext) {
                    setError('App context not available');
                    setIsProcessing(false);
                    return;
                }

                const sessionId = searchParams.get('session_id');

                if (sessionId) {
                    try {
                        const sessionRes = await fetch(`/api/stripe/session?session_id=${sessionId}`);
                        const sessionData = await sessionRes.json();

                        if (!sessionRes.ok) throw new Error(sessionData.error || 'Failed to retrieve session');

                        const session = sessionData.session;
                        const orderId = session.metadata?.orderId;

                        if (orderId) {
                            appContext.updateOrderPaymentStatus(orderId, 'paid', sessionId);

                            setHasRedirected(true);
                            router.replace(`/orders/${orderId}`);
                        } else {
                            setError('No order ID found');
                            setIsProcessing(false);
                        }
                    } catch (err) {
                        console.error('Error processing payment success:', err);
                        setError('Failed to process payment');
                        setIsProcessing(false);
                    }
                } else {
                    setHasRedirected(true);
                    router.replace('/');
                }
            } catch (err) {
                console.error('Payment success error:', err);
                setError('Unexpected error occurred');
                setIsProcessing(false);
            }
        };

        handlePaymentSuccess();
    }, [router, searchParams, appContext, hasRedirected]);

    if (error) {
        return (
            <div className="payment-success-page">
                <div className="success-content">
                    <div className="error-content">
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>❌</div>
                        <h2 style={{ fontSize: '1.5rem', color: '#ef4444', marginBottom: '0.5rem' }}>Error</h2>
                        <p style={{ color: '#6b7280', marginBottom: '1rem' }}>{error}</p>
                        <button
                            onClick={() => router.push('/')}
                            style={{
                                padding: '0.75rem 1.5rem',
                                backgroundColor: '#3b82f6',
                                color: 'white',
                                border: 'none',
                                borderRadius: '0.5rem',
                                cursor: 'pointer',
                            }}
                        >
                            Go to Home
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="payment-success-page">
            <div className="success-content">
                <div className="loading-spinner">
                    <div
                        style={{
                            animation: 'spin 1s linear infinite',
                            borderRadius: '50%',
                            height: '3rem',
                            width: '3rem',
                            border: '2px solid #10b981',
                            borderTopColor: 'transparent',
                            margin: '0 auto 1rem',
                        }}
                    />
                    <div style={{ fontSize: '1.5rem', color: '#6b7280', fontWeight: '500' }}>
                        {isProcessing ? 'Processing payment...' : 'Redirecting...'}
                    </div>
                </div>
            </div>
        </div>
    );
}
