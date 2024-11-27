import React, { useState } from 'react';
import { Layout } from '../../components/admin/Layout';
import { Plus, Search, Tag, Clock, ChevronRight, ChevronDown } from 'lucide-react';
import { CategoryForm } from '../../components/admin/CategoryForm';
import { useCategories } from '../../hooks/useCategories';
import { Category } from '../../types';
import toast from 'react-hot-toast';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  defaultDropAnimation,
  MeasuringStrategy
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { SortableItem } from './SortableItem';

const isDiscountActive = (category: Category): boolean => {
  if (!category.discount_enabled) return false;
  const now = new Date();
  const startDate = category.discount_start_date ? new Date(category.discount_start_date) : null;
  const endDate = category.discount_end_date ? new Date(category.discount_end_date) : null;
  return startDate && endDate ? now >= startDate && now <= endDate : false;
};

export function CategoriesPage() {
  const { categories, loading, addCategory, updateCategory, deleteCategory, updateCategoryPositions } = useCategories();
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      }
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Get all descendant category IDs for a given category
  const getDescendantIds = (categoryId: string): string[] => {
    const descendants: string[] = [];
    const getChildren = (parentId: string) => {
      const children = categories.filter(c => c.parent_id === parentId);
      children.forEach(child => {
        descendants.push(child.id);
        getChildren(child.id);
      });
    };
    getChildren(categoryId);
    return descendants;
  };

  // Build category tree
  const buildCategoryTree = (parentId: string | null = null, level: number = 0): (Category & { children: any[] })[] => {
    return categories
      .filter(cat => cat.parent_id === parentId)
      .sort((a, b) => (a.position || 0) - (b.position || 0))
      .map(category => {
        const node = {
          ...category,
          level
        };
        const children = buildCategoryTree(category.id, level + 1);
        return { ...node, children };
      });
  };

  // Flatten tree for display while maintaining hierarchy information
  const flattenCategoryTree = (tree: any[]): (Category & { level: number })[] => {
    const flattened: Category[] = [];
    const flatten = (nodes: any[], level: number) => {
      nodes.forEach(node => {
        const { children, ...categoryData } = node;
        flattened.push({ ...categoryData, level });
        // Only include children if the category is expanded
        if (expandedCategories.has(node.id) && children.length > 0) {
          flatten(children, level + 1);
        }
      });
    };
    flatten(tree, 0);
    return flattened;
  };

  const categoryTree = buildCategoryTree();
  const flattenedCategories = flattenCategoryTree(categoryTree);

  // Filter categories based on search term
  const filteredCategories = searchTerm
    ? flattenedCategories.filter(category =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : flattenedCategories;

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

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    
    if (!over || active.id === over.id) {
      return;
    }

    const activeCategory = categories.find(c => c.id === active.id);
    if (!activeCategory) return;

    const descendantIds = getDescendantIds(activeCategory.id);
    
    const oldIndex = filteredCategories.findIndex(cat => cat.id === active.id);
    const newIndex = filteredCategories.findIndex(cat => cat.id === over.id);
    
    if (oldIndex !== -1 && newIndex !== -1) {
      const newOrder = [...filteredCategories];
      const [movedCategory] = newOrder.splice(oldIndex, 1);
      newOrder.splice(newIndex, 0, movedCategory);

      if (descendantIds.length > 0) {
        const descendants = filteredCategories.filter(cat => descendantIds.includes(cat.id));
        descendants.forEach(desc => {
          const descIndex = newOrder.findIndex(cat => cat.id === desc.id);
          if (descIndex !== -1) {
            const [movedDesc] = newOrder.splice(descIndex, 1);
            const parentIndex = newOrder.findIndex(cat => cat.id === movedCategory.id);
            newOrder.splice(parentIndex + 1, 0, movedDesc);
          }
        });
      }

      const updates = newOrder.map((category, index) => ({
        id: category.id,
        position: index
      }));
      
      updateCategoryPositions(updates).catch(error => {
        toast.error('Ошибка при обновлении позиций категорий');
        console.error('Error updating positions:', error);
      });
    }
  };

  const handleAdd = async (data: Omit<Category, 'id'>) => {
    try {
      await addCategory(data);
      setIsFormOpen(false);
      toast.success('Категория успешно добавлена');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Ошибка при добавлении категории';
      toast.error(message);
    }
  };

  const handleEdit = async (data: Omit<Category, 'id'>) => {
    if (!editingCategory) return;
    try {
      await updateCategory(editingCategory.id, data);
      setEditingCategory(null);
      setIsFormOpen(false);
      toast.success('Категория успешно обновлена');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Ошибка при обновлении категории';
      toast.error(message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Вы уверены, что хотите удалить эту категорию?')) return;
    try {
      await deleteCategory(id);
      toast.success('Категория успешно удалена');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Ошибка при удалении категории';
      toast.error(message);
    }
  };

  return (
    <Layout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Управление категориями</h1>
          <button
            onClick={() => setIsFormOpen(true)}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-purple-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Добавить категорию</span>
          </button>
        </div>

        {(isFormOpen || editingCategory) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-bold mb-4">
                {editingCategory ? 'Редактировать категорию' : 'Добавить категорию'}
              </h2>
              <CategoryForm
                initialData={editingCategory || undefined}
                onSubmit={editingCategory ? handleEdit : handleAdd}
                onCancel={() => {
                  setIsFormOpen(false);
                  setEditingCategory(null);
                }}
              />
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Поиск категорий..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="w-8"></th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Название
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Slug
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Описание
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Действия
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                      Загрузка...
                    </td>
                  </tr>
                ) : filteredCategories.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                      Категории не найдены
                    </td>
                  </tr>
                ) : (
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    measuring={{
                      droppable: {
                        strategy: MeasuringStrategy.Always
                      }
                    }}
                  >
                    <SortableContext
                      items={filteredCategories.map(cat => cat.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      {filteredCategories.map((category) => (
                        <SortableItem
                          key={category.id}
                          id={category.id}
                          category={category}
                          onEdit={() => setEditingCategory(category)}
                          onDelete={() => handleDelete(category.id)}
                          isDiscountActive={isDiscountActive(category)}
                          hasChildren={categories.some(c => c.parent_id === category.id)}
                          isExpanded={expandedCategories.has(category.id)}
                          onToggle={() => toggleCategory(category.id)}
                        />
                      ))}
                    </SortableContext>
                  </DndContext>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}
