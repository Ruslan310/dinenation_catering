'use client';

import Modal from './Modal';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'success' | 'error';
  title: string;
  message: string;
  buttonText?: string;
  onButtonClick?: () => void;
}

export default function NotificationModal({
  isOpen,
  onClose,
  type,
  title,
  message,
  buttonText,
  onButtonClick
}: NotificationModalProps) {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      default:
        return 'ℹ️';
    }
  };

  const getIconColor = () => {
    switch (type) {
      case 'success':
        return '#10b981';
      case 'error':
        return '#ef4444';
      default:
        return '#3b82f6';
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title=""
      size="sm"
    >
      <div className="notification-modal">
        <div className="notification-icon" style={{ color: getIconColor() }}>
          {getIcon()}
        </div>
        
        <div className="notification-content">
          <h3 className="notification-title">{title}</h3>
          <p className="notification-message">{message}</p>
        </div>
        
        <div className="notification-actions">
          {buttonText && onButtonClick ? (
            <button
              onClick={onButtonClick}
              className="notification-btn notification-btn-primary"
            >
              {buttonText}
            </button>
          ) : (
            <button
              onClick={onClose}
              className="notification-btn notification-btn-secondary"
            >
              Close
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
}
