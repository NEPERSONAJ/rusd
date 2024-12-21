import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useCategories } from '../hooks/useCategories';

const CatalogPage = () => {
  const { categories, loading } = useCategories();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Каталог продукции</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Загрузка категорий...
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="aspect-video bg-gray-200 rounded-2xl mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Каталог продукции</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Откройте для себя нашу коллекцию премиальных декоративных материалов
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {categories.filter(c => !c.parent_id).map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                to={`/category/${category.slug}`}
                className="group block bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                <div className="aspect-video relative overflow-hidden">
                  <img
                    src={category.processed_image || category.image}
                    alt={`Категория ${category.name}`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{category.name}</h2>
                  <p className="text-gray-600">{category.description}</p>
                  <div className="mt-4 inline-flex items-center text-purple-600 font-medium">
                    Смотреть товары
                    <svg
                      className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 bg-white rounded-2xl shadow-sm p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Часто задаваемые вопросы о скидках</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Как работают скидки на категории?</h3>
              <p className="text-gray-600">
                Скидки на категории применяются ко всем товарам в данной категории. 
                Если у товара есть собственная скидка, она имеет приоритет над скидкой категории.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Как узнать о действующих акциях?</h3>
              <p className="text-gray-600">
                Товары со скидкой отмечены специальным значком и процентом скидки. 
                Вы всегда видите как изначальную цену, так и цену со скидкой.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Могут ли скидки суммироваться?</h3>
              <p className="text-gray-600">
                Нет, скидки не суммируются. Если на товар действует персональная скидка и скидка категории,
                применяется наиболее выгодная для покупателя скидка.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Как долго действуют скидки?</h3>
              <p className="text-gray-600">
                Каждая акция имеет свой срок действия. Актуальные даты начала и окончания акции 
                всегда указаны в карточке товара.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CatalogPage;