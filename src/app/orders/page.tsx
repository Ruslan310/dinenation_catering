'use client';

import { useApp } from '../../contexts/AppContext';
import { Order } from '../../types';

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

export default function OrdersPage() {
  const appContext = useApp();

  if (!appContext) {
    return (
      <div className="empty-state" suppressHydrationWarning>
        <div className="empty-content" suppressHydrationWarning>
          <div style={{ animation: 'spin 1s linear infinite', borderRadius: '50%', height: '3rem', width: '3rem', border: '2px solid #3b82f6', borderTopColor: 'transparent', margin: '0 auto 1rem' }} suppressHydrationWarning></div>
          <div style={{ fontSize: '1.5rem', color: '#6b7280', fontWeight: '500' }} suppressHydrationWarning>Loading app...</div>
        </div>
      </div>
    );
  }

  const { state, updateOrderStatus } = appContext;

  const handleStatusUpdate = (orderId: string, currentStatus: Order['status']) => {
    const statusOptions = [
      'pending',
      'processing',
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

      {/* Order Summary */}
      <div className="order-summary">
        <div className="summary-row">
          <span>Total: €{order.totalAmount.toFixed(2)}</span>
          <span>{order.items.length} items</span>
        </div>
        <div className="summary-row">
          <span>{order.customerName}</span>
          <span className={`payment-status ${order.paymentStatus}`}>
            {order.paymentStatus === 'pending' ? '⏳ Pending' : 
             order.paymentStatus === 'paid' ? '✅ Paid' : 
             order.paymentStatus === 'cancelled' ? '❌ Cancelled' : '❓ Unknown'}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="order-actions">
        <button
          onClick={() => window.location.href = `/orders/${order.id}`}
          className="view-order-btn"
        >
          👁️ View Details
        </button>
        <button
          onClick={() => handleStatusUpdate(order.id, order.status)}
          className="update-status-btn"
        >
          Update Status
        </button>
      </div>
    </div>
  );

  if (state.orders.length === 0) {
    return (
      <div className="empty-state" suppressHydrationWarning>
        <div className="empty-content" suppressHydrationWarning>
          <div className="empty-icon" suppressHydrationWarning>📋</div>
          <h2 suppressHydrationWarning>No orders yet</h2>
          <p suppressHydrationWarning>Place your first order in the cart to see it here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page" suppressHydrationWarning>
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
