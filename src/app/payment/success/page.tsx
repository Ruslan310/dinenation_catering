'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useApp } from '@/contexts/AppContext';

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const appContext = useApp();
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasRedirected, setHasRedirected] = useState(false);
  
  useEffect(() => {
    const handlePaymentSuccess = async () => {
      // Защита от повторных редиректов
      if (hasRedirected) {
        console.log('Already redirected, skipping');
        return;
      }

      try {
        if (!appContext) {
          setError('App context not available');
          setIsProcessing(false);
          return;
        }
        
        const sessionId = searchParams.get('session_id');
        
        // Если есть session_id, значит оплата прошла успешно
        if (sessionId) {
          try {
            // Получаем данные сессии из Stripe API
            const sessionRes = await fetch(`/api/stripe/session?session_id=${sessionId}`);
            const sessionData = await sessionRes.json();
            
            if (!sessionRes.ok) {
              throw new Error(sessionData.error || 'Failed to retrieve session');
            }
            
            const session = sessionData.session;
            console.log('Retrieved session:', session);
            console.log('Session metadata:', session.metadata);
            
            const orderId = session.metadata?.orderId;
            console.log('Extracted order ID:', orderId);
            
            if (orderId) {
              console.log('Updating payment status for order:', orderId);
              appContext.updateOrderPaymentStatus(orderId, 'paid', sessionId);
              console.log('Payment status updated successfully');
              
              setHasRedirected(true); // Отмечаем, что редирект выполнен
              
              // Перенаправляем на страницу деталей заказа
              console.log('Redirecting to:', `/orders/${orderId}`);
              router.replace(`/orders/${orderId}`);
            } else {
              console.warn('No order ID found in session metadata');
              console.log('Full session data:', session);
              setError('No order ID found');
              setIsProcessing(false);
              return;
            }
          } catch (error) {
            console.error('Error processing payment success:', error);
            setError('Failed to process payment');
            setIsProcessing(false);
            return;
          }
        } else {
          // Если нет session_id, перенаправляем на главную
          setHasRedirected(true);
          router.replace('/');
        }
      } catch (error) {
        console.error('Payment success error:', error);
        setError('An unexpected error occurred');
        setIsProcessing(false);
      }
    };

    handlePaymentSuccess();
  }, [router, searchParams, appContext, hasRedirected]);

  if (error) {
    return (
      <div className="payment-success-page" suppressHydrationWarning>
        <div className="success-content" suppressHydrationWarning>
          <div className="error-content" suppressHydrationWarning>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }} suppressHydrationWarning>❌</div>
            <h2 style={{ fontSize: '1.5rem', color: '#ef4444', marginBottom: '0.5rem' }} suppressHydrationWarning>Error</h2>
            <p style={{ color: '#6b7280', marginBottom: '1rem' }} suppressHydrationWarning>{error}</p>
            <button 
              onClick={() => router.push('/')}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer'
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
    <div className="payment-success-page" suppressHydrationWarning>
      <div className="success-content" suppressHydrationWarning>
        <div className="loading-spinner" suppressHydrationWarning>
          <div style={{ animation: 'spin 1s linear infinite', borderRadius: '50%', height: '3rem', width: '3rem', border: '2px solid #10b981', borderTopColor: 'transparent', margin: '0 auto 1rem' }} suppressHydrationWarning></div>
          <div style={{ fontSize: '1.5rem', color: '#6b7280', fontWeight: '500' }} suppressHydrationWarning>
            {isProcessing ? 'Processing payment...' : 'Redirecting...'}
          </div>
        </div>
      </div>
    </div>
  );
}
