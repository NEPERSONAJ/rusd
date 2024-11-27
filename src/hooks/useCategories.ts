// src/hooks/useCategories.ts
import { useState, useEffect } from 'react';
import { Category, CategoryInput } from '../lib/types';
import { categoryService } from '../lib/services/categoryService';
import toast from 'react-hot-toast';

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;

  useEffect(() => {
    let mounted = true;
    let retryTimeout: NodeJS.Timeout;

    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await categoryService.getAll();
        
        if (mounted) {
          // Сортируем категории по позиции и имени
          const sortedData = data.sort((a, b) => {
            const posA = a.position || 0;
            const posB = b.position || 0;
            if (posA === posB) {
              return a.name.localeCompare(b.name);
            }
            return posA - posB;
          });
          setCategories(sortedData);
          setRetryCount(0); // Сбрасываем счетчик при успешной загрузке
        }
      } catch (err) {
        if (mounted) {
          const message = err instanceof Error ? err.message : 'Ошибка при загрузке категорий';
          setError(message);
          
          // Пробуем повторить загрузку, если не превышен лимит попыток
          if (retryCount < MAX_RETRIES) {
            retryTimeout = setTimeout(() => {
              setRetryCount(prev => prev + 1);
              fetchCategories();
            }, Math.min(1000 * Math.pow(2, retryCount), 10000)); // Экспоненциальная задержка
          } else {
            toast.error('Не удалось загрузить категории. Пожалуйста, обновите страницу.');
          }
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchCategories();

    return () => {
      mounted = false;
      if (retryTimeout) {
        clearTimeout(retryTimeout);
      }
    };
  }, [retryCount]);

  const addCategory = async (category: CategoryInput) => {
    try {
      const newCategory = await categoryService.create(category);
      setCategories(prev => [...prev, newCategory].sort((a, b) => (a.position || 0) - (b.position || 0)));
      toast.success('Категория успешно добавлена');
      return newCategory;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Ошибка при добавлении категории';
      toast.error(message);
      throw err;
    }
  };

  const updateCategory = async (id: string, updates: Partial<CategoryInput>) => {
    try {
      const updatedCategory = await categoryService.update(id, updates);
      setCategories(prev => prev.map(c => c.id === id ? updatedCategory : c));
      toast.success('Категория успешно обновлена');
      return updatedCategory;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Ошибка при обновлении категории';
      toast.error(message);
      throw err;
    }
  };

  const updateCategoryPositions = async (updates: { id: string; position: number }[]) => {
    try {
      await categoryService.updatePositions(updates);
      setCategories(prev => {
        const newCategories = [...prev];
        updates.forEach(update => {
          const index = newCategories.findIndex(c => c.id === update.id);
          if (index !== -1) {
            newCategories[index] = { ...newCategories[index], position: update.position };
          }
        });
        return newCategories.sort((a, b) => (a.position || 0) - (b.position || 0));
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Ошибка при обновлении позиций';
      toast.error(message);
      throw err;
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      await categoryService.delete(id);
      setCategories(prev => prev.filter(c => c.id !== id));
      toast.success('Категория успешно удалена');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Ошибка при удалении категории';
      toast.error(message);
      throw err;
    }
  };

  const retryLoading = () => {
    setRetryCount(0); // Сбрасываем счетчик и начинаем загрузку заново
  };

  return {
    categories,
    loading,
    error,
    addCategory,
    updateCategory,
    updateCategoryPositions,
    deleteCategory,
    retryLoading,
    refreshCategories: () => setRetryCount(0)
  };
}
