import React from 'react';
import { motion } from 'framer-motion';
import { Award, Shield, Users, Truck } from 'lucide-react';

const features = [
  {
    icon: Award,
    title: 'Качество',
    description: 'Только премиальные материалы от ведущих производителей'
  },
  {
    icon: Shield,
    title: 'Гарантия',
    description: 'Гарантия на все товары от 2 лет'
  },
  {
    icon: Users,
    title: 'Экспертиза',
    description: 'Профессиональные консультации и поддержка'
  },
  {
    icon: Truck,
    title: 'Доставка',
    description: 'Быстрая доставка по всей России'
  }
];

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">О компании РусДекор</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Мы создаем уникальные интерьеры, предлагая лучшие декоративные решения для вашего дома
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
            >
              <feature.icon className="w-12 h-12 text-purple-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <h2 className="text-3xl font-bold text-gray-900">Наша история</h2>
            <p className="text-gray-600 leading-relaxed">
              РусДекор начал свой путь в 2010 году как небольшая компания, 
              специализирующаяся на продаже декоративных элементов для интерьера. 
              За годы работы мы выросли в одного из ведущих поставщиков премиальных 
              отделочных материалов в России.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Сегодня мы предлагаем широкий ассортимент продукции от лучших 
              производителей, профессиональные консультации и безупречный сервис. 
              Наша миссия - помогать создавать красивые и уютные интерьеры, 
              которые будут радовать вас долгие годы.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative"
          >
            <img
              src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=800"
              alt="О компании РусДекор"
              className="rounded-2xl shadow-xl"
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage; // Убедитесь, что это именно export default
