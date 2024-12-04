import React, { useState } from 'react';
import { Package, Plus, Minus, BrainCircuit, MessageSquare, Share2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../context/CartContext';
import { useAIChat } from '../../context/AIChatContext';
import { useLocation } from 'react-router-dom';
import { ImageGallery } from './ImageGallery';
import toast from 'react-hot-toast';

interface ProductCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  additional_images?: string[];
  processed_image?: string;
  processed_additional_images?: string[];
  specs: string[];
  discount_enabled?: boolean;
  discount_percentage?: number;
  discount_price?: number;
  discount_start_date?: string;
  discount_end_date?: string;
  category_discount_enabled?: boolean;
  category_discount_percentage?: number;
  category_discount_start_date?: string;
  category_discount_end_date?: string;
  is_new?: boolean;
}

export function ProductCard({
  id,
  name,
  description,
  price,
  image,
  additional_images = [],
  processed_image,
  processed_additional_images = [],
  specs = [],
  is_new,
  discount_enabled,
  discount_percentage,
  discount_price,
  discount_start_date,
  discount_end_date,
  category_discount_enabled,
  category_discount_percentage,
  category_discount_start_date,
  category_discount_end_date
}: ProductCardProps) {
  const [quantity, setQuantity] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const { buyViaWhatsApp } = useCart();
  const { openChatWithProduct } = useAIChat();
  const location = useLocation();

  const allImages = [
    processed_image || image,
    ...(processed_additional_images.length ? processed_additional_images : additional_images)
  ];

  const calculateDiscount = (): { isActive: boolean; percentage: number; finalPrice: number } => {
    const now = new Date();
    now.setMilliseconds(0);
    
    if (discount_enabled && discount_start_date && discount_end_date) {
      const startDate = new Date(discount_start_date);
      const endDate = new Date(discount_end_date);
      startDate.setSeconds(0, 0);
      endDate.setSeconds(0, 0);
      
      if (now >= startDate && now <= endDate) {
        if (discount_percentage && discount_percentage > 0) {
          const discountedPrice = price * (1 - discount_percentage / 100);
          return {
            isActive: true,
            percentage: discount_percentage,
            finalPrice: discountedPrice
          };
        }
      }
    }
    
    if (category_discount_enabled && category_discount_start_date && category_discount_end_date) {
      const startDate = new Date(category_discount_start_date);
      const endDate = new Date(category_discount_end_date);
      startDate.setSeconds(0, 0);
      endDate.setSeconds(0, 0);
      
      if (now >= startDate && now <= endDate && category_discount_percentage && category_discount_percentage > 0) {
        const discountedPrice = price * (1 - category_discount_percentage / 100);
        return {
          isActive: true,
          percentage: category_discount_percentage,
          finalPrice: discountedPrice
        };
      }
    }
    
    return {
      isActive: false,
      percentage: 0,
      finalPrice: price
    };
  };

  const { isActive: hasActiveDiscount, percentage: discountPercent, finalPrice } = calculateDiscount();

  const handleWhatsAppClick = () => {
    buyViaWhatsApp({ 
      id, 
      name, 
      description, 
      price: hasActiveDiscount ? finalPrice : price, 
      image 
    }, quantity);
  };

  const handleQuantityChange = (delta: number) => {
    setQuantity(prev => Math.max(1, prev + delta));
  };

  const handleShare = async () => {
    const currentPath = location.pathname;
    const shareUrl = `${window.location.origin}${currentPath}?search=${encodeURIComponent(name)}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: name,
          text: `Посмотрите товар "${name}" на РусДекор`,
          url: shareUrl
        });
      } catch (error) {
        if (error instanceof Error && error.name !== 'AbortError') {
          console.error('Error sharing:', error);
          handleFallbackShare(shareUrl);
        }
      }
    } else {
      handleFallbackShare(shareUrl);
    }
  };

  const handleFallbackShare = (shareUrl: string) => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      toast.success('Ссылка скопирована в буфер обмена');
    }).catch(() => {
      toast.error('Не удалось скопировать ссылку');
    });
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 flex flex-col"
      >
        {/* Product Image */}
        <div 
          className="relative overflow-hidden aspect-[4/3] cursor-pointer"
          onClick={() => setShowModal(true)}
        >
          <img
            src={allImages[0]}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {is_new && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg"
              >
                Новинка
              </motion.div>
            )}
            {hasActiveDiscount && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="bg-gradient-to-r from-red-600 to-pink-600 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg flex items-center gap-1"
              >
                -{discountPercent}%
              </motion.div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="absolute top-3 right-3 flex gap-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.stopPropagation();
                openChatWithProduct({ id, name, description, price: hasActiveDiscount ? finalPrice : price, image, specs });
              }}
              className="bg-white/90 p-2 rounded-full shadow-lg hover:bg-white transition-all"
              aria-label="Спросить у ИИ-ассистента"
            >
              <BrainCircuit className="w-4 h-4 text-purple-600" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.stopPropagation();
                handleShare();
              }}
              className="bg-white/90 p-2 rounded-full shadow-lg hover:bg-white transition-all"
              aria-label="Поделиться"
            >
              <Share2 className="w-4 h-4 text-purple-600" />
            </motion.button>
          </div>
        </div>

        {/* Product Info */}
        <div className="flex-1 p-6 flex flex-col">
          <h3 className="text-xl font-bold text-gray-900 mb-4 text-center line-clamp-2 min-h-[3.5rem]">
            {name}
          </h3>

          <div className="mt-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="text-center">
                {hasActiveDiscount ? (
                  <>
                    <div className="text-gray-500 line-through text-sm">
                      {(price * quantity).toLocaleString('ru-RU')} ₽
                    </div>
                    <div className="text-xl font-bold text-red-600">
                      {(finalPrice * quantity).toLocaleString('ru-RU')} ₽
                    </div>
                  </>
                ) : (
                  <div className="text-xl font-bold text-gray-900">
                    {(price * quantity).toLocaleString('ru-RU')} ₽
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-xl">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleQuantityChange(-1)}
                  className="p-2 rounded-full bg-white shadow-sm hover:shadow-md transition-shadow"
                  aria-label="Уменьшить количество"
                >
                  <Minus className="w-4 h-4" />
                </motion.button>
                <span className="text-lg font-semibold min-w-[2ch] text-center">
                  {quantity}
                </span>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleQuantityChange(1)}
                  className="p-2 rounded-full bg-white shadow-sm hover:shadow-md transition-shadow"
                  aria-label="Увеличить количество"
                >
                  <Plus className="w-4 h-4" />
                </motion.button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowModal(true)}
                className="flex-1 py-3 px-4 rounded-xl bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-colors"
              >
                Подробнее
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleWhatsAppClick}
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-4 rounded-xl font-medium flex items-center justify-center gap-2 hover:shadow-lg transition-all"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Заказать</span>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Product Details Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative"
              onClick={e => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between z-10">
                <h3 className="text-xl font-bold text-gray-900">{name}</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6">
                {/* Image Gallery */}
                <div className="mb-6 max-w-2xl mx-auto">
                  <ImageGallery
                    images={allImages}
                    alt={name}
                    isModal
                  />
                </div>

                {/* Product Details */}
                <div className="max-w-2xl mx-auto space-y-6">
                  <div className="text-center">
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Описание</h4>
                    <p className="text-gray-600 leading-relaxed">{description}</p>
                  </div>

                  {specs && specs.length > 0 && (
                    <div className="bg-gray-50 rounded-xl p-6 text-center">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">Характеристики</h4>
                      <div className="inline-grid gap-4">
                        {specs.map((spec, index) => (
                          <div key={index} className="flex items-center text-gray-600">
                            <Package className="w-5 h-5 text-purple-500 mr-3 flex-shrink-0" />
                            <span>{spec}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Price and Actions */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div className="text-center">
                        <h4 className="text-lg font-semibold text-gray-900 mb-1">Стоимость</h4>
                        {hasActiveDiscount ? (
                          <div>
                            <span className="text-gray-500 line-through text-lg">
                              {(price * quantity).toLocaleString('ru-RU')} ₽
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="text-2xl font-bold text-red-600">
                                {(finalPrice * quantity).toLocaleString('ru-RU')} ₽
                              </span>
                              <span className="bg-red-100 text-red-600 text-sm px-2 py-0.5 rounded-full">
                                -{discountPercent}%
                              </span>
                            </div>
                          </div>
                        ) : (
                          <span className="text-2xl font-bold text-gray-900">
                            {(price * quantity).toLocaleString('ru-RU')} ₽
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-4">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleQuantityChange(-1)}
                          className="p-2 rounded-full bg-white shadow-sm hover:shadow-md transition-shadow"
                        >
                          <Minus className="w-5 h-5" />
                        </motion.button>
                        <span className="text-xl font-semibold min-w-[2ch] text-center">
                          {quantity}
                        </span>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleQuantityChange(1)}
                          className="p-2 rounded-full bg-white shadow-sm hover:shadow-md transition-shadow"
                        >
                          <Plus className="w-5 h-5" />
                        </motion.button>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => openChatWithProduct({
                          id,
                          name,
                          description,
                          price: hasActiveDiscount ? finalPrice : price,
                          image,
                          specs
                        })}
                        className="flex-1 py-3 px-4 rounded-xl bg-purple-100 text-purple-700 font-medium hover:bg-purple-200 transition-colors flex items-center justify-center gap-2"
                      >
                        <BrainCircuit className="w-5 h-5" />
                        <span>Спросить у ИИ</span>
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleWhatsAppClick}
                        className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-4 rounded-xl font-medium flex items-center justify-center gap-2 hover:shadow-lg transition-all"
                      >
                        <MessageSquare className="w-5 h-5" />
                        <span>Заказать</span>
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
