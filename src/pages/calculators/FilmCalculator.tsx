import React, { useState } from 'react';
import { Calculator, RefreshCw, Plus, Minus } from 'lucide-react';
import { motion } from 'framer-motion';
import { SEO } from '../../components/SEO';
import { ShareButton } from '../../components/ShareButton';
import { useLocation } from 'react-router-dom';

export default function FilmCalculator() {
  const location = useLocation();
  const shareUrl = `${window.location.origin}${location.pathname}`;
  const [surfaces, setSurfaces] = useState([{ width: '', height: '' }]);
  const [filmWidth, setFilmWidth] = useState('1.22'); // Стандартная ширина рулона пленки
  const [filmLength, setFilmLength] = useState('50'); // Стандартная длина рулона

  const [result, setResult] = useState<{
    totalArea: number;
    rollsNeeded: number;
    recommendedRolls: number;
    wastage: number;
  } | null>(null);

  const addSurface = () => {
    setSurfaces([...surfaces, { width: '', height: '' }]);
  };

  const removeSurface = (index: number) => {
    setSurfaces(surfaces.filter((_, i) => i !== index));
  };

  const updateSurface = (index: number, field: 'width' | 'height', value: string) => {
    setSurfaces(surfaces.map((surface, i) => 
      i === index ? { ...surface, [field]: value } : surface
    ));
  };

  const calculateFilm = () => {
    // Рассчитываем общую площадь поверхностей
    const totalArea = surfaces.reduce((acc, surface) => {
      return acc + (Number(surface.width) * Number(surface.height) || 0);
    }, 0);

    // Площадь одного рулона
    const rollArea = Number(filmWidth) * Number(filmLength);
    
    // Рассчитываем необходимое количество рулонов
    const rollsNeeded = Math.ceil(totalArea / rollArea);
    
    // Добавляем 15% запаса на подгонку и возможные ошибки
    const recommendedRolls = Math.ceil(rollsNeeded * 1.15);
    
    // Рассчитываем процент отходов
    const wastage = ((recommendedRolls * rollArea - totalArea) / (recommendedRolls * rollArea)) * 100;

    setResult({
      totalArea,
      rollsNeeded,
      recommendedRolls,
      wastage
    });
  };

  const resetCalculator = () => {
    setSurfaces([{ width: '', height: '' }]);
    setFilmWidth('1.22');
    setFilmLength('50');
    setResult(null);
  };

  return (
    <>
      <SEO 
        title="Калькулятор самоклеющейся пленки | Расчет количества"
        description="Онлайн калькулятор для расчета необходимого количества самоклеющейся пленки. Учитывает размеры поверхностей и добавляет запас на подгонку."
      />

      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center space-x-4 mb-4">
              <h1 className="text-4xl font-bold text-gray-900">Калькулятор самоклеющейся пленки</h1>
              <ShareButton
                title="Калькулятор самоклеющейся пленки | РусДекор"
                text="Удобный онлайн калькулятор для расчета количества самоклеющейся пленки"
                url={shareUrl}
              />
            </div>
            <p className="text-xl text-gray-600">
              Рассчитайте необходимое количество самоклеющейся пленки для вашего проекта
            </p>
          </motion.div>

          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Размеры поверхностей</h3>
                  <button
                    onClick={addSurface}
                    className="flex items-center space-x-2 text-purple-600 hover:text-purple-700"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Добавить поверхность</span>
                  </button>
                </div>

                {surfaces.map((surface, index) => (
                  <div key={index} className="flex items-center space-x-4 mb-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Ширина {index + 1} (м)
                      </label>
                      <input
                        type="number"
                        value={surface.width}
                        onChange={(e) => updateSurface(index, 'width', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        step="0.01"
                        min="0"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Высота {index + 1} (м)
                      </label>
                      <input
                        type="number"
                        value={surface.height}
                        onChange={(e) => updateSurface(index, 'height', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        step="0.01"
                        min="0"
                      />
                    </div>
                    {surfaces.length > 1 && (
                      <button
                        onClick={() => removeSurface(index)}
                        className="mt-6 p-2 text-gray-400 hover:text-red-500"
                      >
                        <Minus className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Параметры пленки</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ширина рулона (м)
                    </label>
                    <input
                      type="number"
                      value={filmWidth}
                      onChange={(e) => setFilmWidth(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      step="0.01"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Длина рулона (м)
                    </label>
                    <input
                      type="number"
                      value={filmLength}
                      onChange={(e) => setFilmLength(e.target.value)}
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
                onClick={calculateFilm}
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
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-purple-50 rounded-xl p-4">
                  <div className="text-sm text-purple-600 mb-1">Общая площадь</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {result.totalArea.toFixed(2)} м²
                  </div>
                </div>

                <div className="bg-purple-50 rounded-xl p-4">
                  <div className="text-sm text-purple-600 mb-1">Минимум рулонов</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {result.rollsNeeded} шт
                  </div>
                </div>

                <div className="bg-purple-50 rounded-xl p-4">
                  <div className="text-sm text-purple-600 mb-1">Рекомендуемое количество</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {result.recommendedRolls} шт
                  </div>
                </div>

                <div className="bg-purple-50 rounded-xl p-4">
                  <div className="text-sm text-purple-600 mb-1">Процент отходов</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {result.wastage.toFixed(1)}%
                  </div>
                </div>
              </div>

              <div className="mt-6 text-sm text-gray-500">
                * Рекомендуемое количество учитывает 15% запаса на подгонку и возможные ошибки при монтаже
              </div>
            </motion.div>
          )}

          <div className="mt-12 bg-white rounded-2xl shadow-xl p-6 md:p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Советы по монтажу</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Подготовка поверхности</h3>
                <p className="text-gray-600">
                  Тщательно очистите и обезжирьте поверхность перед наклеиванием пленки. 
                  Убедитесь, что поверхность сухая и ровная. При необходимости используйте грунтовку.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Процесс наклеивания</h3>
                <p className="text-gray-600">
                  Начинайте наклеивать пленку сверху вниз, постепенно разглаживая и удаляя пузырьки воздуха. 
                  Используйте специальный ракель для более ровного нанесения.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Температурный режим</h3>
                <p className="text-gray-600">
                  Оптимальная температура для монтажа пленки: 18-25°C. Избегайте монтажа при слишком 
                  высоких или низких температурах, так как это может повлиять на адгезию.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
