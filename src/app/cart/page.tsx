'use client';

import { useState, useEffect } from 'react';
import { useApp } from '@/contexts/AppContext';
import { useSearchParams } from 'next/navigation';
import DeliveryForm, { DeliveryFormData } from '@/components/DeliveryForm';
import Modal from '@/components/Modal';
import NotificationModal from '@/components/NotificationModal';
import ImageWithFallback from '@/components/ImageWithFallback';
import { Order } from '@/types';

export default function CartPage() {
  const appContext = useApp();
  const searchParams = useSearchParams();
  const [isDeliveryModalOpen, setIsDeliveryModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [notificationModal, setNotificationModal] = useState<{
    isOpen: boolean;
    type: 'success' | 'error';
    title: string;
    message: string;
  }>({
    isOpen: false,
    type: 'success',
    title: '',
    message: ''
  });

  if (!appContext) {
    return (
      <div className="empty-state">
        <div className="empty-content">
          <div style={{ animation: 'spin 1s linear infinite', borderRadius: '50%', height: '3rem', width: '3rem', border: '2px solid #3b82f6', borderTopColor: 'transparent', margin: '0 auto 1rem' }}></div>
          <div style={{ fontSize: '1.5rem', color: '#6b7280', fontWeight: '500' }}>Loading app...</div>
        </div>
      </div>
    );
  }

  const { state, removeFromCart, updateCartItem, clearCart, addOrder, createPendingOrder } = appContext;

  // Обработка параметров URL для показа модалок
  useEffect(() => {
    const paymentStatus = searchParams.get('payment');
    
    if (paymentStatus === 'cancelled') {
      setNotificationModal({
        isOpen: true,
        type: 'error',
        title: 'Payment Cancelled',
        message: 'Your payment was cancelled. You can try again from the orders page.'
      });
    }
  }, [searchParams]);

  const handlePlaceOrder = () => {
    setIsDeliveryModalOpen(true);
  };

  const handleDeliverySubmit = async (formData: DeliveryFormData) => {
    setIsProcessing(true);
    
    try {
      // Создаем заказ с ожиданием оплаты
      const orderData = {
        items: state.cart,
        totalAmount: state.totalCartAmount,
        customerName: formData.name,
        phoneNumber: formData.phone,
        email: formData.email,
      };
      
      const order = await createPendingOrder(orderData);
      console.log('Order created:', order);
      
      setIsDeliveryModalOpen(false);
      
      // Небольшая задержка для сохранения заказа в localStorage
      setTimeout(() => {
        // Перенаправляем на страницу описания заказа
        router.push(`/orders/${order.id}`);
      }, 200);
    } catch (error) {
      console.error('Error creating order:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (state.cart.length === 0) {
    return (
      <div className="cart-page" suppressHydrationWarning>
        <div className="cart-header">
          <div className="header-content">
            <div className="header-main">
              <h1 className="header-text">Cart</h1>
              <p>Your cart is empty</p>
            </div>
          </div>
        </div>
        
        <div className="empty-cart">
          <div className="empty-cart-icon">🛒</div>
          <h2>Cart is empty</h2>
          <p>Add items from the menu to start your order</p>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page" suppressHydrationWarning>
      <div className="cart-header">
        <div className="header-content">
          <div className="header-main">
            <h1 className="header-text">Cart</h1>
            <p>{state.cart.length} item(s) in cart</p>
          </div>
          <button onClick={clearCart} className="clear-cart-btn">
            Clear Cart
          </button>
        </div>
      </div>

      <div className="cart-items-section">
        <div className="cart-container">
          <div className="cart-items-list">
            {state.cart.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="item-content">
                  <ImageWithFallback
                    src={item.menuItem.image}
                    alt={item.menuItem.name}
                    className="item-image"
                    width={144}
                    height={144}
                  />
                  
                  <div className="item-details">
                    <div className="item-info">
                      <h3 className="item-name">{item.menuItem.name}</h3>
                      <p className="item-price">€{item.menuItem.price}</p>
                      
                      {item.extraIngredients.length > 0 && (
                        <div className="item-extras">
                          <strong>Extras:</strong>
                          {item.extraIngredients.map((extra, extraIndex) => (
                            <span key={extraIndex}> {extra.name} (+€{extra.price})</span>
                          ))}
                        </div>
                      )}
                      
                      {item.sauces.length > 0 && (
                        <div className="item-sauces">
                          <strong>Sauces:</strong>
                          {item.sauces.map((sauce, sauceIndex) => (
                            <span key={sauceIndex}> {sauce.name} (+€{sauce.price})</span>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div className="item-controls">
                      <div className="item-total">
                        <span className="total-price">
                          €{item.totalPrice}
                        </span>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="remove-btn"
                          title="Remove item"
                        >
                          <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                          </svg>
                        </button>
                      </div>
                      
                      <div className="quantity-controls">
                        <button
                          onClick={() => updateCartItem(item.id, Math.max(0, item.quantity - 1))}
                          className="quantity-btn"
                        >
                          -
                        </button>
                        <span className="quantity-display">{item.quantity}</span>
                        <button
                          onClick={() => updateCartItem(item.id, item.quantity + 1)}
                          className="quantity-btn"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="checkout-section">
        <div className="checkout-content">
          <div className="checkout-container">
            <div className="checkout-summary">
              <div className="total-info">
                <div className="total-label">Total to pay:</div>
                <div className="total-amount">€{state.totalCartAmount.toFixed(2)}</div>
              </div>
              <button
                onClick={handlePlaceOrder}
                className="place-order-btn"
              >
                Place Order
              </button>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isDeliveryModalOpen}
        onClose={() => setIsDeliveryModalOpen(false)}
        title="Delivery Information"
        size="md"
      >
        <DeliveryForm
          onSubmit={handleDeliverySubmit}
          onCancel={() => setIsDeliveryModalOpen(false)}
          isLoading={isProcessing}
          totalAmount={state.totalCartAmount}
          cartItems={state.cart}
          onCreateOrder={createPendingOrder}
        />
      </Modal>

      <NotificationModal
        isOpen={notificationModal.isOpen}
        onClose={() => setNotificationModal(prev => ({ ...prev, isOpen: false }))}
        type={notificationModal.type}
        title={notificationModal.title}
        message={notificationModal.message}
      />
    </div>
  );
}
