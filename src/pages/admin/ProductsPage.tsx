import React, { useState } from 'react';
import { Layout } from '../../components/admin/Layout';
import { Plus, Pencil, Trash2, Search, Tag, Clock, ChevronRight, ChevronDown, FolderTree, ChevronLeft } from 'lucide-react';
import { ProductForm } from '../../components/admin/ProductForm';
import { useCategories } from '../../hooks/useCategories';
import { useProducts } from '../../hooks/useProducts';
import { Product } from '../../types';
import toast from 'react-hot-toast';

interface CategoryNode {
  id: string;
  name: string;
  children: CategoryNode[];
  level: number;
  parent_id: string | null;
}

const ITEMS_PER_PAGE = 10;

const isDiscountActive = (product: Product): boolean => {
  if (!product.discount_enabled) return false;
  const now = new Date();
  const startDate = product.discount_start_date ? new Date(product.discount_start_date) : null;
  const endDate = product.discount_end_date ? new Date(product.discount_end_date) : null;
  return startDate && endDate ? now >= startDate && now <= endDate : false;
};

const isCategoryDiscountActive = (product: Product): boolean => {
  if (!product.category_discount_enabled) return false;
  const now = new Date();
  const startDate = product.category_discount_start_date ? new Date(product.category_discount_start_date) : null;
  const endDate = product.category_discount_end_date ? new Date(product.category_discount_end_date) : null;
  return startDate && endDate ? now >= startDate && now <= endDate : false;
};

const calculateDiscountedPrice = (product: Product): number | null => {
  if (product.discount_enabled && isDiscountActive(product)) {
    return product.price * (1 - (product.discount_percentage || 0) / 100);
  }
  if (product.category_discount_enabled && isCategoryDiscountActive(product)) {
    return product.price * (1 - (product.category_discount_percentage || 0) / 100);
  }
  return null;
};

export function ProductsPage() {
  const { products = [], loading, error, addProduct, updateProduct, deleteProduct } = useProducts();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const { categories } = useCategories();
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  // Only show error if we have one and we're not loading
  const shouldShowError = error && !loading;

  const buildCategoryTree = (parentId: string | null = null, level: number = 0): CategoryNode[] => {
    return categories
      .filter(cat => cat.parent_id === parentId)
      .sort((a, b) => a.name.localeCompare(b.name))
      .map(cat => ({
        ...cat,
        children: buildCategoryTree(cat.id, level + 1),
        level
      }));
  };

  const categoryTree = buildCategoryTree();

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      if (next.has(categoryId)) {
        next.delete(categoryId);
      } else {
        next.add(categoryId);
      }
      return next;
    });
  };

  // Filter products based on search and category
  const filteredProducts = products.filter(product => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = !searchTerm || 
      product.name.toLowerCase().includes(searchLower) ||
      product.description.toLowerCase().includes(searchLower);
    const matchesCategory = !selectedCategory || product.category_id === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Render category tree node
  const renderCategoryNode = (node: CategoryNode) => {
    const isExpanded = expandedCategories.has(node.id);
    const hasChildren = node.children.length > 0;
    const isSelected = selectedCategory === node.id;

    return (
      <div key={node.id}>
        <div
          className={`flex items-center py-1 px-2 rounded-lg cursor-pointer ${
            isSelected ? 'bg-purple-50 text-purple-600' : 'hover:bg-gray-50'
          }`}
          style={{ paddingLeft: `${node.level * 20 + 8}px` }}
        >
          <button
            onClick={() => hasChildren && toggleCategory(node.id)}
            className={`p-1 rounded-full hover:bg-gray-200 mr-1 ${!hasChildren && 'invisible'}`}
          >
            {isExpanded ? (
              <ChevronDown className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-500" />
            )}
          </button>
          <div
            className="flex-1 flex items-center"
            onClick={() => setSelectedCategory(isSelected ? null : node.id)}
          >
            <span className={`text-sm ${isSelected ? 'font-medium' : ''}`}>
              {node.name}
            </span>
          </div>
        </div>
        {isExpanded && hasChildren && (
          <div className="ml-2">
            {node.children.map(child => renderCategoryNode(child))}
          </div>
        )}
      </div>
    );
  };

  const handleAdd = async (data: Omit<Product, 'id'>) => {
    try {
      await addProduct(data);
      setIsFormOpen(false);
      toast.success('Товар успешно добавлен');
    } catch (error) {
      toast.error('Ошибка при добавлении товара');
    }
  };

  const handleEdit = async (data: Omit<Product, 'id'>) => {
    if (!editingProduct) return;
    try {
      await updateProduct(editingProduct.id, data);
      setEditingProduct(null);
      setIsFormOpen(false);
      toast.success('Товар успешно обновлен');
    } catch (error) {
      toast.error('Ошибка при обновлении товара');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Вы уверены, что хотите удалить этот товар?')) return;
    try {
      await deleteProduct(id);
      toast.success('Товар успешно удален');
    } catch (error) {
      toast.error('Ошибка при удалении товара');
    }
  };

  return (
    <Layout>
      <div className="p-6">
        <div className="flex gap-6">
          {/* Category Tree Sidebar */}
          <div className="w-72 bg-white rounded-xl shadow-sm overflow-hidden flex-shrink-0">
            <div className="p-4 border-b flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FolderTree className="w-5 h-5 text-purple-600" />
                <h2 className="font-semibold text-gray-900">Категории</h2>
              </div>
              <button
                onClick={() => setIsCategoryMenuOpen(!isCategoryMenuOpen)}
                className="p-1 hover:bg-gray-100 rounded-lg"
              >
                {isCategoryMenuOpen ? (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-gray-500" />
                )}
              </button>
            </div>
            {isCategoryMenuOpen && (
              <div className="p-2 max-h-[calc(100vh-15rem)] overflow-y-auto category-tree-scroll">
                <div
                  className={`flex items-center py-1 px-2 rounded-lg cursor-pointer mb-2 ${
                    !selectedCategory ? 'bg-purple-50 text-purple-600' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedCategory(null)}
                >
                  <span className={`text-sm ${!selectedCategory ? 'font-medium' : ''}`}>
                    Все категории
                  </span>
                </div>
                {categoryTree.map(node => renderCategoryNode(node))}
              </div>
            )}
          </div>
          
          {/* Main Content */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900">
                {selectedCategory 
                  ? `Товары категории "${categories.find(c => c.id === selectedCategory)?.name}"`
                  : 'Все товары'}
              </h1>
              <button 
                onClick={() => setIsFormOpen(true)}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-purple-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
                <span>Добавить товар</span>
              </button>
            </div>

            {shouldShowError && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
                <p className="text-sm">
                  {error}
                  {' '}Попробуйте обновить страницу или добавьте первый товар.
                </p>
              </div>
            )}

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-4 border-b">
                <div className="relative">
                  <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Поиск товаров..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1); // Reset to first page on search
                    }}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Название
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Категория
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Цена
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Дата добавления
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Действия
                      </th>
                    </tr>
                  </thead>
                  <tbody className={`bg-white divide-y divide-gray-200 ${loading ? 'opacity-50' : ''}`}>
                    {loading ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                          Загрузка...
                        </td>
                      </tr>
                    ) : currentProducts.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-4 text-center text-gray-600">
                          Товары не найдены
                        </td>
                      </tr>
                    ) : (
                      currentProducts.map((product) => (
                        <tr key={product.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              <div className="flex items-center space-x-2">
                                {product.category_discount_enabled && isCategoryDiscountActive(product) && (
                                  <div title="Скидка категории активна">
                                    <Tag className="w-4 h-4 text-blue-500" />
                                  </div>
                                )}
                                {product.discount_enabled && (
                                  <div title={isDiscountActive(product) ? 'Активная скидка' : 'Неактивная скидка'}>
                                    <Tag className={`w-4 h-4 ${
                                      isDiscountActive(product) ? 'text-green-500' : 'text-gray-400'
                                    }`} />
                                  </div>
                                )}
                                <img
                                  src={product.image}
                                  alt={product.name}
                                  className="h-10 w-10 rounded-lg object-cover"
                                />
                                {product.name}
                                {product.discount_enabled && (
                                  <span className="ml-2 text-xs font-normal text-gray-500">
                                    -{product.discount_percentage}% 
                                    {isDiscountActive(product) && (
                                      <span className="text-green-600 ml-1">
                                        {calculateDiscountedPrice(product)?.toLocaleString('ru-RU')} ₽
                                      </span>
                                    )}
                                  </span>
                                )}
                                {!product.discount_enabled && product.category_discount_enabled && isCategoryDiscountActive(product) && (
                                  <span className="ml-2 text-xs font-normal text-gray-500">
                                    -{product.category_discount_percentage}% 
                                    <span className="text-blue-600 ml-1">
                                      {calculateDiscountedPrice(product)?.toLocaleString('ru-RU')} ₽
                                    </span>
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                              {categories.find(c => c.id === product.category_id)?.name}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {product.price.toLocaleString('ru-RU')} ₽
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(product.created_at).toLocaleDateString('ru-RU')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button 
                              onClick={() => {
                                setEditingProduct(product);
                                setIsFormOpen(true);
                              }}
                              className="text-indigo-600 hover:text-indigo-900 mr-3"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDelete(product.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-6 py-4 bg-white border-t">
                  <div className="flex items-center">
                    <p className="text-sm text-gray-700">
                      Показано {startIndex + 1}-{Math.min(endIndex, filteredProducts.length)} из {filteredProducts.length}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
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
                      className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {editingProduct ? 'Редактировать товар' : 'Добавить товар'}
            </h2>
            <ProductForm
              initialData={editingProduct || undefined}
              onSubmit={editingProduct ? handleEdit : handleAdd}
              onCancel={() => {
                setIsFormOpen(false);
                setEditingProduct(null);
              }}
            />
          </div>
        </div>
      )}
    </Layout>
  );
}
