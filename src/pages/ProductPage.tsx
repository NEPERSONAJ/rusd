import React from 'react';
import { useParams } from 'react-router-dom';
import { useProduct } from '../hooks/useProduct';
import { SEO } from '../components/SEO';
import { Package, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import { ProductCard } from '../components/products/ProductCard';
import { useProducts } from '../hooks/useProducts';

export default function ProductPage() {
  const { productId = '' } = useParams();
  const { product, loading, error } = useProduct(productId);
  const { products: relatedProducts } = useProducts(product?.category);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-96 bg-gray-200 rounded-2xl mb-8"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="h-24 bg-gray-200 rounded mb-8"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Товар не найден
          </h1>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO
        title={product.name}
        description={product.description}
        image={product.image}
        type="product"
      />

      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="relative"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full rounded-2xl shadow-xl"
              />
              {product.is_new && (
                <div className="absolute top-4 left-4">
                  <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Новинка
                  </div>
                </div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {product.name}
                </h1>
                <div className="flex items-center space-x-4">
                  <span className="text-2xl font-bold text-purple-600">
                    {product.price.toLocaleString('ru-RU')} ₽
                  </span>
                  <span className="text-sm text-gray-500">
                    <ShoppingBag className="w-4 h-4 inline mr-1" />
                    {product.category}
                  </span>
                </div>
              </div>

              <div className="prose prose-purple">
                <p className="text-gray-600">{product.description}</p>
              </div>

              {product.specs && product.specs.length > 0 && (
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h2 className="text-lg font-semibold mb-4">Характеристики</h2>
                  <div className="space-y-3">
                    {product.specs.map((spec, index) => (
                      <div key={index} className="flex items-center text-gray-600">
                        <Package className="w-5 h-5 text-purple-500 mr-3" />
                        <span>{spec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <ProductCard {...product} />
            </motion.div>
          </div>

          {relatedProducts && relatedProducts.length > 1 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">
                Похожие товары
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedProducts
                  .filter(p => p.id !== product.id)
                  .slice(0, 3)
                  .map(product => (
                    <ProductCard key={product.id} {...product} />
                  ))}
              </div>
            </div>
          )}

          <div className="mt-16 bg-white rounded-2xl shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Информация о скидках и акциях</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Как применяются скидки?</h3>
                <p className="text-gray-600">
                  На товар могут действовать два типа скидок:
                  <ul className="list-disc ml-6 mt-2 space-y-2">
                    <li>Персональная скидка на товар</li>
                    <li>Скидка категории, в которой находится товар</li>
                  </ul>
                  При наличии обеих скидок применяется наибольшая.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Срок действия скидок</h3>
                <p className="text-gray-600">
                  Каждая акция имеет ограниченный срок действия. Текущая цена со скидкой действительна только 
                  в пределах указанного периода. После окончания акции цена вернется к стандартной.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Условия применения скидок</h3>
                <p className="text-gray-600">
                  Скидки применяются автоматически при оформлении заказа. Для получения скидки не требуется 
                  дополнительных действий или промокодов. Скидка отображается сразу в карточке товара.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Дополнительные условия</h3>
                <p className="text-gray-600">
                  Акции и скидки не суммируются с другими специальными предложениями. Администрация оставляет 
                  за собой право изменять условия акций и срок их проведения.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}