import React, { useState } from 'react';
import { Calculator, RefreshCw, Plus, Minus } from 'lucide-react';
import { motion } from 'framer-motion';
import { SEO } from '../../components/SEO';
import { ShareButton } from '../../components/ShareButton';
import { useLocation } from 'react-router-dom';

export default function PanelsCalculator() {
  const location = useLocation();
  const shareUrl = `${window.location.origin}${location.pathname}`;
  const [walls, setWalls] = useState([{ width: '', height: '' }]);
  const [panelWidth, setPanelWidth] = useState('0.2'); // Стандартная ширина рейки
  const [panelSpacing, setPanelSpacing] = useState('0.02'); // Расстояние между рейками

  const [result, setResult] = useState<{
    totalArea: number;
    panelsNeeded: number;
    recommendedPanels: number;
    totalLength: number;
  } | null>(null);

  const addWall = () => {
    setWalls([...walls, { width: '', height: '' }]);
  };

  const removeWall = (index: number) => {
    setWalls(walls.filter((_, i) => i !== index));
  };

  const updateWall = (index: number, field: 'width' | 'height', value: string) => {
    setWalls(walls.map((wall, i) => 
      i === index ? { ...wall, [field]: value } : wall
    ));
  };

  const calculatePanels = () => {
    // Рассчитываем общую площадь стен
    const totalArea = walls.reduce((acc, wall) => {
      return acc + (Number(wall.width) * Number(wall.height) || 0);
    }, 0);

    // Рассчитываем общую длину стен
    const totalWallWidth = walls.reduce((acc, wall) => acc + (Number(wall.width) || 0), 0);
    
    // Рассчитываем количество реек на метр ширины
    const panelsPerMeter = 1 / (Number(panelWidth) + Number(panelSpacing));
    
    // Рассчитываем общее количество реек
    const panelsNeeded = Math.ceil(totalWallWidth * panelsPerMeter);
    
    // Добавляем 15% запаса
    const recommendedPanels = Math.ceil(panelsNeeded * 1.15);

    // Рассчитываем общую длину реек
    const totalLength = walls.reduce((acc, wall) => {
      const height = Number(wall.height) || 0;
      const panelsForWall = Math.ceil((Number(wall.width) || 0) * panelsPerMeter);
      return acc + (height * panelsForWall);
    }, 0);

    setResult({
      totalArea,
      panelsNeeded,
      recommendedPanels,
      totalLength
    });
  };

  const resetCalculator = () => {
    setWalls([{ width: '', height: '' }]);
    setPanelWidth('0.2');
    setPanelSpacing('0.02');
    setResult(null);
  };

  return (
    <>
      <SEO 
        title="Калькулятор реечных панелей | Расчет количества"
        description="Онлайн калькулятор для расчета необходимого количества реечных панелей. Учитывает размеры стен, ширину реек и расстояние между ними."
      />

      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center space-x-4 mb-4">
              <h1 className="text-4xl font-bold text-gray-900">Калькулятор реечных панелей</h1>
              <ShareButton
                title="Калькулятор реечных панелей | РусДекор"
                text="Удобный онлайн калькулятор для расчета количества реечных панелей"
                url={shareUrl}
              />
            </div>
            <p className="text-xl text-gray-600">
              Рассчитайте необходимое количество реечных панелей для вашего проекта
            </p>
          </motion.div>

          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Размеры стен</h3>
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
                        Ширина {index + 1} (м)
                      </label>
                      <input
                        type="number"
                        value={wall.width}
                        onChange={(e) => updateWall(index, 'width', e.target.value)}
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
                        value={wall.height}
                        onChange={(e) => updateWall(index, 'height', e.target.value)}
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
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Параметры реек</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ширина рейки (м)
                    </label>
                    <input
                      type="number"
                      value={panelWidth}
                      onChange={(e) => setPanelWidth(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      step="0.01"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Расстояние между рейками (м)
                    </label>
                    <input
                      type="number"
                      value={panelSpacing}
                      onChange={(e) => setPanelSpacing(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      step="0.01"
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
                onClick={calculatePanels}
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
                  <div className="text-sm text-purple-600 mb-1">Минимум реек</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {result.panelsNeeded} шт
                  </div>
                </div>

                <div className="bg-purple-50 rounded-xl p-4">
                  <div className="text-sm text-purple-600 mb-1">Рекомендуемое количество</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {result.recommendedPanels} шт
                  </div>
                </div>

                <div className="bg-purple-50 rounded-xl p-4">
                  <div className="text-sm text-purple-600 mb-1">Общая длина реек</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {result.totalLength.toFixed(2)} м
                  </div>
                </div>
              </div>

              <div className="mt-6 text-sm text-gray-500">
                * Рекомендуемое количество учитывает 15% запаса на подрезку и возможные ошибки при монтаже
              </div>
            </motion.div>
          )}

          <div className="mt-12 bg-white rounded-2xl shadow-xl p-6 md:p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Советы по монтажу</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Подготовка поверхности</h3>
                <p className="text-gray-600">
                  Стены должны быть ровными, чистыми и сухими. Удалите старые покрытия и выровняйте 
                  поверхность. Нанесите грунтовку для лучшей адгезии.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Разметка и монтаж</h3>
                <p className="text-gray-600">
                  Тщательно разметьте линии установки реек. Начинайте монтаж от угла или от центра стены, 
                  в зависимости от дизайна. Используйте уровень для контроля вертикальности.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Финишная отделка</h3>
                <p className="text-gray-600">
                  После установки всех реек проверьте надежность крепления. При необходимости 
                  обработайте стыки и углы. Очистите поверхность реек от пыли и загрязнений.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
