import React, { useState } from 'react';
import { Calculator, Minus, Plus, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { SEO } from '../../components/SEO';
import { ShareButton } from '../../components/ShareButton';
import { useLocation } from 'react-router-dom';

export default function WallpaperCalculator() {
  const location = useLocation();
  const shareUrl = `${window.location.origin}${location.pathname}`;
  const [dimensions, setDimensions] = useState({
    roomLength: '',
    roomWidth: '',
    roomHeight: '',
    rollWidth: '1.06',
    rollLength: '10',
    windows: [{ width: '', height: '' }],
    doors: [{ width: '', height: '' }]
  });

  const [result, setResult] = useState<{
    totalArea: number;
    rollsNeeded: number;
    wastageRolls: number;
  } | null>(null);
  
  const addWindow = () => {
    setDimensions(prev => ({
      ...prev,
      windows: [...prev.windows, { width: '', height: '' }]
    }));
  };

  const addDoor = () => {
    setDimensions(prev => ({
      ...prev,
      doors: [...prev.doors, { width: '', height: '' }]
    }));
  };

  const removeWindow = (index: number) => {
    setDimensions(prev => ({
      ...prev,
      windows: prev.windows.filter((_, i) => i !== index)
    }));
  };

  const removeDoor = (index: number) => {
    setDimensions(prev => ({
      ...prev,
      doors: prev.doors.filter((_, i) => i !== index)
    }));
  };

  const updateWindow = (index: number, field: 'width' | 'height', value: string) => {
    setDimensions(prev => ({
      ...prev,
      windows: prev.windows.map((window, i) => 
        i === index ? { ...window, [field]: value } : window
      )
    }));
  };

  const updateDoor = (index: number, field: 'width' | 'height', value: string) => {
    setDimensions(prev => ({
      ...prev,
      doors: prev.doors.map((door, i) => 
        i === index ? { ...door, [field]: value } : door
      )
    }));
  };

  const calculateWallpaper = () => {
    // Convert all inputs to numbers
    const length = Number(dimensions.roomLength);
    const width = Number(dimensions.roomWidth);
    const height = Number(dimensions.roomHeight);
    const rollWidth = Number(dimensions.rollWidth);
    const rollLength = Number(dimensions.rollLength);

    // Calculate total wall area
    const perimeter = 2 * (length + width);
    let totalWallArea = perimeter * height;

    // Subtract windows and doors area
    const windowsArea = dimensions.windows.reduce((acc, window) => {
      return acc + (Number(window.width) * Number(window.height) || 0);
    }, 0);

    const doorsArea = dimensions.doors.reduce((acc, door) => {
      return acc + (Number(door.width) * Number(door.height) || 0);
    }, 0);

    totalWallArea -= (windowsArea + doorsArea);

    // Calculate number of rolls needed
    const rollArea = rollWidth * rollLength;
    const rollsNeeded = Math.ceil(totalWallArea / rollArea);
    
    // Add 10% for wastage
    const wastageRolls = Math.ceil(rollsNeeded * 1.1);

    setResult({
      totalArea: totalWallArea,
      rollsNeeded: rollsNeeded,
      wastageRolls: wastageRolls
    });
  };

  const resetCalculator = () => {
    setDimensions({
      roomLength: '',
      roomWidth: '',
      roomHeight: '',
      rollWidth: '1.06',
      rollLength: '10',
      windows: [{ width: '', height: '' }],
      doors: [{ width: '', height: '' }]
    });
    setResult(null);
  };

  return (
    <>
      <SEO 
        title="Калькулятор обоев | Расчет количества рулонов"
        description="Бесплатный онлайн калькулятор для расчета количества рулонов обоев. Учитывает размеры комнаты, окна и двери. Точный расчет с учетом подгонки рисунка."
      />

      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center space-x-4 mb-4">
              <h1 className="text-4xl font-bold text-gray-900">Калькулятор обоев</h1>
              <ShareButton
                title="Калькулятор обоев | РусДекор"
                text="Удобный онлайн калькулятор для расчета количества рулонов обоев"
                url={shareUrl}
              />
            </div>
            <p className="text-xl text-gray-600">
              Рассчитайте необходимое количество рулонов обоев для вашей комнаты
            </p>
          </motion.div>
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Размеры комнаты</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Длина комнаты (м)
                    </label>
                    <input
                      type="number"
                      value={dimensions.roomLength}
                      onChange={(e) => setDimensions(prev => ({ ...prev, roomLength: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      step="0.01"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ширина комнаты (м)
                    </label>
                    <input
                      type="number"
                      value={dimensions.roomWidth}
                      onChange={(e) => setDimensions(prev => ({ ...prev, roomWidth: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      step="0.01"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Высота потолков (м)
                    </label>
                    <input
                      type="number"
                      value={dimensions.roomHeight}
                      onChange={(e) => setDimensions(prev => ({ ...prev, roomHeight: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      step="0.01"
                      min="0"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Параметры рулона</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ширина рулона (м)
                    </label>
                    <input
                      type="number"
                      value={dimensions.rollWidth}
                      onChange={(e) => setDimensions(prev => ({ ...prev, rollWidth: e.target.value }))}
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
                      value={dimensions.rollLength}
                      onChange={(e) => setDimensions(prev => ({ ...prev, rollLength: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      step="0.01"
                      min="0"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Окна и двери</h3>
              
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-md font-medium text-gray-700">Окна</h4>
                    <button
                      onClick={addWindow}
                      className="flex items-center space-x-2 text-purple-600 hover:text-purple-700"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Добавить окно</span>
                    </button>
                  </div>
                  
                  {dimensions.windows.map((window, index) => (
                    <div key={index} className="flex items-center space-x-4 mb-4">
                      <div className="flex-1">
                        <input
                          type="number"
                          value={window.width}
                          onChange={(e) => updateWindow(index, 'width', e.target.value)}
                          placeholder="Ширина"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          step="0.01"
                          min="0"
                        />
                      </div>
                      <div className="flex-1">
                        <input
                          type="number"
                          value={window.height}
                          onChange={(e) => updateWindow(index, 'height', e.target.value)}
                          placeholder="Высота"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          step="0.01"
                          min="0"
                        />
                      </div>
                      {dimensions.windows.length > 1 && (
                        <button
                          onClick={() => removeWindow(index)}
                          className="p-2 text-gray-400 hover:text-red-500"
                        >
                          <Minus className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-md font-medium text-gray-700">Двери</h4>
                    <button
                      onClick={addDoor}
                      className="flex items-center space-x-2 text-purple-600 hover:text-purple-700"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Добавить дверь</span>
                    </button>
                  </div>
                  
                  {dimensions.doors.map((door, index) => (
                    <div key={index} className="flex items-center space-x-4 mb-4">
                      <div className="flex-1">
                        <input
                          type="number"
                          value={door.width}
                          onChange={(e) => updateDoor(index, 'width', e.target.value)}
                          placeholder="Ширина"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          step="0.01"
                          min="0"
                        />
                      </div>
                      <div className="flex-1">
                        <input
                          type="number"
                          value={door.height}
                          onChange={(e) => updateDoor(index, 'height', e.target.value)}
                          placeholder="Высота"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          step="0.01"
                          min="0"
                        />
                      </div>
                      {dimensions.doors.length > 1 && (
                        <button
                          onClick={() => removeDoor(index)}
                          className="p-2 text-gray-400 hover:text-red-500"
                        >
                          <Minus className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={calculateWallpaper}
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
                  <div className="text-sm text-purple-600 mb-1">Площадь стен</div>
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
                    {result.wastageRolls} шт
                  </div>
                </div>
              </div>

              <div className="mt-6 text-sm text-gray-500">
                * Рекомендуемое количество учитывает 10% запаса на подгонку рисунка и возможные ошибки при поклейке
              </div>
            </motion.div>
          )}

          <div className="mt-12 bg-white rounded-2xl shadow-xl p-6 md:p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Полезные советы</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Как правильно измерять?</h3>
                <p className="text-gray-600">
                  Измеряйте высоту стен от пола до потолка в нескольких местах, так как высота может различаться. 
                  Используйте наибольшее значение для расчетов.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Учет рисунка</h3>
                <p className="text-gray-600">
                  Если обои с рисунком, добавьте дополнительный запас на подгонку узора. 
                  Для крупного рисунка может потребоваться до 20% дополнительного материала.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Дополнительный запас</h3>
                <p className="text-gray-600">
                  Всегда берите больше обоев, чем показывает расчет. Это пригодится для исправления ошибок 
                  или замены поврежденных участков в будущем.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

