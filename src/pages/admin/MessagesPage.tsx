import React, { useState, useEffect } from 'react';
import { Layout } from '../../components/admin/Layout';
import { MessageSquare, Trash2, Eye, EyeOff, Search, X } from 'lucide-react';
import { messageService } from '../../lib/services/messageService';
import { ContactMessage } from '../../lib/types';
import { formatContactType } from '../../lib/utils/formatContactType';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

export function MessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      setLoading(true);
      const data = await messageService.getAll();
      setMessages(data);
    } catch (error) {
      toast.error('Ошибка при загрузке сообщений');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Вы уверены, что хотите удалить это сообщение?')) return;

    try {
      await messageService.delete(id);
      setMessages(prev => prev.filter(msg => msg.id !== id));
      toast.success('Сообщение удалено');
    } catch (error) {
      toast.error('Ошибка при удалении сообщения');
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await messageService.markAsRead(id);
      setMessages(prev => prev.map(msg => 
        msg.id === id ? { ...msg, read: true } : msg
      ));
    } catch (error) {
      toast.error('Ошибка при обновлении статуса сообщения');
    }
  };

  const filteredMessages = messages.filter(message => {
    const searchLower = searchTerm.toLowerCase();
    return (
      message.name.toLowerCase().includes(searchLower) ||
      message.message.toLowerCase().includes(searchLower) ||
      message.contact_method.value.toLowerCase().includes(searchLower)
    );
  });

  return (
    <Layout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-3">
            <MessageSquare className="w-8 h-8 text-purple-600" />
            <h1 className="text-2xl font-bold text-gray-900">Сообщения</h1>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Поиск сообщений..."
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Статус
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Имя
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Контакт
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Дата
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
                ) : filteredMessages.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                      Сообщения не найдены
                    </td>
                  </tr>
                ) : (
                  filteredMessages.map((message) => (
                    <tr key={message.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        {message.read ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            <EyeOff className="w-4 h-4 mr-1" />
                            Прочитано
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <Eye className="w-4 h-4 mr-1" />
                            Новое
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {message.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {message.contact_method.type === 'other' 
                            ? `${message.contact_method.customLabel}: ${message.contact_method.value}`
                            : `${formatContactType(message.contact_method.type)}: ${message.contact_method.value}`
                          }
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(message.created_at).toLocaleString('ru-RU')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                        <button
                          onClick={() => setSelectedMessage(message)}
                          className="text-purple-600 hover:text-purple-900"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(message.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <AnimatePresence>
          {selectedMessage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
              onClick={() => setSelectedMessage(null)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-xl max-w-2xl w-full p-6"
                onClick={e => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-900">Сообщение от {selectedMessage.name}</h2>
                  <button
                    onClick={() => setSelectedMessage(null)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Контактные данные</h3>
                    <p className="mt-1 text-gray-900">
                      {selectedMessage.contact_method.type === 'other'
                        ? `${selectedMessage.contact_method.customLabel}: ${selectedMessage.contact_method.value}`
                        : `${formatContactType(selectedMessage.contact_method.type)}: ${selectedMessage.contact_method.value}`
                      }
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Сообщение</h3>
                    <p className="mt-1 text-gray-900 whitespace-pre-wrap">
                      {selectedMessage.message}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Дата отправки</h3>
                    <p className="mt-1 text-gray-900">
                      {new Date(selectedMessage.created_at).toLocaleString('ru-RU')}
                    </p>
                  </div>

                  {!selectedMessage.read && (
                    <div className="pt-4 flex justify-end">
                      <button
                        onClick={() => {
                          handleMarkAsRead(selectedMessage.id);
                          setSelectedMessage(null);
                        }}
                        className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        Отметить как прочитанное
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
}
