'use client';

import { useState } from 'react';
import { categories, menuItems } from '@/data/menuData';
import { MenuItem } from '@/types';
import { useApp } from '@/contexts/AppContext';
import Link from 'next/link';
import ImageWithFallback from '../components/ImageWithFallback';

export default function MenuPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const appContext = useApp();

  if (!appContext) {
    return (
      <div className="main-content">
        <div className="container text-center">
          <div style={{ animation: 'spin 1s linear infinite', borderRadius: '50%', height: '3rem', width: '3rem', border: '2px solid #3b82f6', borderTopColor: 'transparent', margin: '0 auto 1rem' }}></div>
          <div style={{ fontSize: '1.5rem', color: '#6b7280', fontWeight: '500' }}>Loading app...</div>
        </div>
      </div>
    );
  }

  const { addToCart } = appContext;

  const filteredItems = selectedCategory === 'All' 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory);

  const handleAddToCart = (item: MenuItem) => {
    const cartItem = {
      id: `${item.id}-${Date.now()}`,
      menuItem: item,
      quantity: 1,
      extraIngredients: [],
      sauces: [],
      totalPrice: item.price,
    };
    addToCart(cartItem);
  };

  return (
    <div className="main-content">
      {/* Hero Header */}
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Discover Amazing
            <span className="gradient-text">Food Delights</span>
          </h1>
          <p className="hero-subtitle">
            Choose from our carefully curated menu featuring the finest ingredients and authentic flavors
          </p>
        </div>
      </div>

      {/* Categories */}
      <div className="categories-section">
        <div className="container">
          <h2 className="section-title">
            Explore Categories
          </h2>
          
          <div className="categories-grid">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`category-button ${selectedCategory === 'All' ? 'active' : ''}`}
            >
              <div className="category-icon">
                <span>🍽️</span>
              </div>
              <span className="category-name">All</span>
            </button>
            
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.name)}
                className={`category-button ${selectedCategory === category.name ? 'active' : ''}`}
              >
                <div className="category-icon">
                  <span>{category.icon}</span>
                </div>
                <span className="category-name">{category.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="menu-section">
        <div className="container">
          <h2 className="section-title">
            {selectedCategory === 'All' ? 'All Dishes' : `${selectedCategory} Collection`}
          </h2>
          
          <div className="menu-grid">
            {filteredItems.map((item) => (
              <div key={item.id} className="menu-item">
                <div className="item-image">
                  <ImageWithFallback
                    src={item.image}
                    alt={item.name}
                    fill
                  />
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="add-button"
                  >
                    +
                  </button>
                  <div className="price-tag">
                    €{item.price}
                  </div>
                </div>
                
                <div className="item-content">
                  <h3 className="item-title">
                    {item.name}
                  </h3>
                  <p className="item-description">
                    {item.description}
                  </p>
                  
                  <div className="item-actions">
                    <Link
                      href={`/item/${item.id}`}
                      className="view-details"
                    >
                      View Details
                    </Link>
                    
                    <div>
                      <span className="item-category">{item.category}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
