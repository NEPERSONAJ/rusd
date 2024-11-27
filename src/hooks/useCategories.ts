import { useState, useEffect } from 'react';
import { Category, CategoryInput } from '../lib/types';
import { categoryService } from '../lib/services/categoryService';
import toast from 'react-hot-toast';

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await categoryService.getAll();
      // Сортируем категории по позиции и имени
      const sortedData = data.sort((a, b) => {
        const posA = a.position || 0;
        const posB = b.position || 0;
        if (posA === posB) {
          return a.name.localeCompare(b.name);
        }
        return posA - posB;
      });
      setError(null);
      setCategories(sortedData);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Ошибка при загрузке категорий';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const addCategory = async (category: CategoryInput) => {
    try {
      console.log('Adding category in hook:', category);
      const newCategory = await categoryService.create(category);
      console.log('New category created:', newCategory);
      setCategories(prev => [...prev, newCategory].sort((a, b) => (a.position || 0) - (b.position || 0)));
      toast.success('Категория успешно добавлена');
      return newCategory;
    } catch (err) {
      console.error('Error in addCategory hook:', err);
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
      // Обновляем локальное состояние
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

  return {
    categories,
    loading,
    error,
    addCategory,
    updateCategory,
    updateCategoryPositions,
    deleteCategory,
    refreshCategories: fetchCategories
  };
}
