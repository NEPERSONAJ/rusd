import React, { useState, useRef } from 'react';
import { useCategories } from '../../hooks/useCategories';
import { Category } from '../../types';
import { Search, ChevronRight, ChevronDown, Upload, Loader2 } from 'lucide-react';
import { AICategoryGenerator } from './AiCategoryGenerator';
import { imageService } from '../../lib/services/imageService';
import { WatermarkSettings } from './WatermarkSettings';
import toast from 'react-hot-toast';

interface CategoryTreeNode extends Category {
  children: CategoryTreeNode[];
  level: number;
}

interface CategoryFormProps {
  initialData?: Category;
  onSubmit: (data: Omit<Category, 'id'>) => Promise<void>;
  onCancel: () => void;
}

export function CategoryForm({ initialData, onSubmit, onCancel }: CategoryFormProps) {
  const { categories } = useCategories();
  const [searchTerm, setSearchTerm] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const getDescendantIds = (id: string): string[] => {
    const children = categories.filter(c => c.parent_id === id);
    return [id, ...children.flatMap(c => getDescendantIds(c.id))];
  };

  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    image: initialData?.image || '',
    processed_image: initialData?.processed_image || '',
    slug: initialData?.slug || '',
    parent_id: initialData?.parent_id || null,
    level: initialData?.level || 0,
    discount_enabled: initialData?.discount_enabled || false,
    discount_percentage: initialData?.discount_percentage || 0,
    discount_start_date: initialData?.discount_start_date 
      ? new Date(initialData.discount_start_date).toISOString().slice(0, 16) 
      : '',
    discount_end_date: initialData?.discount_end_date 
      ? new Date(initialData.discount_end_date).toISOString().slice(0, 16) 
      : '',
    seo_title: initialData?.seo_title || '',
    seo_description: initialData?.seo_description || '',
    seo_keywords: initialData?.seo_keywords || '',
    og_title: initialData?.og_title || '',
    og_description: initialData?.og_description || '',
    og_image: initialData?.og_image || '',
    schema_markup: initialData?.schema_markup || '',
    canonical_url: initialData?.canonical_url || '',
    robots_meta: initialData?.robots_meta || 'index, follow',
    watermark_enabled: Boolean(initialData?.watermark_image),
    watermark_image: initialData?.watermark_image || '',
    watermark_position: initialData?.watermark_position || 'top-right',
    watermark_opacity: initialData?.watermark_opacity || 0.5,
    watermark_size: initialData?.watermark_size || 0.2
  });

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const imageUrl = await imageService.upload(file);
      setFormData(prev => ({ ...prev, image: imageUrl }));

      // If watermark is enabled, automatically process the image
      if (formData.watermark_enabled && formData.watermark_image) {
        const processedUrl = await imageService.applyWatermark(imageUrl, {
          enabled: true,
          image: formData.watermark_image,
          position: formData.watermark_position,
          opacity: formData.watermark_opacity,
          size: formData.watermark_size
        });
        setFormData(prev => ({ ...prev, processed_image: processedUrl }));
      }

      toast.success('Изображение успешно загружено');
    } catch (error) {
      toast.error('Ошибка при загрузке изображения');
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleWatermarkSettingsChange = async (newSettings: {
    enabled: boolean;
    image: string;
    position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
    opacity: number;
    size: number;
  }) => {
    setFormData(prev => ({
      ...prev,
      watermark_enabled: newSettings.enabled,
      watermark_image: newSettings.image,
      watermark_position: newSettings.position,
      watermark_opacity: newSettings.opacity,
      watermark_size: newSettings.size
    }));
    
    // If we have both main image and watermark, process the image
    if (newSettings.enabled && formData.image && newSettings.image) {
      try {
        const processedUrl = await imageService.applyWatermark(formData.image, newSettings);
        setFormData(prev => ({ ...prev, processed_image: processedUrl }));
      } catch (error) {
        console.error('Error processing watermark:', error);
        toast.error('Ошибка при обработке водяного знака');
      }
    }
  };

  const handlePreview = async (processedImageUrl: string) => {
    setFormData(prev => ({ ...prev, processed_image: processedImageUrl }));
  };

  const buildCategoryTree = (parentId: string | null = null, level: number = 0): CategoryTreeNode[] => {
    return categories
      .filter(cat => cat.parent_id === parentId)
      .map(cat => ({
        ...cat,
        level,
        children: buildCategoryTree(cat.id, level + 1)
      }));
  };

  const categoryTree = buildCategoryTree();

  const filterTree = (tree: CategoryTreeNode[], term: string): CategoryTreeNode[] => {
    return tree.map(node => ({
      ...node,
      children: filterTree(node.children, term)
    })).filter(node =>
      node.name.toLowerCase().includes(term.toLowerCase()) ||
      node.children.length > 0
    );
  };

  const filteredTree = searchTerm ? filterTree(categoryTree, searchTerm) : categoryTree;

  const toggleNode = (id: string) => {
    setExpandedNodes(prev => new Set(
      prev.has(id) ? 
        Array.from(prev).filter(nodeId => nodeId !== id) : 
        [...prev, id]
    ));
  };

  const renderCategoryNode = (node: CategoryTreeNode) => {
    const isExpanded = expandedNodes.has(node.id);
    const hasChildren = node.children.length > 0;
    const isSelected = formData.parent_id === node.id;
    const isDisabled = initialData && (
      initialData.id === node.id ||
      getDescendantIds(initialData.id).includes(node.id)
    );

    return (
      <div key={node.id} style={{ marginLeft: `${node.level * 20}px` }}>
        <div
          className={`flex items-center p-2 rounded-lg transition-colors ${
            isSelected ? 'bg-purple-50' : 'hover:bg-gray-50'
          } ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          <button
            type="button"
            className={`p-1 rounded-full hover:bg-gray-200 mr-1 transition-colors ${!hasChildren && 'invisible'}`}
            onClick={(e) => {
              e.stopPropagation();
              if (hasChildren) {
                toggleNode(node.id);
              }
            }}
          >
            {isExpanded ? (
              <ChevronDown className="w-4 h-4 text-purple-600" />
            ) : (
              <ChevronRight className="w-4 h-4 text-purple-600" />
            )}
          </button>
          <div
            className="flex items-center flex-1 cursor-pointer"
            onClick={() => {
              if (!isDisabled) {
                setFormData(prev => ({ ...prev, parent_id: node.id }));
              }
            }}
          >
            <img
              src={node.processed_image || node.image}
              alt={node.name}
              className="w-6 h-6 rounded object-cover mr-2"
            />
            <span className={`text-sm ${isSelected ? 'font-medium text-purple-600' : 'text-gray-700'}`}>
              {node.name}
            </span>
          </div>
        </div>
        {isExpanded && hasChildren && (
          <div className="mt-1 border-l-2 border-purple-100 ml-3">
            {node.children.map(child => renderCategoryNode(child))}
          </div>
        )}
      </div>
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const submitData = {
      ...formData,
      name: formData.name.trim(),
      description: formData.description.trim(),
      image: formData.image.trim(),
      slug: formData.slug.trim(),
      parent_id: formData.parent_id,
      discount_enabled: Boolean(formData.discount_enabled),
      discount_percentage: formData.discount_enabled ? Number(formData.discount_percentage) : null,
      discount_start_date: formData.discount_enabled && formData.discount_start_date ? 
        new Date(formData.discount_start_date).toISOString() : null,
      discount_end_date: formData.discount_enabled && formData.discount_end_date ? 
        new Date(formData.discount_end_date).toISOString() : null
    };

    try {
      await onSubmit(submitData);
    } catch (error) {
      console.error('Error submitting category:', error);
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-zа-яё0-9\s]/g, '')
      .replace(/\s+/g, '-');
  };

  const handleNameChange = (name: string) => {
    setFormData(prev => ({
      ...prev,
      name,
      slug: generateSlug(name)
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <AICategoryGenerator
        onGenerated={(data) => {
          setFormData(prev => ({
            ...prev,
            ...data
          }));
        }}
        isGenerating={isGenerating}
        setIsGenerating={setIsGenerating}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Название</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => handleNameChange(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-500 focus:ring-purple-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Описание</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          rows={3}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-500 focus:ring-purple-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Изображение</label>
        <div className="flex items-center space-x-4">
          {formData.image && (
            <img
              src={formData.processed_image || formData.image}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg"
            />
          )}
          <div className="flex-1">
            <input
              type="text"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-500 focus:ring-purple-500"
              placeholder="URL изображения"
              required
            />
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
          >
            {uploading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Upload className="w-5 h-5" />
            )}
            <span>{uploading ? 'Загрузка...' : 'Загрузить'}</span>
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">URL-slug</label>
        <input
          type="text"
          value={formData.slug}
          onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-500 focus:ring-purple-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Родительская категория (опционально)</label>
        <div className="mt-1 border border-gray-300 rounded-lg overflow-hidden shadow-sm">
          <div className="p-2 border-b bg-gray-50">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Поиск категории..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-md border border-gray-300 focus:ring-purple-500 focus:border-purple-500 text-sm transition-colors"
              />
            </div>
          </div>
          <div className="max-h-[400px] overflow-y-auto p-2 category-tree-scroll">
            <div
              className={`flex items-center p-2 rounded-lg transition-colors ${
                !formData.parent_id ? 'bg-purple-50' : 'hover:bg-gray-50'
              } cursor-pointer mb-2`}
              onClick={() => setFormData(prev => ({ ...prev, parent_id: null }))}
            >
              <div className="w-6" />
              <span className={`text-sm ${!formData.parent_id ? 'font-medium text-purple-600' : 'text-gray-700'}`}>
                Нет (основная категория)
              </span>
            </div>
            {filteredTree.map(node => renderCategoryNode(node))}
          </div>
        </div>
      </div>

      <div className="space-y-4 border-t pt-4 mt-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="discount_enabled"
            checked={formData.discount_enabled}
            onChange={(e) => setFormData(prev => ({ ...prev, discount_enabled: e.target.checked }))}
            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
          />
          <label htmlFor="discount_enabled" className="ml-2 block text-sm text-gray-700">
            Включить акцию для категории
          </label>
        </div>

        {formData.discount_enabled && (
          <div className="space-y-4 pl-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Процент скидки (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={formData.discount_percentage}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  discount_percentage: parseFloat(e.target.value)
                }))}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-500 focus:ring-purple-500"
                required={formData.discount_enabled}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Дата начала акции
              </label>
              <input
                type="datetime-local"
                value={formData.discount_start_date}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  discount_start_date: e.target.value
                }))}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-500 focus:ring-purple-500"
                required={formData.discount_enabled}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Дата окончания акции
              </label>
              <input
                type="datetime-local"
                value={formData.discount_end_date}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  discount_end_date: e.target.value
                }))}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-500 focus:ring-purple-500"
                required={formData.discount_enabled}
              />
            </div>
          </div>
        )}
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Настройки водяного знака</h3>
        <WatermarkSettings
          settings={{
            enabled: formData.watermark_enabled,
            image: formData.watermark_image,
            position: formData.watermark_position,
            opacity: formData.watermark_opacity,
            size: formData.watermark_size
          }}
          onChange={handleWatermarkSettingsChange}
          onPreview={handlePreview}
          productImage={formData.image}
        />
      </div>

      {formData.processed_image && formData.watermark_enabled && (
        <div className="border-t pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Предпросмотр с водяным знаком</h3>
          <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
            <img
              src={formData.processed_image}
              alt="Предпросмотр с водяным знаком"
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      )}

      <div className="border-t pt-6 mt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">SEO Оптимизация</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              SEO Заголовок
              <span className="text-xs text-gray-500 ml-1">(рекомендуется 50-60 символов)</span>
            </label>
            <input
              type="text"
              value={formData.seo_title}
              onChange={(e) => setFormData(prev => ({ ...prev, seo_title: e.target.value }))}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-500 focus:ring-purple-500"
              placeholder="Например: Купить молдинги в Москве | РусДекор"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              SEO Описание
              <span className="text-xs text-gray-500 ml-1">(рекомендуется 150-160 символов)</span>
            </label>
            <textarea
              value={formData.seo_description}
              onChange={(e) => setFormData(prev => ({ ...prev, seo_description: e.target.value }))}
              rows={3}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-500 focus:ring-purple-500"
              placeholder="Широкий выбор молдингов для интерьера. Высокое качество, доступные цены, быстрая доставка по России. ✓ Гарантия качества ✓ Скидки"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Ключевые слова
              <span className="text-xs text-gray-500 ml-1">(через запятую)</span>
            </label>
            <input
              type="text"
              value={formData.seo_keywords}
              onChange={(e) => setFormData(prev => ({ ...prev, seo_keywords: e.target.value }))}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-500 focus:ring-purple-500"
              placeholder="молдинги, декор, интерьер, купить молдинги"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                OG Заголовок
              </label>
              <input
                type="text"
                value={formData.og_title}
                onChange={(e) => setFormData(prev => ({ ...prev, og_title: e.target.value }))}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-500 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                OG Изображение
              </label>
              <input
                type="url"
                value={formData.og_image}
                onChange={(e) => setFormData(prev => ({ ...prev, og_image: e.target.value }))}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-500 focus:ring-purple-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              OG Описание
            </label>
            <textarea
              value={formData.og_description}
              onChange={(e) => setFormData(prev => ({ ...prev, og_description: e.target.value }))}
              rows={2}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-500 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Schema Markup (JSON-LD)
            </label>
            <textarea
              value={formData.schema_markup}
              onChange={(e) => setFormData(prev => ({ ...prev, schema_markup: e.target.value }))}
              rows={4}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-500 focus:ring-purple-500 font-mono text-sm"
              placeholder='{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Название категории",
  "description": "Описание категории"
}'
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Canonical URL
              </label>
              <input
                type="url"
                value={formData.canonical_url}
                onChange={(e) => setFormData(prev => ({ ...prev, canonical_url: e.target.value }))}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-500 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Robots Meta
              </label>
              <select
                value={formData.robots_meta}
                onChange={(e) => setFormData(prev => ({ ...prev, robots_meta: e.target.value }))}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-500 focus:ring-purple-500"
              >
                <option value="index, follow">index, follow</option>
                <option value="noindex, follow">noindex, follow</option>
                <option value="index, nofollow">index, nofollow</option>
                <option value="noindex, nofollow">noindex, nofollow</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Отмена
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
        >
          {initialData ? 'Сохранить' : 'Добавить'}
        </button>
      </div>
    </form>
  );
}
