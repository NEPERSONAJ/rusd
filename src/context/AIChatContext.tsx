import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSettings } from '../hooks/useSettings';
import { aiSettingsService } from '../lib/services/aiSettingsService';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

interface ChatState {
  messages: Message[];
  isOpen: boolean;
  currentProduct: any | null;
}

interface AIChatContextType {
  isOpen: boolean;
  messages: Message[];
  openChat: () => void;
  closeChat: () => void;
  sendMessage: (content: string) => Promise<void>;
  openChatWithProduct: (product: any) => void;
}

const AIChatContext = createContext<AIChatContextType | undefined>(undefined);

const MAX_MESSAGES_PER_USER = 5;

const INITIAL_MESSAGE = {
  role: 'assistant',
  content: '',
  timestamp: Date.now()
};

export function AIChatProvider({ children }: { children: React.ReactNode }) {
  const { settings } = useSettings();
  const [state, setState] = useState<ChatState>({
    messages: [{
      ...INITIAL_MESSAGE,
      content: `👋 Здравствуйте! Я ИИ-ассистент ${settings.site_title}.\n\n💫 Я могу помочь вам:\n• Подобрать товары\n• Рассказать о характеристиках\n• Дать рекомендации по установке\n• Ответить на любые вопросы\n\nЕсли я не смогу помочь, вы всегда можете связаться с нашими менеджерами напрямую:\n📱 WhatsApp: +7988 635 99 99 \n\nЧем могу помочь? 😊`
    }],
    isOpen: false,
    currentProduct: null,
  });
  const [aiSettings, setAiSettings] = useState<any | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const data = await aiSettingsService.getSettings();
      console.log('AI settings data:', data); // Логируем ответ для проверки

      if (data) {
        setAiSettings(data);
      } else {
        console.error('AI settings not found or empty.');
      }
    } catch (error) {
      console.error('Error loading AI settings:', error);
    }
  };

  const openChat = () => {
    setState(prev => ({ ...prev, isOpen: true }));
  };

  const closeChat = () => {
    setState(prev => ({ ...prev, isOpen: false }));
  };

  const openChatWithProduct = (product: any) => {
    setState(prev => ({
      ...prev,
      isOpen: true,
      currentProduct: product,
      messages: [
        {
          role: 'assistant',
          content: `👋 Здравствуйте! Я помогу вам с информацией о товаре "${product.name}". \n\n💫 Что именно вас интересует?\n\n• Характеристики\n• Применение\n• Стоимость и условия покупки\n\nЗадайте любой вопрос! 😊`,
          timestamp: Date.now()
        }
      ]
    }));
  };

  const sendMessage = async (content: string) => {
    if (!aiSettings) {
      console.error('AI settings not loaded');
      return;
    }

    const userMessage: Message = {
      role: 'user',
      content,
      timestamp: Date.now()
    };

    setState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage].slice(-MAX_MESSAGES_PER_USER * 2)
    }));

    try {
      const productContext = state.currentProduct ? 
        `Ты консультант по товару:\n${state.currentProduct.name}\n\nПодробная информация:\n• Цена: ${state.currentProduct.price.toLocaleString('ru-RU')} ₽\n• Описание: ${state.currentProduct.description}\n• Характеристики:\n${state.currentProduct.specs?.map(spec => `  - ${spec}`).join('\n')}\n\nОтвечай на вопросы покупателя, используя эту информацию о товаре и свои знания о декоративных материалах. Если спрашивают о цене или характеристиках - используй именно эти данные. Можешь давать советы по применению, установке и уходу за товаром.\n\n` : '';

      const response = await fetch(aiSettings.api_url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${aiSettings.api_key}`
        },
        body: JSON.stringify({
          model: aiSettings.model,
          temperature: aiSettings.temperature,
          max_tokens: aiSettings.max_tokens,
          messages: [
            {
              role: 'system',
              content: `Ты дружелюбный консультант магазина РусДекор. ${productContext}Отвечай с эмодзи в начале каждого абзаца, используй форматирование и пробелы для красивого оформления текста. Будь позитивным и полезным. Всегда указывай точную цену и характеристики из предоставленных данных. В конце каждого ответа, если это уместно, предлагай связаться с менеджерами через WhatsApp для оформления заказа или получения дополнительной консультации: +7988 635 99 99. Ты эксперт по декоративным материалам и знаешь всё о молдингах, обоях, плинтусах и карнизах. Давай профессиональные советы по подбору, установке и уходу за материалами. При вопросах о доставке сообщай что доставка возможна по всей России, точную стоимость можно узнать у менеджеров в WhatsApp.`
            },
            ...state.messages.slice(-MAX_MESSAGES_PER_USER * 2).map(msg => ({
              role: msg.role,
              content: msg.content
            })),
            { role: 'user', content }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const data = await response.json();
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.choices[0]?.message.content || '😔 Не удалось получить ответ от AI. Попробуйте позже.',
        timestamp: Date.now()
      };

      setState(prev => ({
        ...prev,
        messages: [...prev.messages, assistantMessage].slice(-MAX_MESSAGES_PER_USER * 2)
      }));
    } catch (error) {
      console.error('Error:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: '😔 Извините, произошла ошибка. Пожалуйста, попробуйте позже.',
        timestamp: Date.now()
      };

      setState(prev => ({
        ...prev,
        messages: [...prev.messages, errorMessage].slice(-MAX_MESSAGES_PER_USER * 2)
      }));
    }
  };

  return (
    <AIChatContext.Provider value={{
      isOpen: state.isOpen,
      messages: state.messages,
      openChat,
      closeChat,
      sendMessage,
      openChatWithProduct
    }}>
      {children}
    </AIChatContext.Provider>
  );
}

export function useAIChat() {
  const context = useContext(AIChatContext);
  if (context === undefined) {
    throw new Error('useAIChat must be used within an AIChatProvider');
  }
  return context;
}
