import React, { useState, useRef } from 'react';
import { Wand2, Upload, Loader2, Tag as TagIcon, X } from 'lucide-react';
import { BlogPost } from '../../lib/types';
import { imageService } from '../../lib/services/imageService';
import toast from 'react-hot-toast';

interface BlogPostFormProps {
  initialData?: BlogPost;
  onSubmit: (data: Partial<BlogPost>) => Promise<void>;
  onCancel: () => void;
}

async function generateContent(topic: string, type: 'title' | 'meta_title' | 'meta_description' | 'content' | 'tags') {
  const prompts = {
    title: 'Создай привлекательный заголовок для статьи на тему:',
    meta_title: 'Создай SEO-оптимизированный META заголовок (до 60 символов) для статьи:',
    meta_description: 'Создай привлекательное META описание (до 160 символов) для статьи:',
    content: `Ты — эксперт в создании SEO-оптимизированного контента для блогов. Напиши профессиональный текст для статьи на тему: "${topic}". Соблюдай следующие правила:

1. Структура текста:
   - Начни с engaging-заголовка, чтобы зацепить читателя.
   - Добавь привлекательный вводный абзац, объясняющий суть темы.
   - Используй подзаголовки <h2> и <h3>, чтобы разбить текст на логичные блоки.
   - Включи списки <ul> и <li>, если это уместно для темы.
   - Заверши статью выводом или кратким резюме.

2. Форматирование текста:
   - Для акцентов используй <strong> для ключевых слов и <em> для важных терминов.
   - Для новых строк используй <br>.

3. SEO-оптимизация:
   - Включи ключевые фразы из темы в заголовки и текст.
   - Используй естественные подзаголовки, которые содержат вариации ключевых фраз.
   - Напиши текст для людей, но с учетом поисковых систем: избегай переоптимизации и повторов.

4. Тон и стиль:
   - Пиши просто, но профессионально, избегая сложных терминов, если это не требуется.
   - Не добавляй ненужный код, излишние фразы или воду.
   - Убедись, что статья информативна, полезна и легко читаема.

5. Объем:
   - Длина статьи должна быть адекватной теме: от 500 до 1500 слов.

Начинай писать контент как профессионал, чтобы он был полезным и легко читался.`,
  tags: 'Создай список из 5-7 релевантных тегов для статьи, разделенных запятой:'

  };

  try {
    const response = await fetch('https://api.typegpt.net/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer sk-K8UFZvz7K59xvk8EoUfF0fC9x8Op4QbTP1HFcDost0qMi1Y0'
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'You are a professional content writer for a luxury interior design and decor company. Create engaging content that showcases expertise in interior design and decor.'
          },
          {
            role: 'user',
            content: `${prompts[type]} ${topic}`
          }
        ]
      })
    });

    const data = await response.json();
    let content = data.choices[0].message.content.trim();
    
    // Если это теги, преобразуем их в массив
    if (type === 'tags') {
      const tagArray = content.split(',').map(tag => tag.trim());
      return JSON.stringify(tagArray);
    }
    
    // Удаляем кавычки из заголовков
    if (type === 'title' || type === 'meta_title') {
      content = content.replace(/^["']|["']$/g, '');
    }
    
    return content;
  } catch (error) {
    console.error('Error generating content:', error);
    throw error;
  }
}

export function BlogPostForm({ initialData, onSubmit, onCancel }: BlogPostFormProps) {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    content: initialData?.content || '',
    excerpt: initialData?.excerpt || '',
    image: initialData?.image || '',
    author: initialData?.author || '',
    is_published: initialData?.is_published || false,
    meta_title: initialData?.meta_title || '',
    meta_description: initialData?.meta_description || '',
    tags: initialData?.tags || [],
    tagInput: ''
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [currentField, setCurrentField] = useState<'title' | 'meta_title' | 'meta_description' | 'content' | 'tags' | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const imageUrl = await imageService.upload(file);
      setFormData(prev => ({ ...prev, image: imageUrl }));
      toast.success('Изображение успешно загружено');
    } catch (error) {
      toast.error('Ошибка при загрузке изображения');
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  const generateSequentially = async (topic: string) => {
    const fields: ('title' | 'meta_title' | 'meta_description' | 'content' | 'tags')[] = [
      'title', 'meta_title', 'meta_description', 'content', 'tags'
    ];

    for (const field of fields) {
      try {
        setCurrentField(field);
        const content = await generateContent(topic, field);
        
        if (field === 'tags') {
          setFormData(prev => ({
            ...prev,
            tags: JSON.parse(content)
          }));
        } else {
          setFormData(prev => ({
            ...prev,
            [field]: content
          }));
        }

        if (field === 'meta_description') {
          setFormData(prev => ({
            ...prev,
            excerpt: content
          }));
        }

        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        toast.error(`Ошибка при генерации ${field}`);
        break;
      }
    }
    setCurrentField(null);
    setIsGenerating(false);
    toast.success('Генерация контента завершена');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Создаем slug из заголовка
    const slug = formData.title
      .toLowerCase()
      .replace(/[^a-zа-яё0-9\s]/g, '')
      .replace(/\s+/g, '-');
    
    const postData = {
      ...formData,
      slug,
      tags: formData.tags,
      published_at: formData.is_published ? new Date().toISOString() : null
    };

    await onSubmit(postData);
  };

  const addTag = () => {
    if (formData.tagInput.trim()) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, prev.tagInput.trim()],
        tagInput: ''
      }));
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleTagInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Заголовок</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-500 focus:ring-purple-500"
            required
          />
          <button
            type="button"
            onClick={() => {
              setIsGenerating(true);
              generateSequentially(formData.title);
            }}
            disabled={isGenerating}
            className={`mt-1 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 transition-all`}
          >
            <Wand2 className="w-4 h-4 mr-2" />
            {isGenerating ? 'Генерация...' : 'Сгенерировать'}
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">META заголовок</label>
        <input
          type="text"
          value={formData.meta_title}
          onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-500 focus:ring-purple-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">META описание</label>
        <textarea
          value={formData.meta_description}
          onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
          rows={2}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-500 focus:ring-purple-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Краткое описание</label>
        <textarea
          value={formData.excerpt}
          onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
          rows={2}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-500 focus:ring-purple-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Содержание</label>
        <textarea
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          rows={10}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-500 focus:ring-purple-500 font-mono text-sm"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Теги</label>
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            {formData.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="ml-2 inline-flex items-center p-0.5 rounded-full text-purple-400 hover:bg-purple-200 hover:text-purple-500"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={formData.tagInput}
              onChange={(e) => setFormData(prev => ({ ...prev, tagInput: e.target.value }))}
              onKeyPress={handleTagInputKeyPress}
              placeholder="Добавить тег..."
              className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:border-purple-500 focus:ring-purple-500"
            />
            <button
              type="button"
              onClick={addTag}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              <TagIcon className="w-4 h-4 mr-2" />
              Добавить
            </button>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Изображение</label>
        <div className="flex items-center space-x-4">
          {formData.image && (
            <img
              src={formData.image}
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
        <label className="block text-sm font-medium text-gray-700">Автор</label>
        <input
          type="text"
          value={formData.author}
          onChange={(e) => setFormData({ ...formData, author: e.target.value })}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-500 focus:ring-purple-500"
          required
        />
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          checked={formData.is_published}
          onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
          className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
        />
        <label className="ml-2 block text-sm text-gray-700">
          Опубликовать сразу
        </label>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Отмена
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
        >
          {initialData ? 'Сохранить' : 'Добавить'}
        </button>
      </div>
    </form>
  );
}

