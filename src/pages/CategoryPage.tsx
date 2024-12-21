import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ProductList } from '../components/products/ProductList';
import { useProducts } from '../hooks/useProducts';
import { useCategories } from '../hooks/useCategories';
import { Link } from 'react-router-dom';
import { SEO } from '../components/SEO';

const CategoryPage = () => {
  const { categoryId = '' } = useParams();
  const navigate = useNavigate();
  const { categories, loading } = useCategories();
  const { products, error: productsError } = useProducts();
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('');
  const category = categories.find(c => c.slug === categoryId);

  useEffect(() => {
    if (productsError) {
      toast.error('Не удалось загрузить товары. Пожалуйста, попробуйте позже.');
    }
  }, [productsError]);

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
  const getSubcategoryProductCount = (categoryId: string): number => {
    const categoryIds = getDescendantCategoryIds(categoryId);
    return products.filter(product => categoryIds.includes(product.category_id)).length;
  };

  // Get parent categories path for breadcrumbs
  const getBreadcrumbs = () => {
    const breadcrumbs = [];
    let currentCategory = category;

    while (currentCategory) {
      breadcrumbs.unshift(currentCategory);
      currentCategory = categories.find(c => c.id === currentCategory.parent_id);
    }

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();
  const subcategories = categories.filter(c => c.parent_id === category?.id);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-gray-200 rounded-lg w-48" />
            <div className="h-12 bg-gray-200 rounded-lg w-3/4" />
            <div className="h-8 bg-gray-200 rounded-lg w-1/2" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="aspect-video bg-gray-200 rounded-2xl mb-4" />
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!loading && !category && !productsError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Категория не найдена или была удалена
          </h1>
          <p className="mt-4 text-gray-600">
            Вернуться к <Link to="/catalog" className="text-purple-600 hover:text-purple-700">каталогу</Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO
        title={category.seo_title || `${category.name} | РусДекор`}
        description={category.seo_description || category.description}
        image={category.og_image || category.processed_image || category.image}
      />
      
      {/* Schema Markup */}
      {category.schema_markup && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: category.schema_markup }}
        />
      )}
      
      {/* Canonical URL */}
      {category.canonical_url && (
        <link rel="canonical" href={category.canonical_url} />
      )}
      
      {/* Meta Robots */}
      {category.robots_meta && (
        <meta name="robots" content={category.robots_meta} />
      )}
      
      {/* Meta Keywords */}
      {category.seo_keywords && (
        <meta name="keywords" content={category.seo_keywords} />
      )}
      
      {/* Open Graph Tags */}
      {category.og_title && (
        <meta property="og:title" content={category.og_title} />
      )}
      {category.og_description && (
        <meta property="og:description" content={category.og_description} />
      )}

      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 pt-16 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
            <Link to="/" className="hover:text-purple-600">Главная</Link>
            {breadcrumbs.map((item, index) => (
              <React.Fragment key={item.id}>
                <span className="text-gray-400">/</span>
                <Link
                  to={`/category/${item.slug}`}
                  className={`${
                    index === breadcrumbs.length - 1
                      ? 'text-purple-600 font-medium'
                      : 'hover:text-purple-600'
                  }`}
                >
                  {item.name}
                </Link>
              </React.Fragment>
            ))}
          </nav>

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{category.name}</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              {category.description}
            </p>
            {category.processed_image && (
              <div className="relative aspect-video max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-xl mb-8">
                <img
                  src={category.processed_image}
                  alt={category.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </motion.div>

          {/* Mobile Subcategories Dropdown */}
          {subcategories.length > 0 && (
            <div className="md:hidden mb-8">
              <select
                onChange={(e) => {
                  const value = e.target.value;
                  if (value) {
                    navigate(`/category/${value}`);
                  }
                }}
                value={selectedSubcategory}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="" disabled>Выберите подкатегорию</option>
                {subcategories.map((subcat) => (
                  <option key={subcat.id} value={subcat.slug}>
                    {`${subcat.name} (${getSubcategoryProductCount(subcat.id)})`}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Desktop Subcategories */}
          {subcategories.length > 0 && (
            <div className="hidden md:block mb-12">
              <div className="bg-white rounded-2xl shadow-sm p-4">
                <div className="flex flex-wrap gap-2">
                  {subcategories.map((subcat) => (
                    <Link
                      key={subcat.id}
                      to={`/category/${subcat.slug}`}
                      className="group flex-shrink-0 px-4 py-2 rounded-xl bg-gray-50 hover:bg-purple-50 transition-all duration-300"
                    >
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-700 group-hover:text-purple-600 font-medium transition-colors">
                          {subcat.name}
                          <span className="ml-2 bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full text-xs font-semibold">
                            {getSubcategoryProductCount(subcat.id)}
                          </span>
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}

          <ProductList category={category.slug} />
        </div>
      </div>
    </>
  );
};

export default CategoryPage;
