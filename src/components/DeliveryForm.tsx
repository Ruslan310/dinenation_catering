'use client';

import { useState } from 'react';

interface DeliveryFormProps {
  onSubmit: (formData: DeliveryFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export interface DeliveryFormData {
  name: string;
  phone: string;
  email: string;
}

export default function DeliveryForm({ onSubmit, onCancel, isLoading = false }: DeliveryFormProps) {
  const [formData, setFormData] = useState<DeliveryFormData>({
    name: '',
    phone: '',
    email: ''
  });

  const [errors, setErrors] = useState<Partial<DeliveryFormData>>({});
  const [touched, setTouched] = useState<Partial<DeliveryFormData>>({});

  const validateField = (name: keyof DeliveryFormData, value: string): string => {
    switch (name) {
      case 'name':
        if (!value.trim()) return 'Name is required';
        if (value.trim().length < 2) return 'Name must be at least 2 characters';
        return '';
      
      case 'phone':
        if (!value.trim()) return 'Phone is required';
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
          return 'Please enter a valid phone number';
        }
        return '';
      
      case 'email':
        if (!value.trim()) return 'Email is required';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return 'Please enter a valid email address';
        return '';
      
      default:
        return '';
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name as keyof DeliveryFormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleBlur = (name: keyof DeliveryFormData) => {
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));

    const error = validateField(name, formData[name]);
    if (error) {
      setErrors(prev => ({
        ...prev,
        [name]: error
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    const newErrors: Partial<DeliveryFormData> = {};
    let hasErrors = false;

    (Object.keys(formData) as Array<keyof DeliveryFormData>).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) {
        newErrors[key] = error;
        hasErrors = true;
      }
    });

    if (hasErrors) {
      setErrors(newErrors);
      setTouched({
        name: '',
        phone: '',
        email: ''
      });
      return;
    }

    onSubmit(formData);
  };

  const getFieldError = (name: keyof DeliveryFormData): string | undefined => {
    return touched[name] && errors[name];
  };

  return (
    <form onSubmit={handleSubmit} className="delivery-form-modal">
      <div className="form-grid-modal">
        <div className="form-group">
          <label htmlFor="name" className="form-label">
            <span className="form-icon">👤</span>
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            onBlur={() => handleBlur('name')}
            required
            className={`form-input-modal ${getFieldError('name') ? 'error' : ''}`}
            placeholder="Enter your name"
          />
          {getFieldError('name') && (
            <div className="form-error">{getFieldError('name')}</div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="phone" className="form-label">
            <span className="form-icon">📱</span>
            Phone
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            onBlur={() => handleBlur('phone')}
            required
            className={`form-input-modal ${getFieldError('phone') ? 'error' : ''}`}
            placeholder="+1 (555) 123-4567"
          />
          {getFieldError('phone') && (
            <div className="form-error">{getFieldError('phone')}</div>
          )}
        </div>

        <div className="form-group full-width">
          <label htmlFor="email" className="form-label">
            <span className="form-icon">📧</span>
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={() => handleBlur('email')}
            required
            className={`form-input-modal ${getFieldError('email') ? 'error' : ''}`}
            placeholder="Enter your email"
          />
          {getFieldError('email') && (
            <div className="form-error">{getFieldError('email')}</div>
          )}
        </div>
      </div>

      <div className="form-actions">
        <button
          type="button"
          onClick={onCancel}
          className="btn-secondary"
          disabled={isLoading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn-primary"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="loading-spinner">
              <svg className="spinner-icon" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              </svg>
              Processing...
            </span>
          ) : (
            'Confirm Order'
          )}
        </button>
      </div>
    </form>
  );
}
