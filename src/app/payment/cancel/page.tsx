'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useApp } from '@/contexts/AppContext';

export default function PaymentCancelPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const appContext = useApp();
  const [isProcessing, setIsProcessing] = useState(true);
  const [hasRedirected, setHasRedirected] = useState(false);
  
  useEffect(() => {
    const handlePaymentCancel = async () => {
      // Защита от повторных редиректов
      if (hasRedirected) {
        console.log('Already redirected, skipping');
        return;
      }

      try {
        if (!appContext) {
          setIsProcessing(false);
          return;
        }
        
        // Обновляем статус оплаты заказа если есть order_id
        const orderId = searchParams.get('order_id');
        if (orderId) {
          try {
            console.log('Updating payment status for cancelled order:', orderId);
            appContext.updateOrderPaymentStatus(orderId, 'cancelled');
            console.log('Payment status updated to cancelled');
          } catch (error) {
            console.error('Error updating payment status:', error);
          }
        }
        
        // Определяем, куда перенаправлять пользователя
        const referrer = document.referrer;
        const isFromCart = referrer.includes('/cart') || referrer.includes('localhost:3000/cart');
        
        setHasRedirected(true); // Отмечаем, что редирект выполнен
        
        if (isFromCart) {
          // Если пользователь пришел с корзины, возвращаем в корзину
          console.log('User came from cart, redirecting back to cart');
          router.replace('/cart?payment=cancelled');
        } else if (orderId) {
          // Если есть order_id, перенаправляем на страницу деталей заказа
          console.log('User came from orders, redirecting to order details');
          router.replace(`/orders/${orderId}`);
        } else {
          // Если нет order_id, перенаправляем на страницу заказов
          console.log('No order ID, redirecting to orders page');
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
    <div className="payment-cancel-page" suppressHydrationWarning>
      <div className="cancel-content" suppressHydrationWarning>
        <div className="loading-spinner" suppressHydrationWarning>
          <div style={{ animation: 'spin 1s linear infinite', borderRadius: '50%', height: '3rem', width: '3rem', border: '2px solid #ef4444', borderTopColor: 'transparent', margin: '0 auto 1rem' }} suppressHydrationWarning></div>
          <div style={{ fontSize: '1.5rem', color: '#6b7280', fontWeight: '500' }} suppressHydrationWarning>
            {isProcessing ? 'Redirecting...' : 'Redirecting...'}
          </div>
        </div>
        
        {/* Кнопка для выхода из цикла редиректов */}
        <div style={{ marginTop: '2rem', textAlign: 'center' }} suppressHydrationWarning>
          <button 
            onClick={() => router.push('/')}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            Go to Home
          </button>
        </div>
      </div>
    </div>
  );
}
