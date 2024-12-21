import React, { useState } from 'react';
import { Calculator, RefreshCw, Plus, Minus } from 'lucide-react';
import { motion } from 'framer-motion';
import { SEO } from '../../components/SEO';
import { ShareButton } from '../../components/ShareButton';
import { useLocation } from 'react-router-dom';

export default function CornersCalculator() {
  const location = useLocation();
  const shareUrl = `${window.location.origin}${location.pathname}`;
  const [walls, setWalls] = useState([{ length: '' }]);
  const [cornerHeight, setCornerHeight] = useState('2.7'); // Стандартная высота уголка
  const [cornerSpacing, setCornerSpacing] = useState('0.6'); // Расстояние между уголками
  const [result, setResult] = useState<{
    totalLength: number;
    cornersNeeded: number;
    recommendedCorners: number;
  } | null>(null);

  const addWall = () => {
    setWalls([...walls, { length: '' }]);
  };

  const removeWall = (index: number) => {
    setWalls(walls.filter((_, i) => i !== index));
  };

  const updateWall = (index: number, value: string) => {
    setWalls(walls.map((wall, i) => 
      i === index ? { length: value } : wall
    ));
  };

  const calculateCorners = () => {
    // Рассчитываем общую длину стен
    const totalLength = walls.reduce((acc, wall) => acc + (Number(wall.length) || 0), 0);
    
    // Расс Continuing with the CornersCalculator.tsx file exactly where we left off:

    // Рассчитываем количество уголков на каждую стену
    const cornersPerWall = Math.ceil(Number(cornerHeight) / Number(cornerSpacing));
    
    // Рассчитываем общее количество уголков
    const cornersNeeded = Math.ceil(totalLength * cornersPerWall);
    
    // Добавляем 10% запаса
    const recommendedCorners = Math.ceil(cornersNeeded * 1.1);

    setResult({
      totalLength,
      cornersNeeded,
      recommendedCorners
    });
  };

  const resetCalculator = () => {
    setWalls([{ length: '' }]);
    setCornerHeight('2.7');
    setCornerSpacing('0.6');
    setResult(null);
  };

  return (
    <>
      <SEO 
        title="Калькулятор уголков | Расчет количества"
        description="Онлайн калькулятор для расчета необходимого количества уголков. Учитывает длину стен, высоту помещения и расстояние между уголками."
      />

      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center space-x-4 mb-4">
              <h1 className="text-4xl font-bold text-gray-900">Калькулятор уголков</h1>
              <ShareButton
                title="Калькулятор уголков | РусДекор"
                text="Удобный онлайн калькулятор для расчета количества уголков"
                url={shareUrl}
              />
            </div>
            <p className="text-xl text-gray-600">
              Рассчитайте необходимое количество уголков для вашего проекта
            </p>
          </motion.div>

          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Длина стен</h3>
                  <button
                    onClick={addWall}
                    className="flex items-center space-x-2 text-purple-600 hover:text-purple-700"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Добавить стену</span>
                  </button>
                </div>

                {walls.map((wall, index) => (
                  <div key={index} className="flex items-center space-x-4 mb-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Стена {index + 1} (м)
                      </label>
                      <input
                        type="number"
                        value={wall.length}
                        onChange={(e) => updateWall(index, e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        step="0.01"
                        min="0"
                      />
                    </div>
                    {walls.length > 1 && (
                      <button
                        onClick={() => removeWall(index)}
                        className="mt-6 p-2 text-gray-400 hover:text-red-500"
                      >
                        <Minus className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Параметры уголков</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Высота стены (м)
                    </label>
                    <input
                      type="number"
                      value={cornerHeight}
                      onChange={(e) => setCornerHeight(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      step="0.1"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Расстояние между уголками (м)
                    </label>
                    <input
                      type="number"
                      value={cornerSpacing}
                      onChange={(e) => setCornerSpacing(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      step="0.1"
                      min="0"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={calculateCorners}
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-xl font-medium hover:shadow-lg transition-all flex items-center justify-center space-x-2"
              >
                <Calculator className="w-5 h-5" />
                <span>Рассчитать</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={resetCalculator}
                className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-medium hover:bg-gray-200 transition-all flex items-center justify-center space-x-2"
              >
                <RefreshCw className="w-5 h-5" />
                <span>Сбросить</span>
              </motion.button>
            </div>
          </div>

          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-xl p-6 md:p-8"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-6">Результаты расчета</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-purple-50 rounded-xl p-4">
                  <div className="text-sm text-purple-600 mb-1">Общая длина стен</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {result.totalLength.toFixed(2)} м
                  </div>
                </div>

                <div className="bg-purple-50 rounded-xl p-4">
                  <div className="text-sm text-purple-600 mb-1">Минимум уголков</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {result.cornersNeeded} шт
                  </div>
                </div>

                <div className="bg-purple-50 rounded-xl p-4">
                  <div className="text-sm text-purple-600 mb-1">Рекомендуемое количество</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {result.recommendedCorners} шт
                  </div>
                </div>
              </div>

              <div className="mt-6 text-sm text-gray-500">
                * Рекомендуемое количество учитывает 10% запаса на подрезку и возможные ошибки при монтаже
              </div>
            </motion.div>
          )}

          <div className="mt-12 bg-white rounded-2xl shadow-xl p-6 md:p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Советы по монтажу</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Подготовка к установке</h3>
                <p className="text-gray-600">
                  Перед установкой уголков убедитесь, что поверхность стен чистая, сухая и ровная. 
                  Разметьте линии установки с помощью уровня и карандаша.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Крепление уголков</h3>
                <p className="text-gray-600">
                  Используйте подходящий клей или монтажный состав. Наносите клей равномерно, 
                  избегая излишков. При необходимости используйте дополнительные крепежные элементы.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Финишная отделка</h3>
                <p className="text-gray-600">
                  После установки заполните все стыки и щели подходящим герметиком. Очистите поверхность 
                  уголков от излишков клея. При необходимости окрасьте уголки в желаемый цвет.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
