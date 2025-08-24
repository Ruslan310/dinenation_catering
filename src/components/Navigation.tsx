'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import CartBadge from './CartBadge';

export default function Navigation() {
  const pathname = usePathname();

  const navItems = [
    { 
      href: '/', 
      label: 'Menu', 
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M3 6h18v2H3V6zm0 5h18v2H3v-2zm0 5h18v2H3v-2z"/>
        </svg>
      )
    },
    { 
      href: '/cart', 
      label: 'Cart', 
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12L8.1 13h7.45c.75 0 1.41-.41 1.75-1.03L21.7 4H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
        </svg>
      )
    },
    { 
      href: '/orders', 
      label: 'Orders', 
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
        </svg>
      )
    },
  ];

  return (
    <nav className="navigation">
      <div className="nav-content">
        {/* Logo/Brand */}
        <div className="logo">
          <span className="full-logo">DineNation</span>
        </div>
        
        {/* Navigation items */}
        <div className="nav-items">
          {navItems.map((item) => {
            const isActive = pathname === (item.href !== '/' ? `${item.href}/` : item.href);
            const isCart = item.href === '/cart';

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-item ${isActive ? 'active' : ''}`}
              >
                <div className="nav-icon">
                  {item.icon}
                  {isCart && <CartBadge />}
                </div>
                <span className="nav-label">{item.label}</span>
              </Link>
            );
          })}
        </div>
        
         {/*Right side spacer*/}
        <div className="nav-fix"></div>
      </div>
    </nav>
  );
}
