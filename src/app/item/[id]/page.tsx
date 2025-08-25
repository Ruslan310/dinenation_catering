'use client';

import { useContext, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { menuItems, extraIngredients, sauces } from '@/data/menuData';
import { MenuItem, ExtraIngredient, Sauce, CartItem } from '@/types';
import { useApp } from '@/contexts/AppContext';
import ImageWithFallback from '../../../components/ImageWithFallback';

export default function ItemDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const appContext = useApp();

  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [selectedExtras, setSelectedExtras] = useState<ExtraIngredient[]>([]);
  const [selectedSauces, setSelectedSauces] = useState<Sauce[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [specialInstructions, setSpecialInstructions] = useState('');

  useEffect(() => {
    const item = menuItems.find(i => String(i.id) === String(id));
    if (item) setSelectedItem(item);
  }, [id]);

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

  const { addToCart } = appContext;

  if (!selectedItem) {
    return (
      <div className="empty-state">
        <div className="empty-content">
          <div style={{ fontSize: '1.5rem', color: '#6b7280', fontWeight: '500' }}>Item not found</div>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    const totalPrice = selectedItem.price +
      selectedExtras.reduce((sum, extra) => sum + extra.price, 0) +
      selectedSauces.reduce((sum, sauce) => sum + sauce.price, 0);

    const cartItem: CartItem = {
      id: `${selectedItem.id}-${Date.now()}`,
      menuItem: selectedItem,
      quantity,
      extraIngredients: selectedExtras,
      sauces: selectedSauces,
      specialInstructions: specialInstructions.trim() || undefined,
      totalPrice: totalPrice * quantity,
    };

    addToCart(cartItem);

    if (confirm('Item added to cart! Go to cart?')) {
      router.push('/cart');
    } else {
      router.back();
    }
  };

  const toggleExtra = (extra: ExtraIngredient) => {
    if (selectedExtras.find(e => e.id === extra.id)) {
      setSelectedExtras(selectedExtras.filter(e => e.id !== extra.id));
    } else {
      setSelectedExtras([...selectedExtras, extra]);
    }
  };

  const toggleSauce = (sauce: Sauce) => {
    if (selectedSauces.find(s => s.id === sauce.id)) {
      setSelectedSauces(selectedSauces.filter(s => s.id !== sauce.id));
    } else {
      setSelectedSauces([...selectedSauces, sauce]);
    }
  };

  const totalPrice = selectedItem.price +
    selectedExtras.reduce((sum, extra) => sum + extra.price, 0) +
    selectedSauces.reduce((sum, sauce) => sum + sauce.price, 0);

  return (
    <div className="item-detail-page">
      {/* Header with back button */}
      <div className="item-header">
        <div className="header-container">
          <button
            onClick={() => router.back()}
            className="back-button"
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#f3f4f6',
              color: '#374151',
              border: '1px solid #d1d5db',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              marginBottom: '1rem'
            }}
          >
            <svg className="back-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Menu
          </button>
        </div>
      </div>

      <div style={{ paddingBottom: '8rem' }}>
        {/* Item Image */}
        <div className="item-image-section">
          <ImageWithFallback
            src={selectedItem.image}
            alt={selectedItem.name}
            fill
            className="item-image"
          />
          <div className="image-overlay"></div>
        </div>

        {/* Content */}
        <div className="item-content-section">
          <div className="content-container">
            {/* Header */}
            <div className="item-header-section">
              <h1 className="item-title">
                {selectedItem.name}
              </h1>
              <p className="item-description">
                {selectedItem.description}
              </p>
              <div>
                <span className="item-price">
                  €{selectedItem.price}
                </span>
              </div>
            </div>

            {/* Ingredients */}
            <div className="item-section">
              <h3 className="section-title ingredients">
                <span className="section-icon">🥘</span>
                Ingredients
              </h3>
              <div className="ingredients-grid">
                {selectedItem.ingredients.map((ingredient, index) => (
                  <div key={index} className="ingredient-item">
                    <span className="ingredient-bullet">•</span>
                    <span className="ingredient-name">{ingredient}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Allergens */}
            {selectedItem.allergens.length > 0 && (
              <div className="item-section">
                <h3 className="section-title allergens">
                  <span className="section-icon">⚠️</span>
                  Allergens
                </h3>
                <div className="allergens-list">
                  {selectedItem.allergens.map((allergen, index) => (
                    <span key={index} className="allergen-tag">
                      {allergen}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Extra Ingredients */}
            <div className="item-section">
              <h3 className="section-title extras">
                <span className="section-icon">➕</span>
                Additional Ingredients
              </h3>
              <div className="options-grid">
                {extraIngredients.map((extra) => (
                  <button
                    key={extra.id}
                    onClick={() => toggleExtra(extra)}
                    className={`option-button ${selectedExtras.find(e => e.id === extra.id) ? 'selected' : ''}`}
                  >
                    <div className="option-name">{extra.name}</div>
                    <div className="option-price">+€{extra.price}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Sauces */}
            <div className="item-section">
              <h3 className="section-title sauces">
                <span className="section-icon">🥫</span>
                Sauces
              </h3>
              <div className="options-grid">
                {sauces.map((sauce) => (
                  <button
                    key={sauce.id}
                    onClick={() => toggleSauce(sauce)}
                    className={`option-button ${selectedSauces.find(s => s.id === sauce.id) ? 'selected' : ''}`}
                  >
                    <div className="option-name">{sauce.name}</div>
                    <div className="option-price">+€{sauce.price}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="item-section">
              <h3 className="section-title quantity">
                <span className="section-icon">🔢</span>
                Quantity
              </h3>
              <div className="quantity-controls">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="quantity-btn"
                >
                  <span>-</span>
                </button>
                <span className="quantity-display">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="quantity-btn"
                >
                  <span>+</span>
                </button>
              </div>
            </div>

            {/* Special Instructions */}
            <div className="item-section">
              <h3 className="section-title instructions">
                <span className="section-icon">✍️</span>
                Special Requests
              </h3>
              <p className="instructions-note">
                Please indicate any special cooking requests (optional)
              </p>
              <textarea
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                placeholder="Enter special instructions..."
                className="instructions-textarea"
                rows={3}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bottom-bar">
        <div className="bar-container">
          <div className="bar-content">
            <div className="total-info">
              <div className="total-label">Total:</div>
              <div className="total-amount">
                €{(totalPrice * quantity).toFixed(2)}
              </div>
            </div>
            <button
              onClick={handleAddToCart}
              className="add-to-cart-btn"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
