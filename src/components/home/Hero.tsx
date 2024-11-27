import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const slides = [
  {
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1200',
    title: 'Элегантные молдинги',
    description: 'Создайте неповторимый интерьер с нашей коллекцией молдингов',
    width: 1200,
    height: 800
  },
  {
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=1200',
    title: 'Дизайнерские обои',
    description: 'Преобразите ваше пространство с нашими эксклюзивными обоями',
    width: 1200,
    height: 800
  },
  {
    image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&q=80&w=1200',
    title: 'Плинтусы премиум-класса',
    description: 'Безупречное сочетание стиля и функциональности',
    width: 1200,
    height: 800
  }
];

export function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="relative h-[400px] md:h-[600px] w-full overflow-hidden mt-16 px-0">
      <div className="hidden md:flex h-full">
        {slides.map((slide, index) => (
          <motion.div
            key={index}
            className="relative w-1/3 h-full group cursor-pointer overflow-hidden"
            whileHover={{ width: '40%' }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <div className="relative w-full h-full transform transition-transform duration-300 group-hover:scale-110">
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
                width={slide.width}
                height={slide.height}
                loading={index === 0 ? "eager" : "lazy"}
                fetchpriority={index === 0 ? "high" : "low"}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent">
                <div className="flex flex-col items-center justify-end h-full text-white text-center p-6">
                  <h2 className="text-3xl font-bold mb-2 transform transition-all duration-300 group-hover:scale-110">{slide.title}</h2>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Mobile Slides */}
      <div className="md:hidden">
        <div 
          className="absolute w-full h-full transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {slides.map((slide, index) => (
            <div
              key={index}
              className="absolute top-0 left-0 w-full h-full"
              style={{ transform: `translateX(${index * 100}%)` }}
            >
              <div className="relative w-full h-full">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover"
                  width={slide.width}
                  height={slide.height}
                  loading={index === 0 ? "eager" : "lazy"}
                  fetchpriority={index === 0 ? "high" : "low"}
                />
                <div className="absolute inset-0 bg-black bg-opacity-40">
                  <div className="flex flex-col items-center justify-end h-full text-white text-center p-6">
                    <h2 className="text-3xl font-bold mb-4">{slide.title}</h2>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Navigation */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                currentSlide === index ? 'bg-white scale-110' : 'bg-white/50'
              }`}
              aria-label={`Перейти к слайду ${index + 1}`}
            />
          ))}
        </div>

        {/* Navigation Buttons */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-lg hover:bg-white transition-colors"
          aria-label="Предыдущий слайд"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-lg hover:bg-white transition-colors"
          aria-label="Следующий слайд"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
