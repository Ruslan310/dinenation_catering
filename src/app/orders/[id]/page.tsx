'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useApp } from '@/contexts/AppContext';
import { Order } from '@/types';
import ImageWithFallback from '@/components/ImageWithFallback';
import dynamic from 'next/dynamic';

const getStatusColor = (status: Order['status']) => {
  switch (status) {
    case 'pending':
      return 'pending';
    case 'processing':
      return 'processing';
    case 'confirmed':
      return 'confirmed';
    case 'preparing':
      return 'preparing';
    case 'ready':
      return 'ready';
    case 'delivered':
      return 'delivered';
    case 'cancelled':
      return 'cancelled';
    default:
      return 'pending';
  }
};

const getStatusIcon = (status: Order['status']) => {
  switch (status) {
    case 'pending':
      return '⏳';
    case 'processing':
      return '💳';
    case 'confirmed':
      return '✅';
    case 'preparing':
      return '👨‍🍳';
    case 'ready':
      return '🚀';
    case 'delivered':
      return '🎉';
    case 'cancelled':
      return '❌';
    default:
      return '❓';
  }
};

const getStatusText = (status: Order['status']) => {
  switch (status) {
    case 'pending':
      return 'Awaiting payment';
    case 'processing':
      return 'Payment received';
    case 'confirmed':
      return 'Confirmed';
    case 'preparing':
      return 'Getting ready';
    case 'ready':
      return 'Ready for pick up';
    case 'delivered':
      return 'Delivered';
    case 'cancelled':
      return 'Cancelled';
    default:
      return 'Unknown';
  }
};

function OrderDetailPageContent() {
  const params = useParams();
  const router = useRouter();
  const appContext = useApp();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
    if (!appContext) return;

    const orderId = params.id as string;
    console.log('Looking for order with ID:', orderId);
    console.log('Available orders:', appContext.state.orders);
    
    const foundOrder = appContext.state.orders.find(o => o.id === orderId);
    console.log('Found order:', foundOrder);
    
    if (foundOrder) {
      setOrder(foundOrder);
      setIsLoading(false);
    } else {
      // Если заказ не найден, перенаправляем на страницу заказов
      console.log('Order not found, redirecting to /orders');
      router.replace('/orders');
    }
  }, [params.id, appContext, router, appContext?.state.orders]);

  const handlePayment = async () => {
    if (!order) return;

    try {
      console.log('Starting payment for order:', order.id);

      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: order.id,
          totalAmount: order.totalAmount,
          name: order.customerName,
          phone: order.phoneNumber,
          email: order.email,
          items: order.items,
        }),
      });

      const data = await res.json();
      if (data.url) {
        console.log('Redirecting to Stripe:', data.url);
        window.location.href = data.url;
      } else {
        console.error('Stripe session error:', data);
        alert('Payment error: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment error: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const handleStatusUpdate = () => {
    if (!order || !appContext) return;

    const statusOptions = [
      'pending',
      'processing',
      'confirmed',
      'preparing',
      'ready',
      'delivered',
      'cancelled',
    ];

    const currentIndex = statusOptions.indexOf(order.status);
    const nextStatus = statusOptions[(currentIndex + 1) % statusOptions.length];

    if (confirm(`Change order status to "${getStatusText(nextStatus as Order['status'])}"?`)) {
      appContext.updateOrderStatus(order.id, nextStatus as Order['status']);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Показываем загрузку пока не загрузились данные
  if (isLoading) {
    return (
      <div className="order-detail-page" suppressHydrationWarning>
        <div className="loading-content" suppressHydrationWarning>
          <div style={{ animation: 'spin 1s linear infinite', borderRadius: '50%', height: '3rem', width: '3rem', border: '2px solid #3b82f6', borderTopColor: 'transparent', margin: '0 auto 1rem' }} suppressHydrationWarning></div>
          <div style={{ fontSize: '1.5rem', color: '#6b7280', fontWeight: '500' }} suppressHydrationWarning>Loading order...</div>
        </div>
      </div>
    );
  }



  if (!order) {
    return (
      <div className="order-detail-page" suppressHydrationWarning>
        <div className="error-content" suppressHydrationWarning>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }} suppressHydrationWarning>❌</div>
          <h2 style={{ fontSize: '1.5rem', color: '#ef4444', marginBottom: '0.5rem' }} suppressHydrationWarning>Order not found</h2>
          <button
            onClick={() => router.push('/orders')}
            className="back-button"
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#f3f4f6',
              color: '#374151',
              border: '1px solid #d1d5db',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <svg className="back-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" width="16" height="16">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="order-detail-page" suppressHydrationWarning>
      {/* Header */}
      <div className="order-detail-header" suppressHydrationWarning>
        <div className="header-content" suppressHydrationWarning>
          <button
            onClick={() => router.push('/orders')}
            className="back-button"
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#f3f4f6',
              color: '#374151',
              border: '1px solid #d1d5db',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <svg className="back-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" width="16" height="16">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Orders
          </button>

          <h1 suppressHydrationWarning>Order #{order.id.split('-')[1]}</h1>
          <p suppressHydrationWarning>Created on {formatDate(order.createdAt)}</p>
        </div>
      </div>

      <div className="order-detail-content" suppressHydrationWarning>
        {/* Order Status */}
        <div className="order-status-section" suppressHydrationWarning>
          <div className={`order-status ${getStatusColor(order.status)}`} suppressHydrationWarning>
            <span className="status-icon" suppressHydrationWarning>{getStatusIcon(order.status)}</span>
            <span suppressHydrationWarning>{getStatusText(order.status)}</span>
          </div>

          {order.paymentStatus === 'pending' && (
            <button
              onClick={handlePayment}
              className="pay-order-btn"
              suppressHydrationWarning
            >
              💳 Pay Now
            </button>
          )}
        </div>

        {/* Order Summary */}
        <div className="order-summary" suppressHydrationWarning>
          <div className="summary-card" suppressHydrationWarning>
            <h3>💰 Order Summary</h3>
            <div className="summary-row">
              <span>Total Amount:</span>
              <span className="total-amount">€{order.totalAmount.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Items:</span>
              <span>{order.items.length}</span>
            </div>
            <div className="summary-row">
              <span>Payment Status:</span>
              <span className={`payment-status ${order.paymentStatus}`}>
                {order.paymentStatus === 'pending' ? '⏳ Pending' :
                 order.paymentStatus === 'paid' ? '✅ Paid' :
                 order.paymentStatus === 'cancelled' ? '❌ Cancelled' : '❓ Unknown'}
              </span>
            </div>
          </div>
        </div>

        {/* Customer Information */}
        <div className="customer-section" suppressHydrationWarning>
          <div className="customer-card" suppressHydrationWarning>
            <h3>👤 Customer Information</h3>
            <div className="customer-info">
              <div className="info-row">
                <span className="label">Name:</span>
                <span>{order.customerName}</span>
              </div>
              <div className="info-row">
                <span className="label">Phone:</span>
                <span>{order.phoneNumber}</span>
              </div>
              <div className="info-row">
                <span className="label">Email:</span>
                <span>{order.email}</span>
              </div>
              {order.deliveryAddress && (
                <div className="info-row">
                  <span className="label">Address:</span>
                  <span>{order.deliveryAddress}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="items-section" suppressHydrationWarning>
          <h3 suppressHydrationWarning>🍽️ Order Items</h3>
          <div className="items-list">
            {order.items.map((cartItem, index) => (
              <div key={index} className="item-card">
                <div className="item-image">
                  <ImageWithFallback
                    src={cartItem.menuItem.image}
                    alt={cartItem.menuItem.name}
                    width={80}
                    height={80}
                  />
                </div>

                <div className="item-details">
                  <h4 className="item-name">{cartItem.menuItem.name}</h4>
                  <p className="item-description">{cartItem.menuItem.description}</p>

                  {cartItem.extraIngredients.length > 0 && (
                    <div className="item-extras">
                      <strong>Extras:</strong>
                      {cartItem.extraIngredients.map((extra, extraIndex) => (
                        <span key={extraIndex}> {extra.name} (+€{extra.price})</span>
                      ))}
                    </div>
                  )}

                  {cartItem.sauces.length > 0 && (
                    <div className="item-sauces">
                      <strong>Sauces:</strong>
                      {cartItem.sauces.map((sauce, sauceIndex) => (
                        <span key={sauceIndex}> {sauce.name} (+€{sauce.price})</span>
                      ))}
                    </div>
                  )}

                  <div className="item-quantity">
                    Quantity: {cartItem.quantity}
                  </div>
                </div>

                <div className="item-price">
                  €{cartItem.totalPrice.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="actions-section" suppressHydrationWarning>
          <button
            onClick={handleStatusUpdate}
            className="update-status-btn"
          >
            Update Status
          </button>
        </div>
      </div>
    </div>
  );
}

export default dynamic(() => Promise.resolve(OrderDetailPageContent), {
  ssr: false,
});
