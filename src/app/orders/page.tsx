'use client';

import { useApp } from '../../contexts/AppContext';
import { Order } from '../../types';

const getStatusColor = (status: Order['status']) => {
  switch (status) {
    case 'pending':
      return 'pending';
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
      return 'Awaiting confirmation';
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

export default function OrdersPage() {
  const appContext = useApp();
  
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

  const { state, updateOrderStatus } = appContext;

  const handleStatusUpdate = (orderId: string, currentStatus: Order['status']) => {
    const statusOptions = [
      'pending',
      'confirmed',
      'preparing',
      'ready',
      'delivered',
      'cancelled',
    ];

    const currentIndex = statusOptions.indexOf(currentStatus);
    const nextStatus = statusOptions[(currentIndex + 1) % statusOptions.length];

    if (confirm(`Change order status to "${getStatusText(nextStatus as Order['status'])}"?`)) {
      updateOrderStatus(orderId, nextStatus as Order['status']);
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

  const renderOrderItem = (order: Order) => (
    <div key={order.id} className="order-item">
      {/* Order Header */}
      <div className="order-header">
        <div className="order-info">
          <div className="order-number">
            <span>#{order.id.split('-')[1]}</span>
          </div>
          <div className="order-details">
            <h3>Order #{order.id.split('-')[1]}</h3>
            <p>{formatDate(order.createdAt)}</p>
          </div>
        </div>
        
        <div className={`order-status ${getStatusColor(order.status)}`}>
          <span className="status-icon">{getStatusIcon(order.status)}</span>
          {getStatusText(order.status)}
        </div>
      </div>

      {/* Order Info */}
      <div className="order-content">
        <div className="order-details-section">
          <h4>
            <span className="section-icon">💰</span>
            Order Details
          </h4>
          <div className="details-list">
            <div className="detail-row">
              <span className="detail-label">Total Amount:</span>
              <span className="detail-value">€{order.totalAmount.toFixed(2)}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Items:</span>
              <span className="detail-value">{order.items.length}</span>
            </div>
          </div>
        </div>
        
        <div className="order-details-section">
          <h4>
            <span className="section-icon">👤</span>
            Customer Info
          </h4>
          <div className="customer-info">
            <div className="customer-name">{order.customerName}</div>
            <div className="customer-contact">{order.phoneNumber}</div>
            <div className="customer-contact">{order.deliveryAddress}</div>
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="order-items">
        <h4>
          <span className="items-icon">🍽️</span>
          Order Items
        </h4>
        <div className="items-list">
          {order.items.map((cartItem, index) => (
            <div key={index} className="item-row">
              <div className="item-info">
                <span className="item-name">{cartItem.menuItem.name}</span>
                <span className="item-quantity">x{cartItem.quantity}</span>
              </div>
              <span className="item-price">€{cartItem.totalPrice.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Update Status Button */}
      <button
        onClick={() => handleStatusUpdate(order.id, order.status)}
        className="update-status-btn"
      >
        Update Status
      </button>
    </div>
  );

  if (state.orders.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-content">
          <div className="empty-icon">📋</div>
          <h2>No orders yet</h2>
          <p>Place your first order in the cart to see it here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page">
      {/* Header */}
      <div className="orders-header">
        <div className="header-content">
          <h1>Your Orders</h1>
          <p>Track and manage your culinary adventures</p>
          <div className="orders-count">
            <span className="count-icon">📊</span>
            Total Orders: {state.orders.length}
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="orders-section">
        <div className="orders-container">
          <div className="orders-list">
            {state.orders.map(renderOrderItem)}
          </div>
        </div>
      </div>
    </div>
  );
}
