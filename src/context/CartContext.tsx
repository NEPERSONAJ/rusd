import React, { createContext, useContext, useState } from 'react';
import { Product } from '../types';
import { useSettings } from '../hooks/useSettings';
import { analyticsService } from '../lib/services/analyticsService';

interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity: number) => void;
  buyViaWhatsApp: (product: Product, quantity: number) => Promise<void>;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const { settings } = useSettings();

  const formatWhatsAppMessage = (product: Product, quantity: number) => {
    const productUrl = window.location.href;
    return encodeURIComponent(
      `Здравствуйте! Хочу заказать:\n\n` +
      `Товар: ${product.name}\n` +
      `Количество: ${quantity}\n` +
      `Цена за единицу: ${product.price} ₽\n` +
      `Общая сумма: ${product.price * quantity} ₽\n\n` +
      `Описание: ${product.description}\n` +
      `Ссылка на товар: ${productUrl}\n` +
      `Фото товара: ${product.image}`
    );
  };

  const buyViaWhatsApp = async (product: Product, quantity: number) => {
    try {
      // First track the click
      await analyticsService.trackWhatsAppClick(product.id);
      
      const message = formatWhatsAppMessage(product, quantity);
      const phoneNumber = settings.whatsapp_number?.replace(/\D/g, '') || '';
      
      // Check if it's a mobile device
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      
      // Create the appropriate WhatsApp URL
      const whatsappUrl = isMobile
        ? `whatsapp://send?phone=${phoneNumber}&text=${message}`
        : `https://wa.me/${phoneNumber}?text=${message}`;

      // Try to open WhatsApp
      const newWindow = window.open(whatsappUrl, '_blank');
      
      // If opening failed (especially on mobile), try direct location change
      if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
        window.location.href = whatsappUrl;
      }
    } catch (error) {
      console.error('Error in buyViaWhatsApp:', error);
      // Even if tracking fails, still try to open WhatsApp
      const message = formatWhatsAppMessage(product, quantity);
      const phoneNumber = settings.whatsapp_number?.replace(/\D/g, '') || '';
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      const whatsappUrl = isMobile
        ? `whatsapp://send?phone=${phoneNumber}&text=${message}`
        : `https://wa.me/${phoneNumber}?text=${message}`;
      window.location.href = whatsappUrl;
    }
  };

  const addToCart = (product: Product, quantity: number) => {
    setItems(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      if (existingItem) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
  };

  const clearCart = () => {
    setItems([]);
  };

  return (
    <CartContext.Provider value={{ items, addToCart, buyViaWhatsApp, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
