import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Pencil, Trash2, Tag, ChevronRight, ChevronDown } from 'lucide-react';
import { Category } from '../../types';

interface SortableItemProps {
  id: string;
  category: Category & { level: number };
  onEdit: () => void;
  onDelete: () => void;
  isDiscountActive: boolean;
  hasChildren: boolean;
  isExpanded: boolean;
  onToggle: () => void;
}

export function SortableItem({ 
  id, 
  category, 
  onEdit, 
  onDelete, 
  isDiscountActive,
  hasChildren,
  isExpanded,
  onToggle
}: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ 
    id,
    data: {
      type: 'category',
      category
    }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : 1,
    position: 'relative' as const,
  };

  return (
    <tr 
      ref={setNodeRef} 
      style={style} 
      className={`${
        category.level > 0 ? 'bg-gray-50/50' : ''
      } hover:bg-gray-50 transition-colors duration-200`}
    >
      <td className="pl-4">
        <button
          className="p-1 hover:bg-gray-100 rounded cursor-grab active:cursor-grabbing transition-colors"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="w-4 h-4 text-gray-400" />
        </button>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center">
          {category.level > 0 && (
            <div className="flex items-center" style={{ width: `${category.level * 24}px` }}>
              {Array(category.level).fill('').map((_, i) => (
                <div key={i} className="w-6 text-gray-400">│</div>
              ))}
              <div className="w-6 text-gray-400">└─</div>
            </div>
          )}
          {hasChildren && (
            <button
              onClick={onToggle}
              className="mr-2 p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-500" />
              )}
            </button>
          )}
          {category.discount_enabled && (
            <div className="mr-2" title={isDiscountActive ? 'Активная скидка' : 'Неактивная скидка'}>
              <Tag className={`w-4 h-4 ${
                isDiscountActive ? 'text-green-500' : 'text-gray-400'
              }`} />
            </div>
          )}
          <img
            src={category.image}
            alt={category.name}
            className="h-10 w-10 rounded-lg object-cover ml-2"
          />
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900 flex items-center">
              {category.name}
              {category.discount_enabled && (
                <span className="ml-2 text-xs font-normal text-gray-500">
                  -{category.discount_percentage}%
                </span>
              )}
            </div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 text-sm text-gray-500">{category.slug}</td>
      <td className="px-6 py-4 text-sm text-gray-500">{category.description}</td>
      <td className="px-6 py-4 text-right text-sm font-medium space-x-2">
        <button onClick={onEdit} className="text-purple-600 hover:text-purple-900 transition-colors">
          <Pencil className="w-5 h-5" />
        </button>
        <button onClick={onDelete} className="text-red-600 hover:text-red-900 transition-colors">
          <Trash2 className="w-5 h-5" />
        </button>
      </td>
    </tr>
  );
}

