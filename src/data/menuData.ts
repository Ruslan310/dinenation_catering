import { MenuItem, ExtraIngredient, Sauce, Category } from '../types';

export const categories: Category[] = [
  { id: '1', name: 'Pizza', icon: '🍕' },
  { id: '2', name: 'Burgers', icon: '🍔' },
  { id: '3', name: 'Sushi', icon: '🍣' },
  { id: '4', name: 'Drinks', icon: '🥤' },
  { id: '5', name: 'Desserts', icon: '🍰' },
];

export const extraIngredients: ExtraIngredient[] = [
  { id: '1', name: 'Mozzarella Cheese', price: 5, available: true },
  { id: '2', name: 'Pepperoni', price: 8, available: true },
  { id: '3', name: 'Mushrooms', price: 6, available: true },
  { id: '4', name: 'Olives', price: 4, available: true },
  { id: '5', name: 'Bacon', price: 10, available: true },
  { id: '6', name: 'Chicken', price: 9, available: true },
];

export const sauces: Sauce[] = [
  { id: '1', name: 'Tomato Sauce', price: 3, available: true },
  { id: '2', name: 'Cheese Sauce', price: 4, available: true },
  { id: '3', name: 'Garlic Sauce', price: 3.5, available: true },
  { id: '4', name: 'Spicy Sauce', price: 2.5, available: true },
  { id: '5', name: 'BBQ Sauce', price: 3.5, available: true },
];

export const menuItems: MenuItem[] = [
  {
    id: '1',
    name: 'Margherita',
    description: 'Classic pizza with tomato sauce, mozzarella and basil',
    price: 12.99,
    image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400',
    category: 'Pizza',
    ingredients: ['Tomato Sauce', 'Mozzarella', 'Basil', 'Dough'],
    allergens: ['Gluten', 'Dairy'],
    available: true,
  },
  {
    id: '2',
    name: 'Pepperoni',
    description: 'Spicy pizza with pepperoni, mozzarella and tomato sauce',
    price: 14.99,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400',
    category: 'Pizza',
    ingredients: ['Tomato Sauce', 'Mozzarella', 'Pepperoni', 'Dough'],
    allergens: ['Gluten', 'Dairy'],
    available: true,
  },
  {
    id: '3',
    name: 'Cheeseburger',
    description: 'Juicy burger with beef patty, cheese and vegetables',
    price: 8.99,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
    category: 'Burgers',
    ingredients: ['Bun', 'Beef Patty', 'Cheese', 'Lettuce', 'Tomato', 'Onion'],
    allergens: ['Gluten', 'Dairy'],
    available: true,
  },
  {
    id: '4',
    name: 'Philadelphia Roll',
    description: 'Roll with salmon, cream cheese and cucumber',
    price: 16.99,
    image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400',
    category: 'Sushi',
    ingredients: ['Rice', 'Salmon', 'Cream Cheese', 'Cucumber', 'Nori'],
    allergens: ['Fish', 'Dairy'],
    available: true,
  },
  {
    id: '5',
    name: 'Coca-Cola',
    description: 'Refreshing carbonated drink',
    price: 2.99,
    image: 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=400',
    category: 'Drinks',
    ingredients: ['Water', 'Sugar', 'Carbon Dioxide', 'Caramel', 'Caffeine'],
    allergens: [],
    available: true,
  },
  {
    id: '6',
    name: 'Tiramisu',
    description: 'Italian dessert with coffee and mascarpone',
    price: 6.99,
    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400',
    category: 'Desserts',
    ingredients: ['Savoiardi Cookies', 'Mascarpone', 'Coffee', 'Cocoa', 'Eggs'],
    allergens: ['Gluten', 'Dairy', 'Eggs'],
    available: true,
  },
];


