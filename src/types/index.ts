export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  ingredients: string[];
  allergens: string[];
  available: boolean;
}

export interface ExtraIngredient {
  id: string;
  name: string;
  price: number;
  available: boolean;
}

export interface Sauce {
  id: string;
  name: string;
  price: number;
  available: boolean;
}

export interface CartItem {
  id: string;
  menuItem: MenuItem;
  quantity: number;
  extraIngredients: ExtraIngredient[];
  sauces: Sauce[];
  specialInstructions?: string;
  totalPrice: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  createdAt: Date;
  estimatedDeliveryTime?: Date;
  deliveryAddress?: string;
  customerName?: string;
  phoneNumber?: string;
  email?: string;
  stripeSessionId?: string;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'cancelled';
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}


