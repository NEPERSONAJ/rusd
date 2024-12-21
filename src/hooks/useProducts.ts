import { useState, useEffect } from 'react';
import { Product, ProductInput } from '../lib/types';
import { productService } from '../lib/services/productService';
import { useCategories } from './useCategories';
import toast from 'react-hot-toast';

export function useProducts(category?: string) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, [category]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError('');
      let data;
      if (category) {
        data = await productService.getByCategory(category);
      } else {
        data = await productService.getAll();
      }
      setProducts(data || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка при загрузке товаров';
      setError(errorMessage);
      // Only show toast for actual errors, not empty states
      if (errorMessage !== 'No products found') {
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async (product: ProductInput) => {
    try {
      const newProduct = await productService.create(product);
      setProducts(prev => [newProduct, ...prev]);
      toast.success('Товар успешно добавлен');
      return newProduct;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Ошибка при добавлении товара';
      toast.error(message);
      throw err;
    }
  };

  const updateProduct = async (id: string, updates: Partial<ProductInput>) => {
    try {
      const updatedProduct = await productService.update(id, updates);
      setProducts(prev => prev.map(p => p.id === id ? updatedProduct : p));
      toast.success('Товар успешно обновлен');
      return updatedProduct;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Ошибка при обновлении товара';
      toast.error(message);
      throw err;
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await productService.delete(id);
      setProducts(prev => prev.filter(p => p.id !== id));
      toast.success('Товар успешно удален');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Ошибка при удалении товара';
      toast.error(message);
      throw err;
    }
  };

  return {
    products,
    loading,
    error,
    addProduct,
    updateProduct,
    deleteProduct,
    refreshProducts: fetchProducts
  };
}