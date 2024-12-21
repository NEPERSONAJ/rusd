// AICategoryGenerator.tsx

import React, { useState, useEffect } from 'react';
import { BrainCircuit } from 'lucide-react';
import { motion } from 'framer-motion';
import { aiSettingsService } from '../../lib/services/aiSettingsService';
import toast from 'react-hot-toast';

interface AIConfig {
  api_url: string;
  api_key: string;
  model: string;
  temperature: number;
}

interface AICategoryGeneratorProps {
  onGenerated: (data: {
    name: string;
    description: string;
    slug: string;
    seo_title: string;
    seo_description: string;
    seo_keywords: string;
    og_title: string;
    og_description: string;
    schema_markup: string;
  }) => void;
  isGenerating: boolean;
  setIsGenerating: (value: boolean) => void;
}

export const AICategoryGenerator: React.FC<AICategoryGeneratorProps> = ({ onGenerated, isGenerating, setIsGenerating }) => {
  const [categoryType, setCategoryType] = useState('');
  const [settings, setSettings] = useState<AIConfig | null>(null);
  const [currentField, setCurrentField] = useState<string | null>(null);

  // Поля и уточненные промпты для генерации
  const fieldsToGenerate = [
    { key: 'name', prompt: `Сгенерируй четкое название для категории "${categoryType}", с фокусом на ключевые слова, связанные с отделкой интерьера` },
    { key: 'description', prompt: `Напиши краткое и привлекательное описание для категории "${categoryType}", привлекая клиентов и описывая преимущества` },
    { key: 'slug', prompt: `Сгенерируй короткую ссылку для "${categoryType}"` },
    { key: 'seo_title', prompt: `Создай SEO-оптимизированный заголовок для категории "${categoryType}", не более 60 символов, с акцентом на релевантность поиска` },
    { key: 'seo_description', prompt: `Сгенерируй мета-описание для категории "${categoryType}", до 160 символов, подчеркивая ключевые преимущества для SEO` },
    { key: 'seo_keywords', prompt: `Сгенерируй список SEO ключевых слов для категории "${categoryType}", через запятую, ориентируясь на поисковые намерения` },
    { key: 'og_title', prompt: `Создай привлекательный заголовок для соцсетей для категории "${categoryType}", до 60 символов, для таких платформ, как Facebook` },
    { key: 'og_description', prompt: `Напиши описание для соцсетей для категории "${categoryType}", до 200 символов, ориентированное на привлечение внимания` },
    { key: 'schema_markup', prompt: `Сгенерируй разметку JSON-LD только для категории "${categoryType}"` }
  ];

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const data = await aiSettingsService.getSettings();
        setSettings(data);
      } catch (error) {
        console.error('Ошибка при загрузке настроек AI:', error);
        toast.error('Не удалось загрузить настройки AI');
      }
    };

    loadSettings();
  }, []);

  const generateFieldContent = async (fieldKey: string, fieldPrompt: string) => {
    if (!settings) return;

    try {
      const response = await fetch(settings.api_url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${settings.api_key || ''}`
        },
        body: JSON.stringify({
          model: settings.model,
          temperature: settings.temperature,
          messages: [
            { role: 'system', content: `Вы профессиональный генератор SEO и контента для категории в интернет-магазине декора.` },
            { role: 'user', content: fieldPrompt }
          ]
        })
      });

      const data = await response.json();
      console.log(`Ответ для ${fieldKey}:`, data);

      if (response.ok && data.choices?.[0]?.message?.content) {
        let cleanedText = data.choices[0].message.content.trim();
        
        // Очищаем текст от символов * и # для всех полей, кроме schema_markup
        if (fieldKey !== 'schema_markup') {
          cleanedText = cleanedText.replace(/[*#"]/g, '');
        } else {
          // Удаляем только * и # для schema_markup, оставляя "
          cleanedText = cleanedText.replace(/[*#]/g, '');
        }

        onGenerated({ [fieldKey]: cleanedText });
      } else {
        toast.error(`Не удалось сгенерировать ${fieldKey}`);
      }
    } catch (error) {
      console.error(`Ошибка при генерации ${fieldKey}:`, error);
      toast.error(`Ошибка при генерации ${fieldKey}`);
    }
  };

  const startGeneration = async () => {
    setIsGenerating(true);

    for (const field of fieldsToGenerate) {
      setCurrentField(field.key); // Устанавливаем текущий генерируемый элемент
      await generateFieldContent(field.key, field.prompt);
      await new Promise((resolve) => setTimeout(resolve, 10000)); // Задержка 10 секунд
    }

    setCurrentField(null);
    setIsGenerating(false);
    toast.success('Генерация контента завершена');
  };

  return (
    <div className="mb-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <BrainCircuit className="w-5 h-5 mr-2 text-purple-600" />
        Сгенерировать с ИИ
      </h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Опишите тип категории
          </label>
          <input
            type="text"
            value={categoryType}
            onChange={(e) => setCategoryType(e.target.value)}
            placeholder="Например: Создай для категории: Молдинги"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={startGeneration}
          disabled={isGenerating}
          className={`w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 px-4 rounded-lg font-medium flex items-center justify-center space-x-2 ${
            isGenerating ? 'opacity-75 cursor-not-allowed' : 'hover:shadow-lg'
          }`}
        >
          <BrainCircuit className="w-5 h-5" />
          <span>
            {isGenerating ? 'Генерация...' : 'Сгенерировать'}
          </span>
        </motion.button>

        {/* Индикатор процесса генерации */}
        {currentField && (
          <div className="mt-4">
            <div className="h-1 bg-purple-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-purple-600 transition-all duration-300"
                style={{ 
                  width: `${
                    ((fieldsToGenerate.findIndex(field => field.key === currentField) + 1) / fieldsToGenerate.length) * 100
                  }%` 
                }}
              />
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Генерация: {
                currentField === 'name' ? 'Название категории' :
                currentField === 'description' ? 'Описание' :
                currentField === 'slug' ? 'Slug' :
                currentField === 'seo_title' ? 'SEO Заголовок' :
                currentField === 'seo_description' ? 'SEO Описание' :
                currentField === 'seo_keywords' ? 'SEO Ключевые слова' :
                currentField === 'og_title' ? 'Заголовок для соцсетей' :
                currentField === 'og_description' ? 'Описание для соцсетей' : 'Схема разметки'
              }...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
