'use client';

import { useApp } from '../contexts/AppContext';

export default function CartBadge() {
  const appContext = useApp();
  
  if (!appContext) return null;
  
  const { cartItemsCount } = appContext;
  
  if (cartItemsCount === 0) return null;
  
  return (
    <div className="cart-badge" suppressHydrationWarning>
      {cartItemsCount > 99 ? '99+' : cartItemsCount}
    </div>
  );
}
