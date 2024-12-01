import React from 'react';
import { motion } from 'framer-motion';
import { ProductList } from '../components/products/ProductList';
import { SEO } from '../components/SEO';
import { Tag } from 'lucide-react';
import { useProducts } from '../hooks/useProducts';
import { Product, Category } from '../types';
import { ProductCard } from '../components/products/ProductCard';
import { useCategories } from '../hooks/useCategories';
import { Link } from 'react-router-dom';

const isCategoryDiscountActive = (category: Category): boolean => {
  if (!category.discount_enabled) return false;
  const now = new Date();
  try {
    const startDate = category.discount_start_date ? new Date(category.discount_start_date) : null;
    const endDate = category.discount_end_date ? new Date(category.discount_end_date) : null;

    if (!startDate || !endDate) return false;

    return now >= startDate && now <= endDate;
  } catch (error) {
    console.error('Error checking category discount status:', error);
    return false;
  }
};

const isDiscountActive = (product: Product): boolean => {
  if (!product.discount_enabled) return false;
  const now = new Date();
  try {
    const startDate = product.discount_start_date ? new Date(product.discount_start_date) : null;
    const endDate = product.discount_end_date ? new Date(product.discount_end_date) : null;

    if (!startDate || !endDate) return false;

    return now >= startDate && now <= endDate;
  } catch (error) {
    console.error('Error checking discount status:', error);
    return false;
  }
};

export default function SalePage() {
  const { products, loading } = useProducts();
  const { categories, loading: categoriesLoading } = useCategories();
  const discountedProducts = products.filter(isDiscountActive);
  const discountedCategories = categories.filter(isCategoryDiscountActive);

  return (
    <>
      <SEO
        title="Товары по акции"
        description="Специальные предложения и скидки на категории и товары"
      />

      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center mb-4">
              <Tag className="w-12 h-12 text-red-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Акции и скидки</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Специальные предложения и скидки на категории и товары
            </p>
          </motion.div>

          {/* Категории со скидками */}
          {discountedCategories.length > 0 && (
            <div className="mb-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Категории со скидками</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {discountedCategories.map((category) => (
                  <Link
                    key={category.id}
                    to={`/category/${category.slug}`}
                    className="group relative flex flex-col overflow-hidden rounded-xl shadow-xl transition-all duration-500 hover:shadow-2xl"
                  >
                    <div className="aspect-[16/9] overflow-hidden">
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <div className="absolute top-4 left-4 bg-gradient-to-r from-red-600 to-pink-600 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg flex items-center space-x-2">
                        <Tag className="w-4 h-4" />
                        <span>-{category.discount_percentage}%</span>
                      </div>
                    </div>
                    <div className="p-6 bg-white">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{category.name}</h3>
                      <p className="text-gray-600 line-clamp-2">{category.description}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Товары со скидками */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Товары со скидками</h2>
            {loading ? (
              <div className="text-center">Загрузка...</div>
            ) : discountedProducts.length === 0 ? (
              <div className="text-center text-gray-600">
                В данный момент нет активных акций
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {discountedProducts.map((product) => (
                  <ProductCard key={product.id} {...product} specs={product.specs || []} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
