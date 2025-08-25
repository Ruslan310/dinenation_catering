'use client';

import React, { createContext, useContext, useEffect, useReducer } from 'react';
import { CartItem, Order } from '../types';

interface AppState {
  cart: CartItem[];
  orders: Order[];
  totalCartAmount: number;
}

type AppAction =
  | { type: 'ADD_TO_CART'; payload: CartItem }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'UPDATE_CART_ITEM'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'ADD_ORDER'; payload: Order }
  | { type: 'UPDATE_ORDER_STATUS'; payload: { orderId: string; status: Order['status'] } }
  | { type: 'UPDATE_ORDER_PAYMENT_STATUS'; payload: { orderId: string; paymentStatus: Order['paymentStatus']; stripeSessionId?: string } }
  | { type: 'LOAD_STATE'; payload: { cart: CartItem[]; orders: Order[] } };

const initialState: AppState = {
  cart: [],
  orders: [],
  totalCartAmount: 0,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'ADD_TO_CART': {
      // Проверяем, есть ли уже такой товар с теми же дополнительными ингредиентами и соусами
      const existingItemIndex = state.cart.findIndex(item => {
        // Сравниваем базовый товар
        if (item.menuItem.id !== action.payload.menuItem.id) return false;
        
        // Сравниваем дополнительные ингредиенты
        if (item.extraIngredients.length !== action.payload.extraIngredients.length) return false;
        const extrasMatch = item.extraIngredients.every(extra => 
          action.payload.extraIngredients.find(payloadExtra => payloadExtra.id === extra.id)
        );
        if (!extrasMatch) return false;
        
        // Сравниваем соусы
        if (item.sauces.length !== action.payload.sauces.length) return false;
        const saucesMatch = item.sauces.every(sauce => 
          action.payload.sauces.find(payloadSauce => payloadSauce.id === sauce.id)
        );
        if (!saucesMatch) return false;
        
        return true;
      });
      
      let newCart;
      
      if (existingItemIndex >= 0) {
        newCart = [...state.cart];
        newCart[existingItemIndex].quantity += action.payload.quantity;
        // Пересчитываем общую цену с учетом дополнительных ингредиентов и соусов
        const basePrice = action.payload.menuItem.price;
        const extrasPrice = action.payload.extraIngredients.reduce((sum, extra) => sum + extra.price, 0);
        const saucesPrice = action.payload.sauces.reduce((sum, sauce) => sum + sauce.price, 0);
        const itemTotalPrice = (basePrice + extrasPrice + saucesPrice) * newCart[existingItemIndex].quantity;
        newCart[existingItemIndex].totalPrice = itemTotalPrice;
      } else {
        newCart = [...state.cart, action.payload];
      }
      
      const totalAmount = newCart.reduce((sum, item) => sum + item.totalPrice, 0);
      
      return {
        ...state,
        cart: newCart,
        totalCartAmount: totalAmount,
      };
    }
    
    case 'REMOVE_FROM_CART': {
      const newCart = state.cart.filter(item => item.id !== action.payload);
      const totalAmount = newCart.reduce((sum, item) => sum + item.totalPrice, 0);
      
      return {
        ...state,
        cart: newCart,
        totalCartAmount: totalAmount,
      };
    }
    
    case 'UPDATE_CART_ITEM': {
      const newCart = state.cart.map(item => {
        if (item.id === action.payload.id) {
          // Пересчитываем общую цену с учетом дополнительных ингредиентов и соусов
          const basePrice = item.menuItem.price;
          const extrasPrice = item.extraIngredients.reduce((sum, extra) => sum + extra.price, 0);
          const saucesPrice = item.sauces.reduce((sum, sauce) => sum + sauce.price, 0);
          const itemTotalPrice = (basePrice + extrasPrice + saucesPrice) * action.payload.quantity;
          
          return { 
            ...item, 
            quantity: action.payload.quantity, 
            totalPrice: itemTotalPrice 
          };
        }
        return item;
      });
      const totalAmount = newCart.reduce((sum, item) => sum + item.totalPrice, 0);
      
      return {
        ...state,
        cart: newCart,
        totalCartAmount: totalAmount,
      };
    }
    
    case 'CLEAR_CART':
      return {
        ...state,
        cart: [],
        totalCartAmount: 0,
      };
    
    case 'ADD_ORDER': {
      const newOrders = [action.payload, ...state.orders];
      return {
        ...state,
        orders: newOrders,
      };
    }
    
    case 'UPDATE_ORDER_STATUS': {
      const newOrders = state.orders.map(order =>
        order.id === action.payload.orderId
          ? { ...order, status: action.payload.status }
          : order
      );
      return {
        ...state,
        orders: newOrders,
      };
    }
    
    case 'UPDATE_ORDER_PAYMENT_STATUS': {
      const newOrders = state.orders.map(order =>
        order.id === action.payload.orderId
          ? { 
              ...order, 
              paymentStatus: action.payload.paymentStatus,
              stripeSessionId: action.payload.stripeSessionId || order.stripeSessionId,
              status: action.payload.paymentStatus === 'paid' ? 'processing' : order.status
            }
          : order
      );
      return {
        ...state,
        orders: newOrders,
      };
    }
    
    case 'LOAD_STATE':
      const totalAmount = action.payload.cart.reduce((sum, item) => sum + item.totalPrice, 0);
      return {
        ...state,
        cart: action.payload.cart,
        orders: action.payload.orders,
        totalCartAmount: totalAmount,
      };
    
    default:
      return state;
  }
}

interface AppContextType {
  state: AppState;
  cartItemsCount: number;
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateCartItem: (id: string, quantity: number) => void;
  clearCart: () => void;
  addOrder: (order: Order) => Promise<void>;
  createPendingOrder: (orderData: {
    items: CartItem[];
    totalAmount: number;
    customerName: string;
    phoneNumber: string;
    email: string;
  }) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  updateOrderPaymentStatus: (orderId: string, paymentStatus: Order['paymentStatus'], stripeSessionId?: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Загрузка состояния при запуске
  useEffect(() => {
    loadState();
  }, []);

  useEffect(() => {
    saveState();
  }, [state.cart, state.orders]);

  const loadState = () => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const cartData = localStorage.getItem('cart');
        const ordersData = localStorage.getItem('orders');
        
        console.log('Loading state from localStorage:', { cartData, ordersData });
        
        if (cartData || ordersData) {
          // Преобразуем строки дат обратно в объекты Date
          const parsedCart = cartData ? JSON.parse(cartData) : [];
          const parsedOrders = ordersData ? JSON.parse(ordersData) : [];
          
          console.log('Parsed data:', { parsedCart, parsedOrders });
          
          // Преобразуем даты в заказах и добавляем недостающие поля
          const ordersWithDates = parsedOrders.map((order: Order) => ({
            ...order,
            createdAt: new Date(order.createdAt),
            estimatedDeliveryTime: order.estimatedDeliveryTime ? new Date(order.estimatedDeliveryTime) : undefined,
            // Добавляем paymentStatus если его нет
            paymentStatus: order.paymentStatus || 'pending',
            // Добавляем email если его нет
            email: order.email || '',
          }));
          
          console.log('Orders with dates:', ordersWithDates);
          
          dispatch({
            type: 'LOAD_STATE',
            payload: {
              cart: parsedCart,
              orders: ordersWithDates,
            },
          });
        }
      }
    } catch (error) {
      console.error('Error loading state:', error);
    }
  };

  const saveState = () => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        console.log('Saving state to localStorage:', { cart: state.cart, orders: state.orders });
        localStorage.setItem('cart', JSON.stringify(state.cart));
        localStorage.setItem('orders', JSON.stringify(state.orders));
      }
    } catch (error) {
      console.error('Error saving state:', error);
    }
  };

  const addToCart = (item: CartItem) => {
    dispatch({ type: 'ADD_TO_CART', payload: item });
  };

  const removeFromCart = (id: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: id });
  };

  const updateCartItem = (id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_CART_ITEM', payload: { id, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const addOrder = async (order: Order) => {
    // Генерируем номер заказа в формате 001, 002, 003...
    const orderNumber = String(state.orders.length + 1).padStart(3, '0');
    const orderWithNumber = {
      ...order,
      id: `order-${orderNumber}`,
      paymentStatus: 'pending' as const,
    };
    
    dispatch({ type: 'ADD_ORDER', payload: orderWithNumber });
    dispatch({ type: 'CLEAR_CART' });
  };

  // Функция для создания заказа с ожиданием оплаты
  const createPendingOrder = async (orderData: {
    items: CartItem[];
    totalAmount: number;
    customerName: string;
    phoneNumber: string;
    email: string;
  }) => {
    const orderNumber = String(state.orders.length + 1).padStart(3, '0');
    const order: Order = {
      id: `order-${orderNumber}`,
      items: orderData.items,
      totalAmount: orderData.totalAmount,
      status: 'pending',
      paymentStatus: 'pending',
      createdAt: new Date(),
      customerName: orderData.customerName,
      phoneNumber: orderData.phoneNumber,
      email: orderData.email,
    };
    
    console.log('Creating pending order:', order);
    console.log('Current orders count:', state.orders.length);
    console.log('Generated order ID:', order.id);
    
    dispatch({ type: 'ADD_ORDER', payload: order });
    dispatch({ type: 'CLEAR_CART' });
    
    console.log('Order dispatched, returning:', order);
    return order;
  };

  // Функция для обновления статуса оплаты заказа
  const updateOrderPaymentStatus = (orderId: string, paymentStatus: Order['paymentStatus'], stripeSessionId?: string) => {
    dispatch({ type: 'UPDATE_ORDER_PAYMENT_STATUS', payload: { orderId, paymentStatus, stripeSessionId } });
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    dispatch({ type: 'UPDATE_ORDER_STATUS', payload: { orderId, status } });
  };

  const value: AppContextType = {
    state,
    cartItemsCount: state.cart.reduce((sum, item) => sum + item.quantity, 0),
    addToCart,
    removeFromCart,
    updateCartItem,
    clearCart,
    addOrder,
    createPendingOrder,
    updateOrderStatus,
    updateOrderPaymentStatus,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    console.warn('useApp called outside of AppProvider');
    return null;
  }
  return context;
}
