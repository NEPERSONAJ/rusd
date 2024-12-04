import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Layout } from '../../components/admin/Layout';
import {
  BarChart3,
  Package,
  ShoppingBag,
  Users,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  ChevronDown,
  ChevronRight,
  TrendingUp,
  ChevronLeft
} from 'lucide-react';
import { analyticsService, AnalyticsData, PopularProduct } from '../../lib/services/analyticsService';
import { useProducts } from '../../hooks/useProducts';
import { useCategories } from '../../hooks/useCategories';
import { motion, AnimatePresence } from 'framer-motion';

const PRODUCTS_PER_PAGE = 5;

export function DashboardPage() {
  const { user } = useAuth();
  const { products } = useProducts();
  const { categories } = useCategories();
  const navigate = useNavigate();
  const [timeframe, setTimeframe] = useState<'day' | 'week' | 'month' | 'year'>('day');
  const [stats, setStats] = useState<AnalyticsData[]>([]);
  const [popularProducts, setPopularProducts] = useState<PopularProduct[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showPopularProducts, setShowPopularProducts] = useState(true);

  useEffect(() => {
    loadStats();
    loadPopularProducts();
  }, [timeframe, currentPage]);

  const loadStats = async () => {
    try {
      setLoading(true);
      let data;
      switch (timeframe) {
        case 'day':
          data = await analyticsService.getDailyStats(7);
          break;
        case 'week':
          data = await analyticsService.getWeeklyStats(4);
          break;
        case 'month':
          data = await analyticsService.getMonthlyStats(12);
          break;
        case 'year':
          data = await analyticsService.getYearlyStats();
          break;
      }
      setStats(data || []);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadPopularProducts = async () => {
    try {
      const { data, total } = await analyticsService.getPopularProducts(currentPage, PRODUCTS_PER_PAGE);
      setPopularProducts(data);
      setTotalProducts(total);
    } catch (error) {
      console.error('Error loading popular products:', error);
    }
  };

  const totalPages = Math.ceil(totalProducts / PRODUCTS_PER_PAGE);

  const calculateStats = () => {
    const currentPeriod = stats[0] || {
      unique_visitors: 0,
      total_visits: 0,
      whatsapp_clicks: 0,
      conversion_rate: 0
    };

    const previousPeriod = stats[1] || {
      unique_visitors: 0,
      total_visits: 0,
      whatsapp_clicks: 0,
      conversion_rate: 0
    };

    const calculateChange = (current: number, previous: number) => {
      if (previous === 0 && current === 0) return { value: 0, type: 'neutral' };
      if (previous === 0) return { value: 100, type: 'positive' };
      const change = ((current - previous) / previous) * 100;
      return {
        value: Math.abs(Math.round(change)),
        type: change >= 0 ? 'positive' : 'negative'
      };
    };

    return [
      {
        title: 'Уникальные посетители',
        value: currentPeriod.unique_visitors,
        icon: Users,
        change: calculateChange(currentPeriod.unique_visitors, previousPeriod.unique_visitors)
      },
      {
        title: 'Всего просмотров',
        value: currentPeriod.total_visits,
        icon: BarChart3,
        change: calculateChange(currentPeriod.total_visits, previousPeriod.total_visits)
      },
      {
        title: 'Переходы в WhatsApp',
        value: currentPeriod.whatsapp_clicks,
        icon: Package,
        change: calculateChange(currentPeriod.whatsapp_clicks, previousPeriod.whatsapp_clicks)
      },
      {
        title: 'Конверсия',
        value: `${currentPeriod.conversion_rate.toFixed(1)}%`,
        icon: BarChart3,
        change: calculateChange(currentPeriod.conversion_rate, previousPeriod.conversion_rate)
      }
    ];
  };

  const dashboardStats = calculateStats();

  return (
    <Layout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Добро пожаловать, {user?.email}
          </h1>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setTimeframe('day')}
              className={`px-3 py-1 rounded-lg ${
                timeframe === 'day'
                  ? 'bg-purple-100 text-purple-600'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              День
            </button>
            <button
              onClick={() => setTimeframe('week')}
              className={`px-3 py-1 rounded-lg ${
                timeframe === 'week'
                  ? 'bg-purple-100 text-purple-600'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Неделя
            </button>
            <button
              onClick={() => setTimeframe('month')}
              className={`px-3 py-1 rounded-lg ${
                timeframe === 'month'
                  ? 'bg-purple-100 text-purple-600'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Месяц
            </button>
            <button
              onClick={() => setTimeframe('year')}
              className={`px-3 py-1 rounded-lg ${
                timeframe === 'year'
                  ? 'bg-purple-100 text-purple-600'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Год
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {dashboardStats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <stat.icon className="w-6 h-6 text-purple-600" />
                </div>
                {stat.change.type !== 'neutral' && (
                  <span className={`text-sm font-medium flex items-center ${
                    stat.change.type === 'positive' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change.type === 'positive' ? (
                      <ArrowUpRight className="w-4 h-4 mr-1" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4 mr-1" />
                    )}
                    {stat.change.value}%
                  </span>
                )}
              </div>
              <h3 className="text-sm font-medium text-gray-600">{stat.title}</h3>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div 
              className="flex items-center justify-between cursor-pointer"
              onClick={() => setShowPopularProducts(!showPopularProducts)}
            >
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-purple-600" />
                <h2 className="text-lg font-semibold text-gray-900">
                  Популярные товары
                </h2>
              </div>
              {showPopularProducts ? (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronRight className="w-5 h-5 text-gray-500" />
              )}
            </div>

            <AnimatePresence>
              {showPopularProducts && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="mt-4 space-y-4">
                    {popularProducts.map((product) => (
                      <div
                        key={product.id}
                        className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{product.name}</h3>
                          <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                            <span>Переходов: {product.clicks}</span>
                            <span>Конверсия: {product.conversion_rate.toFixed(1)}%</span>
                          </div>
                        </div>
                        <div className="text-xs text-gray-400">
                          {new Date(product.last_click).toLocaleDateString('ru-RU')}
                        </div>
                      </div>
                    ))}
                    {popularProducts.length === 0 && (
                      <div className="text-center text-gray-500 py-4">
                        Нет данных о популярных товарах
                      </div>
                    )}

                    {totalPages > 1 && (
                      <div className="flex justify-center items-center space-x-2 mt-4">
                        <button
                          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                          disabled={currentPage === 1}
                          className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`w-8 h-8 rounded-lg border ${
                              currentPage === page
                                ? 'bg-purple-100 text-purple-600 border-purple-200'
                                : 'border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            {page}
                          </button>
                        ))}
                        
                        <button
                          onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                          disabled={currentPage === totalPages}
                          className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Последняя активность
            </h2>
            <div className="space-y-4">
              {stats.slice(0, 5).map((stat, index) => (
                <div key={index} className="flex items-center justify-between text-sm p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 text-purple-600 mr-2" />
                    <span className="text-gray-600">
                      {new Date(stat.period).toLocaleDateString('ru-RU')}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-gray-500">
                      Посетители: {stat.unique_visitors}
                    </span>
                    <span className="text-gray-500">
                      Конверсия: {stat.conversion_rate.toFixed(1)}%
                    </span>
                  </div>
                </div>
              ))}
              {stats.length === 0 && (
                <div className="text-center text-gray-500 py-4">
                  Нет данных за выбранный период
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
