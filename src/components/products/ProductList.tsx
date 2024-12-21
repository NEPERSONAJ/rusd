import React, { useState, useEffect } from 'react';
import { ProductCard } from './ProductCard';
import { ProductSearch } from './ProductSearch';
import { useProducts } from '../../hooks/useProducts';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

interface ProductListProps {
  category?: string;
}

const ITEMS_PER_PAGE = 9;

export function ProductList({ category }: ProductListProps) {
  const { products, loading, error } = useProducts(category);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [currentPage, setCurrentPage] = useState(1);
  const [displayError, setDisplayError] = useState<string | null>(null);

  useEffect(() => {
    if (error) {
      setDisplayError(typeof error === 'string' ? error : 'Произошла ошибка при загрузке товаров');
    } else {
      setDisplayError(null);
    }
  }, [error]);

  useEffect(() => {
    setCurrentPage(1);
  }, [category, searchTerm]);

  // Update URL when search changes
  useEffect(() => {
    if (searchTerm) {
      setSearchParams({ search: searchTerm });
    } else {
      setSearchParams({});
    }
  }, [searchTerm, setSearchParams]);

  // Filter products based on search
  const filteredProducts = products?.filter(product => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      product.name.toLowerCase().includes(search) ||
      product.description.toLowerCase().includes(search) ||
      product.specs.some(spec => spec.toLowerCase().includes(search))
    );
  }) || [];

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const clearSearch = () => {
    setSearchTerm('');
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <ProductSearch 
          value={searchTerm}
          onChange={handleSearch}
          onClear={clearSearch}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 rounded-2xl h-48 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (displayError) {
    return (
      <div className="space-y-8">
        <ProductSearch 
          value={searchTerm}
          onChange={handleSearch}
          onClear={clearSearch}
        />
        <div className="text-center py-12">
          <p className="text-red-600">{displayError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <ProductSearch 
        value={searchTerm}
        onChange={handleSearch}
        onClear={clearSearch}
      />

      {searchTerm && (
        <div className="text-center text-gray-600">
          {filteredProducts.length === 0 ? (
            <p>По запросу «{searchTerm}» ничего не найдено</p>
          ) : (
            <p>Найдено {filteredProducts.length} товаров по запросу «{searchTerm}»</p>
          )}
        </div>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={currentPage}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {currentProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <ProductCard {...product} />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-12">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {[...Array(totalPages)].map((_, index) => {
            const pageNumber = index + 1;
            const isCurrentPage = pageNumber === currentPage;
            const isNearCurrent = Math.abs(pageNumber - currentPage) <= 1;
            const isEndPage = pageNumber === 1 || pageNumber === totalPages;

            if (isNearCurrent || isEndPage) {
              return (
                <button
                  key={pageNumber}
                  onClick={() => handlePageChange(pageNumber)}
                  className={`min-w-[40px] h-10 rounded-lg border ${
                    isCurrentPage
                      ? 'bg-purple-600 text-white border-purple-600'
                      : 'border-gray-300 hover:bg-gray-50'
                  } transition-colors`}
                >
                  {pageNumber}
                </button>
              );
            }
            if (isEndPage || Math.abs(pageNumber - currentPage) === 2) {
              return (
                <span key={`ellipsis-${pageNumber}`} className="px-2">
                  ...
                </span>
              );
            }
            return null;
          })}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}
