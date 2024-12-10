// src/components/home/Categories.tsx
import React from 'react';
import { useCategories } from '../../hooks/useCategories';
import { useProducts } from '../../hooks/useProducts';
import { Category } from '../../types';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Tag, Package, RefreshCw, AlertCircle } from 'lucide-react';

const isDiscountActive = (category: Category): boolean => {
  if (!category.discount_enabled) return false;
  const now = new Date();
  const startDate = category.discount_start_date ? new Date(category.discount_start_date) : null;
  const endDate = category.discount_end_date ? new Date(category.discount_end_date) : null;
  return startDate && endDate ? now >= startDate && now <= endDate : false;
};

export function Categories() {
  const { categories, loading, error, retryLoading } = useCategories();
  const { products } = useProducts();

  // Get all descendant category IDs for a given category
  const getDescendantCategoryIds = (categoryId: string): string[] => {
    const descendants: string[] = [categoryId];
    const children = categories.filter(c => c.parent_id === categoryId);
    
    children.forEach(child => {
      descendants.push(...getDescendantCategoryIds(child.id));
    });
    
    return descendants;
  };

  // Get total product count for a category including all its subcategories
  const getProductCount = (categoryId: string): number => {
    const categoryIds = getDescendantCategoryIds(categoryId);
    return products.filter(product => categoryIds.includes(product.category_id)).length;
  };

  if (error) {
    return (
      <section className="py-16 bg-gradient-to-b from-white to-amber-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="inline-flex items-center justify-center p-4 bg-red-50 rounded-full mb-4">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Не удалось загрузить категории
            </h2>
            <p className="text-gray-600 mb-6">
              {error}
            </p>
            <button
              onClick={retryLoading}
              className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <RefreshCw className="w-5 h-5 mr-2" />
              Попробовать снова
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-b from-white to-amber-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">
            Каталог продукции
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="aspect-video bg-gray-200 rounded-2xl mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  const mainCategories = categories.filter(c => !c.parent_id);

  if (mainCategories.length === 0) {
    return (
      <section className="py-16 bg-gradient-to-b from-white to-amber-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Категории пока не добавлены
            </h2>
            <p className="text-gray-600">
              Загляните позже, мы работаем над наполнением каталога.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-b from-white to-amber-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-600 to-yellow-500 mb-4">
            Каталог продукции
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Откройте для себя коллекцию премиальных декоративных материалов
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {mainCategories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group relative"
            >
              <Link to={`/category/${category.slug}`} className="block">
                <div className="relative overflow-hidden rounded-2xl shadow-lg bg-white">
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={category.processed_image || category.image}
                      alt={category.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      loading={index > 5 ? 'lazy' : 'eager'}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    {/* Product Count Badge */}
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg flex items-center space-x-1.5">
                      <Package className="w-4 h-4 text-amber-600" />
                      <span className="text-sm font-semibold text-gray-800">
                        {getProductCount(category.id)}
                      </span>
                    </div>
                    
                    {category.discount_enabled && isDiscountActive(category) && (
                      <div className="absolute top-3 left-3">
                        <div className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg flex items-center space-x-1">
                          <Tag className="w-3 h-3" />
                          <span>-{category.discount_percentage}%</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-4 text-center transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                    <div className="bg-white/95 backdrop-blur-sm p-3 rounded-xl shadow-lg">
                      <h3 className="text-sm font-bold text-gray-900 mb-1">{category.name}</h3>
                      <p className="text-xs text-gray-600 line-clamp-2">{category.description}</p>
                    </div>
                  </div>

                  <div className="absolute inset-0 border-4 border-transparent group-hover:border-amber-300/20 rounded-2xl transition-all duration-500" />
                </div>

                <div className="mt-3 text-center">
                  <h3 className="text-sm font-semibold text-gray-900 group-hover:text-amber-600 transition-colors">
                    {category.name}
                  </h3>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
