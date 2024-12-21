import React, { useState } from 'react';
import { Calculator, RefreshCw, Plus, Minus } from 'lucide-react';
import { motion } from 'framer-motion';
import { SEO } from '../../components/SEO';
import { ShareButton } from '../../components/ShareButton';
import { useLocation } from 'react-router-dom';

export default function PlinthCalculator() {
  const location = useLocation();
  const shareUrl = `${window.location.origin}${location.pathname}`;
  const [walls, setWalls] = useState([{ length: '' }]);
  const [plinthLength, setPlinthLength] = useState('2.5'); // Standard plinth length in meters
  const [corners, setCorners] = useState({
    outer: '',
    inner: ''
  });
  const [doorways, setDoorways] = useState('');

  const [result, setResult] = useState<{
    totalLength: number;
    piecesNeeded: number;
    recommendedPieces: number;
    cornersNeeded: {
      outer: number;
      inner: number;
    };
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

  const calculatePlinth = () => {
    // Calculate total length needed
    const totalWallLength = walls.reduce((acc, wall) => acc + (Number(wall.length) || 0), 0);
    const doorwayDeduction = Number(doorways) * 0.9; // Standard door width 90cm
    const totalLength = totalWallLength - doorwayDeduction;
    
    // Calculate number of pieces needed
    const piecesNeeded = Math.ceil(totalLength / Number(plinthLength));
    
    // Add 15% for wastage and cuts
    const recommendedPieces = Math.ceil(piecesNeeded * 1.15);

    // Calculate corners needed
    const cornersNeeded = {
      outer: Number(corners.outer) || 0,
      inner: Number(corners.inner) || 0
    };

    setResult({
      totalLength,
      piecesNeeded,
      recommendedPieces,
      cornersNeeded
    });
  };

  const resetCalculator = () => {
    setWalls([{ length: '' }]);
    setPlinthLength('2.5');
    setCorners({ outer: '', inner: '' });
    setDoorways('');
    setResult(null);
  };

  return (
    <>
      <SEO 
        title="Калькулятор плинтусов | Расчет длины и количества"
        description="Онлайн калькулятор для расчета необходимого количества плинтусов. Учитывает длину стен, дверные проемы и углы. Точный расчет с запасом на подрезку."
      />

      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center space-x-4 mb-4">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Калькулятор плинтусов</h1>
              <ShareButton
                title="Калькулятор обоев | РусДекор"
                text="Удобный онлайн калькулятор для расчета количества рулонов обоев"
                url={shareUrl}
              />
            </div>
            <p className="text-xl text-gray-600">
              Рассчитайте необходимое количество плинтусов для вашего помещения
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

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Длина одного плинтуса (м)
                  </label>
                  <input
                    type="number"
                    value={plinthLength}
                    onChange={(e) => setPlinthLength(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    step="0.1"
                    min="0"
                  />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Дополнительные параметры</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Количество дверных проемов
                    </label>
                    <input
                      type="number"
                      value={doorways}
                      onChange={(e) => setDoorways(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Внешние углы (шт)
                    </label>
                    <input
                      type="number"
                      value={corners.outer}
                      onChange={(e) => setCorners(prev => ({ ...prev, outer: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Внутренние углы (шт)
                    </label>
                    <input
                      type="number"
                      value={corners.inner}
                      onChange={(e) => setCorners(prev => ({ ...prev, inner: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                onClick={calculatePlinth}
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
                  <div className="text-sm text-purple-600 mb-1">Общая длина</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {result.totalLength.toFixed(2)} м
                  </div>
                </div>

                <div className="bg-purple-50 rounded-xl p-4">
                  <div className="text-sm text-purple-600 mb-1">Минимум штук</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {result.piecesNeeded} шт
                  </div>
                </div>

                <div className="bg-purple-50 rounded-xl p-4">
                  <div className="text-sm text-purple-600 mb-1">Рекомендуемое количество</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {result.recommendedPieces} шт
                  </div>
                </div>

                <div className="bg-purple-50 rounded-xl p-4">
                  <div className="text-sm text-purple-600 mb-1">Углы</div>
                  <div className="text-lg font-bold text-gray-900">
                    Внешние: {result.cornersNeeded.outer} шт
                    <br />
                    Внутренние: {result.cornersNeeded.inner} шт
                  </div>
                </div>
              </div>

              <div className="mt-6 text-sm text-gray-500">
                * Рекомендуемое количество учитывает 15% запаса на подрезку и возможный брак
              </div>
            </motion.div>
          )}

          <div className="mt-12 bg-white rounded-2xl shadow-xl p-6 md:p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Советы по установке</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Подготовка к монтажу</h3>
                <p className="text-gray-600">
                  Перед установкой выдержите плинтуса в помещении не менее 24 часов для акклиматизации. 
                  Очистите поверхность стен и пола от пыли и грязи. Проверьте ровность стен и при необходимости 
                  выровняйте их.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Особенности резки</h3>
                <p className="text-gray-600">
                  Используйте стусло для точной резки углов. Для внутренних углов режьте под 45° внутрь, 
                  для внешних - под 45° наружу. Начинайте установку с самого длинного участка стены.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Крепление и финишная отделка</h3>
                <p className="text-gray-600">
                  Используйте специальный клей для плинтусов или монтажные гвозди. После установки 
                  заделайте все стыки и щели специальным герметиком под цвет плинтуса. При необходимости 
                  покрасьте плинтус после полного высыхания всех материалов.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
