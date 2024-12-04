import React, { useState } from 'react';
import { Calculator, RefreshCw, Plus, Minus } from 'lucide-react';
import { motion } from 'framer-motion';
import { SEO } from '../../components/SEO';
import { ShareButton } from '../../components/ShareButton';
import { useLocation } from 'react-router-dom';

export default function GlueCalculator() {
  const location = useLocation();
  const shareUrl = `${window.location.origin}${location.pathname}`;
  const [surfaces, setSurfaces] = useState([{ width: '', height: '' }]);
  const [glueConsumption, setGlueConsumption] = useState('0.3'); // Расход клея кг/м²
  const [gluePackageSize, setGluePackageSize] = useState('5'); // Размер упаковки клея в кг

  const [result, setResult] = useState<{
    totalArea: number;
    glueNeeded: number;
    packagesNeeded: number;
    recommendedPackages: number;
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

  const calculateGlue = () => {
    // Рассчитываем общую площадь поверхностей
    const totalArea = surfaces.reduce((acc, surface) => {
      return acc + (Number(surface.width) * Number(surface.height) || 0);
    }, 0);

    // Рассчитываем необходимое количество клея в кг
    const glueNeeded = totalArea * Number(glueConsumption);
    
    // Рассчитываем количество упаковок
    const packagesNeeded = Math.ceil(glueNeeded / Number(gluePackageSize));
    
    // Добавляем 10% запаса
    const recommendedPackages = Math.ceil(packagesNeeded * 1.1);

    setResult({
      totalArea,
      glueNeeded,
      packagesNeeded,
      recommendedPackages
    });
  };

  const resetCalculator = () => {
    setSurfaces([{ width: '', height: '' }]);
    setGlueConsumption('0.3');
    setGluePackageSize('5');
    setResult(null);
  };

  return (
    <>
      <SEO 
        title="Калькулятор расхода клея | Расчет количества"
        description="Онлайн калькулятор для расчета необходимого количества клея. Учитывает площадь поверхности и расход материала."
      />

      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center space-x-4 mb-4">
              <h1 className="text-4xl font-bold text-gray-900">Калькулятор расхода клея</h1>
              <ShareButton
                title="Калькулятор расхода клея | РусДекор"
                text="Удобный онлайн калькулятор для расчета количества клея"
                url={shareUrl}
              />
            </div>
            <p className="text-xl text-gray-600">
              Рассчитайте необходимое количество клея для вашего проекта
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
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Параметры клея</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Расход клея (кг/м²)
                    </label>
                    <input
                      type="number"
                      value={glueConsumption}
                      onChange={(e) => setGlueConsumption(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      step="0.1"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Размер упаковки (кг)
                    </label>
                    <input
                      type="number"
                      value={gluePackageSize}
                      onChange={(e) => setGluePackageSize(e.target.value)}
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
                onClick={calculateGlue}
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
                  <div className="text-sm text-purple-600 mb-1">Требуется клея</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {result.glueNeeded.toFixed(1)} кг
                  </div>
                </div>

                <div className="bg-purple-50 rounded-xl p-4">
                  <div className="text-sm text-purple-600 mb-1">Минимум упаковок</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {result.packagesNeeded} шт
                  </div>
                </div>

                <div className="bg-purple-50 rounded-xl p-4">
                  <div className="text-sm text-purple-600 mb-1">Рекомендуемое количество</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {result.recommendedPackages} шт
                  </div>
                </div>
              </div>

              <div className="mt-6 text-sm text-gray-500">
                * Рекомендуемое количество учитывает 10% запаса на неравномерность нанесения
              </div>
            </motion.div>
          )}

          <div className="mt-12 bg-white rounded-2xl shadow-xl p-6 md:p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Рекомендации по работе с клеем</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Подготовка поверхности</h3>
                <p className="text-gray-600">
                  Поверхность должна быть чистой, сухой и прочной. Удалите старые покрытия и 
                  выровняйте неровности. При необходимости используйте грунтовку для улучшения адгезии.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Нанесение клея</h3>
                <p className="text-gray-600">
                  Наносите клей равномерным слоем с помощью подходящего инструмента. Следите за 
                  рекомендованной толщиной слоя. Не наносите клей на слишком большую площадь сразу.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Условия работы</h3>
                <p className="text-gray-600">
                  Соблюдайте температурный режим и влажность, указанные производителем. Обеспечьте 
                  хорошую вентиляцию помещения. Используйте средства индивидуальной защиты.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
