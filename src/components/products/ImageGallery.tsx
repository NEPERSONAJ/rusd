import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, X, Maximize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ImageGalleryProps {
  images: string[];
  alt: string;
  onClose?: () => void;
  isModal?: boolean;
}

export function ImageGallery({ images, alt, onClose, isModal = false }: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showFullscreen, setShowFullscreen] = useState(false);

  const nextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft') prevImage();
    if (e.key === 'ArrowRight') nextImage();
    if (e.key === 'Escape') {
      if (showFullscreen) setShowFullscreen(false);
      else onClose?.();
    }
  };

  React.useEffect(() => {
    if (isModal) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isModal, showFullscreen]);

  const renderGalleryContent = () => (
    <div className="relative w-full">
      <div className={`relative ${isModal ? 'aspect-video' : 'aspect-[4/3]'} overflow-hidden bg-gray-100`}>
        <img
          src={images[currentIndex]}
          alt={`${alt} - изображение ${currentIndex + 1}`}
          className="w-full h-full object-contain"
        />
        
        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white transition-colors shadow-lg"
              aria-label="Предыдущее изображение"
            >
              <ChevronLeft className="w-6 h-6 text-gray-800" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white transition-colors shadow-lg"
              aria-label="Следующее изображение"
            >
              <ChevronRight className="w-6 h-6 text-gray-800" />
            </button>
          </>
        )}

        {/* Fullscreen Button */}
        {isModal && (
          <button
            onClick={() => setShowFullscreen(true)}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white transition-colors shadow-lg"
            aria-label="Открыть на весь экран"
          >
            <Maximize2 className="w-6 h-6 text-gray-800" />
          </button>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 flex items-center justify-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                currentIndex === index ? 'bg-purple-600 scale-125' : 'bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Перейти к изображению ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );

  return (
    <>
      {renderGalleryContent()}

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {showFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black flex items-center justify-center"
            onClick={() => setShowFullscreen(false)}
          >
            <button
              onClick={() => setShowFullscreen(false)}
              className="absolute top-4 right-4 p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>
            <img
              src={images[currentIndex]}
              alt={alt}
              className="max-w-full max-h-full object-contain"
            />
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                >
                  <ChevronLeft className="w-8 h-8 text-white" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                >
                  <ChevronRight className="w-8 h-8 text-white" />
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}