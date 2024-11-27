import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Send, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ContactMethod } from '../lib/types';
import { messageService } from '../lib/services/messageService';
import { ContactSuccessModal } from '../components/modals/ContactSuccessModal';
import toast from 'react-hot-toast';

export function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    contactMethod: {
      type: 'whatsapp' as ContactMethod['type'],
      value: '',
      customLabel: ''
    },
    message: '',
    acceptPolicy: false
  });

  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.acceptPolicy) {
      toast.error('Необходимо принять политику конфиденциальности');
      return;
    }

    try {
      await messageService.create({
        name: formData.name,
        contact_method: {
          type: formData.contactMethod.type,
          value: formData.contactMethod.value,
          customLabel: formData.contactMethod.type === 'other' ? formData.contactMethod.customLabel : undefined
        },
        message: formData.message
      });

      setShowSuccessModal(true);
      setFormData({
        name: '',
        contactMethod: {
          type: 'whatsapp',
          value: '',
          customLabel: ''
        },
        message: '',
        acceptPolicy: false
      });
    } catch (error) {
      toast.error('Ошибка при отправке сообщения');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-50/30 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Свяжитесь с нами</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Мы всегда рады помочь вам с выбором и ответить на любые вопросы
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl shadow-lg p-8"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Ваше имя
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                  Как с вами связаться?
                </label>
                <select
                  value={formData.contactMethod.type}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    contactMethod: {
                      ...prev.contactMethod,
                      type: e.target.value as ContactMethod['type'],
                      value: ''
                    }
                  }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                >
                  <option value="whatsapp">WhatsApp</option>
                  <option value="telegram">Telegram</option>
                  <option value="phone">Телефон</option>
                  <option value="email">Email</option>
                  <option value="other">Другой способ связи</option>
                </select>

                {formData.contactMethod.type === 'other' && (
                  <input
                    type="text"
                    placeholder="Укажите способ связи"
                    value={formData.contactMethod.customLabel}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      contactMethod: {
                        ...prev.contactMethod,
                        customLabel: e.target.value
                      }
                    }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    required
                  />
                )}

                <input
                  type={formData.contactMethod.type === 'email' ? 'email' : 'text'}
                  placeholder={
                    formData.contactMethod.type === 'whatsapp' ? '+7 XXX XXX XX XX' :
                    formData.contactMethod.type === 'telegram' ? '@username или номер' :
                    formData.contactMethod.type === 'phone' ? '+7 XXX XXX XX XX' :
                    formData.contactMethod.type === 'email' ? 'email@example.com' :
                    'Контактные данные'
                  }
                  value={formData.contactMethod.value}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    contactMethod: {
                      ...prev.contactMethod,
                      value: e.target.value
                    }
                  }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Сообщение
                </label>
                <textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="flex items-start space-x-2">
                <input
                  type="checkbox"
                  id="policy"
                  checked={formData.acceptPolicy}
                  onChange={(e) => setFormData(prev => ({ ...prev, acceptPolicy: e.target.checked }))}
                  className="mt-1 h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                />
                <label htmlFor="policy" className="text-sm text-gray-600">
                  Нажимая кнопку «Отправить сообщение», вы соглашаетесь с{' '}
                  <Link to="/privacy" className="text-amber-600 hover:text-amber-700">
                    политикой конфиденциальности
                  </Link>
                  {' '}в соответствии с Федеральным законом № 152‑ФЗ «О персональных данных» от 27.07.2006.
                </label>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={!formData.acceptPolicy}
                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-white py-3 rounded-lg font-semibold flex items-center justify-center space-x-2 hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
                <span>Отправить сообщение</span>
              </motion.button>
            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Наш адрес</h3>
              <div className="flex items-center space-x-4">
                <div className="bg-amber-100 p-3 rounded-full">
                  <MapPin className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <p className="text-gray-600">Город Хасавюрт, Рынок Терек, 8 ряд - 5 магазин</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Часы работы</h3>
              <div className="space-y-2">
                <p className="flex justify-between">
                  <span className="text-gray-600">Без выходных</span>
                  <span className="font-medium text-amber-600">08:00 - 18:00</span>
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center space-x-3 text-amber-600">
                <AlertCircle className="w-5 h-5" />
                <h3 className="text-lg font-semibold">Важная информация</h3>
              </div>
              <p className="mt-3 text-gray-600">
                Мы стараемся отвечать на все сообщения в течение 24 часов. В срочных случаях 
                рекомендуем использовать WhatsApp для более быстрой связи.
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      <ContactSuccessModal 
        isOpen={showSuccessModal} 
        onClose={() => setShowSuccessModal(false)} 
      />
    </div>
  );
}
