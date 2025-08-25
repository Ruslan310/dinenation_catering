'use client';

import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface DeliveryFormProps {
    onCancel: () => void;
    isLoading?: boolean;
    totalAmount: number;
    cartItems?: any[];
    onCreateOrder?: (order: any) => void;
}

export interface DeliveryFormData {
    name: string;
    phone: string;
    email: string;
}

export default function DeliveryForm({ onCancel, isLoading = false, totalAmount, cartItems = [], onCreateOrder }: DeliveryFormProps) {
    const [formData, setFormData] = useState<DeliveryFormData>({
        name: '',
        phone: '',
        email: ''
    });

    const [errors, setErrors] = useState<Partial<DeliveryFormData>>({});
    const [touched, setTouched] = useState<Record<keyof DeliveryFormData, boolean>>({
        name: false,
        phone: false,
        email: false,
    });
    const [processing, setProcessing] = useState(false);

    // --- Validation rules ---
    const validateField = (name: keyof DeliveryFormData, value: string): string => {
        switch (name) {
            case 'name':
                if (!value.trim()) return 'Name is required';
                if (value.trim().length < 2) return 'Name must be at least 2 characters';
                return '';
            case 'phone':
                if (!value.trim()) return 'Phone is required';
                const phoneRegex = /^[\+]?[1-9][\d]{5,15}$/;
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

    // --- Handlers ---
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (errors[name as keyof DeliveryFormData]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleBlur = (name: keyof DeliveryFormData) => {
        setTouched(prev => ({ ...prev, [name]: true }));
        const error = validateField(name, formData[name]);
        setErrors(prev => ({ ...prev, [name]: error }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate all
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
            setTouched({ name: true, phone: true, email: true });
            return;
        }

        setProcessing(true);

        try {
            console.log('Starting payment process...');
            console.log('Form data:', formData);
            console.log('Cart items:', cartItems);
            console.log('Total amount:', totalAmount);

            const stripe = await stripePromise;
            if (!stripe) throw new Error('Stripe failed to load');
            
            console.log('Stripe loaded successfully');

            // Создаем заказ с ожиданием оплаты
            const orderData = {
                items: cartItems,
                totalAmount,
                customerName: formData.name,
                phoneNumber: formData.phone,
                email: formData.email,
            };

            // Вызываем callback для создания заказа
            if (onCreateOrder) {
                const order = await onCreateOrder(orderData);
                console.log('Order created:', order);

                const requestBody = { 
                    ...formData, 
                    totalAmount, 
                    items: cartItems,
                    orderId: order.id 
                };
                console.log('Request body:', requestBody);

                const res = await fetch('/api/checkout', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(requestBody),
                });

                const data = await res.json();
                
                if (!res.ok) {
                    throw new Error(data.error || `HTTP error! status: ${res.status}`);
                }
                
                if (data.url) {
                    // Небольшая задержка для сохранения заказа в localStorage
                    setTimeout(() => {
                        window.location.href = data.url;
                    }, 100);
                } else {
                    console.error('Stripe session error:', data);
                    throw new Error('No checkout URL received from Stripe');
                }
            } else {
                throw new Error('Order creation callback not provided');
            }
        } catch (error) {
            console.error('Payment error:', error);
            
            // Показываем пользователю ошибку
            alert(`Payment error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            setProcessing(false);
        }
    };

    // --- Helper for error messages ---
    const getFieldError = (name: keyof DeliveryFormData): string | undefined => {
        return touched[name] ? errors[name] || undefined : undefined;
    };

    // --- Render ---
    return (
        <form onSubmit={handleSubmit} className="delivery-form-modal">
            <div className="form-grid-modal">
                {/* Name */}
                <div className="form-group">
                    <label htmlFor="name" className="form-label">👤 Name</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        onBlur={() => handleBlur('name')}
                        className={`form-input-modal ${getFieldError('name') ? 'error' : ''}`}
                        placeholder="Enter your name"
                    />
                    {getFieldError('name') && <div className="form-error">{getFieldError('name')}</div>}
                </div>

                {/* Phone */}
                <div className="form-group">
                    <label htmlFor="phone" className="form-label">📱 Phone</label>
                    <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        onBlur={() => handleBlur('phone')}
                        className={`form-input-modal ${getFieldError('phone') ? 'error' : ''}`}
                        placeholder="+357 99 123456"
                    />
                    {getFieldError('phone') && <div className="form-error">{getFieldError('phone')}</div>}
                </div>

                {/* Email */}
                <div className="form-group full-width">
                    <label htmlFor="email" className="form-label">📧 Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        onBlur={() => handleBlur('email')}
                        className={`form-input-modal ${getFieldError('email') ? 'error' : ''}`}
                        placeholder="Enter your email"
                    />
                    {getFieldError('email') && <div className="form-error">{getFieldError('email')}</div>}
                </div>
            </div>

            <div className="form-actions">
                <button
                    type="button"
                    onClick={onCancel}
                    className="btn-secondary"
                    disabled={processing || isLoading}
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="btn-primary"
                    disabled={processing || isLoading}
                >
                    {processing ? 'Redirecting...' : 'Confirm & Pay'}
                </button>
            </div>
        </form>
    );
}
