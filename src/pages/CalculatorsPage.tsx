import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calculator, Ruler, Box, Wallpaper, Scissors, Grid, Square, Brush } from 'lucide-react';
import { SEO } from '../components/SEO';

const calculators = [
  {
    id: 'wallpaper',
    title: 'Калькулятор обоев',
    description: 'Рассчитайте необходимое количество рулонов обоев для вашей комнаты',
    icon: Wallpaper,
    path: '/calculators/wallpaper',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'molding',
    title: 'Калькулятор молдингов',
    description: 'Определите количество молдингов и углов для вашего помещения',
    icon: Ruler,
    path: '/calculators/molding',
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 'plinth',
    title: 'Калькулятор плинтусов',
    description: 'Рассчитайте необходимую длину и количество плинтусов',
    icon: Box,
    path: '/calculators/plinth',
    color: 'from-amber-500 to-orange-500'
  },
  {
    id: 'marble',
    title: 'Калькулятор гибкого мрамора',
    description: 'Рассчитайте необходимое количество гибкого мрамора для отделки',
    icon: Square,
    path: '/calculators/marble',
    color: 'from-emerald-500 to-teal-500'
  },
  {
    id: 'corners',
    title: 'Калькулятор уголков',
    description: 'Определите необходимое количество уголков для вашего проекта',
    icon: Box,
    path: '/calculators/corners',
    color: 'from-red-500 to-pink-500'
  },
  {
    id: 'panels',
    title: 'Калькулятор реечных панелей',
    description: 'Рассчитайте количество реечных панелей для вашего помещения',
    icon: Grid,
    path: '/calculators/panels',
    color: 'from-indigo-500 to-purple-500'
  },
  {
    id: 'film',
    title: 'Калькулятор самоклеющейся пленки',
    description: 'Рассчитайте необходимое количество пленки для оклейки',
    icon: Scissors,
    path: '/calculators/film',
    color: 'from-yellow-500 to-amber-500'
  },
  {
    id: 'glue',
    title: 'Калькулятор расхода клея',
    description: 'Определите необходимое количество клея для монтажа',
    icon: Brush,
    path: '/calculators/glue',
    color: 'from-gray-600 to-gray-800'
  }
];

export default function CalculatorsPage() {
  return (
    <>
      <SEO 
        title="Калькуляторы для расчета отделочных материалов"
        description="Бесплатные онлайн калькуляторы для расчета количества обоев, молдингов, плинтусов и других отделочных материалов. Точные расчеты с учетом всех параметров."
      />

      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Калькуляторы расчета материалов</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Воспользуйтесь нашими калькуляторами для точного расчета необходимого количества отделочных материалов
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {calculators.map((calculator, index) => (
              <motion.div
                key={calculator.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  to={calculator.path}
                  className="block bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden group"
                >
                  <div className={`bg-gradient-to-r ${calculator.color} p-6 relative overflow-hidden`}>
                    <calculator.icon className="w-12 h-12 text-white mb-4 relative z-10 transform group-hover:scale-110 transition-transform duration-300" />
                    <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                    <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/10 rounded-full transform group-hover:scale-150 transition-transform duration-500" />
                  </div>
                  
                  <div className="p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                      {calculator.title}
                    </h2>
                    <p className="text-gray-600">
                      {calculator.description}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="mt-16 bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Почему важно правильно рассчитывать материалы?</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <div className="bg-purple-100 p-3 rounded-xl w-12 h-12 flex items-center justify-center mb-4">
                  <Calculator className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Экономия средств</h3>
                <p className="text-gray-600">
                  Точный расчет помогает избежать лишних затрат на покупку избыточного количества материалов
                </p>
              </div>

              <div>
                <div className="bg-purple-100 p-3 rounded-xl w-12 h-12 flex items-center justify-center mb-4">
                  <Box className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Оптимизация работы</h3>
                <p className="text-gray-600">
                  Правильный расчет позволяет спланировать работу и избежать простоев из-за нехватки материалов
                </p>
              </div>

              <div>
                <div className="bg-purple-100 p-3 rounded-xl w-12 h-12 flex items-center justify-center mb-4">
                  <Ruler className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Качественный результат</h3>
                <p className="text-gray-600">
                  Учет всех параметров помещения обеспечивает профессиональный подход к отделочным работам
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
