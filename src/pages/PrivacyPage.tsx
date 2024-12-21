import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Database, Globe, Mail, AlertCircle, UserCheck, FileText, Phone, MessageSquare } from 'lucide-react';
import { SEO } from '../components/SEO';

export default function PrivacyPage() {
  return (
    <>
      <SEO 
        title="Политика конфиденциальности | РусДекор"
        description="Политика в отношении обработки персональных данных пользователей сайта РусДекор"
      />

      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center mb-4">
              <Shield className="w-12 h-12 text-purple-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Политика конфиденциальности</h1>
            <p className="text-xl text-gray-600">
              Политика в отношении обработки персональных данных
            </p>
          </motion.div>

          <div className="space-y-8">
            {/* 1. Общие положения */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-xl p-6 md:p-8"
            >
              <div className="flex items-center space-x-4 mb-6">
                <Lock className="w-8 h-8 text-purple-600" />
                <h2 className="text-2xl font-bold text-gray-900">1. Общие положения</h2>
              </div>
              <div className="prose prose-purple max-w-none">
                <p>
                  Настоящая политика обработки персональных данных составлена в соответствии с требованиями 
                  Федерального закона от 27.07.2006. №152-ФЗ «О персональных данных» и определяет порядок 
                  обработки персональных данных и меры по обеспечению безопасности персональных данных, 
                  предпринимаемые ИП Магомирзаев Рамазан Сабигулаевич (далее – Оператор).
                </p>
                <p>
                  Оператор ставит своей важнейшей целью и условием соблюдение прав и свобод человека и 
                  гражданина при обработке его персональных данных, в том числе защиты прав на 
                  неприкосновенность частной жизни, личную и семейную тайну.
                </p>
                <p>
                  Настоящая политика Оператора в отношении обработки персональных данных (далее – Политика) 
                  применяется ко всей информации, которую Оператор может получить о посетителях веб-сайта 
                  https://rusdecor.info/.
                </p>
              </div>
            </motion.div>

            {/* 2. Основные понятия */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-xl p-6 md:p-8"
            >
              <div className="flex items-center space-x-4 mb-6">
                <Database className="w-8 h-8 text-purple-600" />
                <h2 className="text-2xl font-bold text-gray-900">2. Основные понятия</h2>
              </div>
              <div className="space-y-4">
                <p className="text-gray-600">
                  2.1. Автоматизированная обработка персональных данных – обработка персональных данных с помощью средств вычислительной техники;
                </p>
                <p className="text-gray-600">
                  2.2. Блокирование персональных данных – временное прекращение обработки персональных данных (за исключением случаев, если обработка необходима для уточнения персональных данных);
                </p>
                <p className="text-gray-600">
                  2.3. Веб-сайт – совокупность графических и информационных материалов, а также программ для ЭВМ и баз данных, доступных по адресу https://rusdecor.info/;
                </p>
                <p className="text-gray-600">
                  2.4. Обработка персональных данных – любое действие (операция) или совокупность действий с использованием автоматизации или без с персональными данными;
                </p>
                <p className="text-gray-600">
                  2.5. Персональные данные – любая информация, относящаяся прямо или косвенно к Пользователю веб-сайта https://rusdecor.info/.
                </p>
              </div>
            </motion.div>

            {/* 3. Обрабатываемые данные */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-xl p-6 md:p-8"
            >
              <div className="flex items-center space-x-4 mb-6">
                <Database className="w-8 h-8 text-purple-600" />
                <h2 className="text-2xl font-bold text-gray-900">3. Обрабатываемые данные</h2>
              </div>
              <div className="space-y-4">
                <p className="text-gray-600">Оператор может обрабатывать следующие персональные данные Пользователя:</p>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li>3.1. Фамилия, имя;</li>
                  <li>3.2. Электронный адрес;</li>
                  <li>3.3. Номера телефонов;</li>
                  <li>3.4. Номера и логины telegram и whatsapp;</li>
                  <li>3.5. Иной метод связи который укажет пользователь;</li>
                  <li>3.6. Также на сайте происходит сбор и обработка обезличенных данных о посетителях (включая файлы cookie).</li>
                </ul>
              </div>
            </motion.div>

            {/* 4. Цели обработки */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-xl p-6 md:p-8"
            >
              <div className="flex items-center space-x-4 mb-6">
                <Globe className="w-8 h-8 text-purple-600" />
                <h2 className="text-2xl font-bold text-gray-900">4. Цели обработки персональных данных</h2>
              </div>
              <div className="space-y-4">
                <p className="text-gray-600">
                  4.1. Цель обработки персональных данных Пользователя — информирование посредством электронных писем;
                </p>
                <p className="text-gray-600">
                  4.2. Оператор может отправлять уведомления о новых продуктах, услугах, специальных предложениях. 
                  Пользователь может отказаться от получения писем, отправив письмо на электронный адрес 
                  support@rusdecor.info с пометкой "Отказ от уведомлений".
                </p>
              </div>
            </motion.div>

            {/* 5. Правовые основания */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-xl p-6 md:p-8"
            >
              <div className="flex items-center space-x-4 mb-6">
                <FileText className="w-8 h-8 text-purple-600" />
                <h2 className="text-2xl font-bold text-gray-900">5. Правовые основания обработки</h2>
              </div>
              <div className="space-y-4">
                <p className="text-gray-600">
                  5.1. Оператор обрабатывает персональные данные только при их самостоятельном заполнении 
                  Пользователем через формы на сайте https://rusdecor.info/. Заполняя формы, Пользователь 
                  даёт согласие на обработку персональных данных;
                </p>
                <p className="text-gray-600">
                  5.2. Оператор обрабатывает обезличенные данные при наличии разрешения на сохранение cookie 
                  в настройках браузера.
                </p>
              </div>
            </motion.div>

            {/* 6. Порядок обработки */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-xl p-6 md:p-8"
            >
              <div className="flex items-center space-x-4 mb-6">
                <Shield className="w-8 h-8 text-purple-600" />
                <h2 className="text-2xl font-bold text-gray-900">6. Порядок обработки данных</h2>
              </div>
              <div className="space-y-4">
                <p className="text-gray-600">
                  6.1. Оператор принимает все меры для защиты персональных данных от несанкционированного доступа;
                </p>
                <p className="text-gray-600">
                  6.2. Персональные данные Пользователя не будут переданы третьим лицам, за исключением случаев, 
                  предусмотренных законодательством;
                </p>
                <p className="text-gray-600">
                  6.3. Срок обработки персональных данных не ограничен. Пользователь может в любой момент отозвать 
                  своё согласие на обработку данных, отправив уведомление на электронный адрес Оператора 
                  support@rusdecor.info.
                </p>
              </div>
            </motion.div>

            {/* 7. Трансграничная передача */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-xl p-6 md:p-8"
            >
              <div className="flex items-center space-x-4 mb-6">
                <Globe className="w-8 h-8 text-purple-600" />
                <h2 className="text-2xl font-bold text-gray-900">7. Трансграничная передача данных</h2>
              </div>
              <div className="space-y-4">
                <p className="text-gray-600">
                  7.1. Передача персональных данных на территорию иностранных государств возможна только при 
                  наличии достаточной защиты прав субъектов данных;
                </p>
                <p className="text-gray-600">
                  7.2. Передача данных в страны без надлежащей защиты возможна только с согласия Пользователя.
                </p>
              </div>
            </motion.div>

            {/* 8. Заключительные положения */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-xl p-6 md:p-8"
            >
              <div className="flex items-center space-x-4 mb-6">
                <AlertCircle className="w-8 h-8 text-purple-600" />
                <h2 className="text-2xl font-bold text-gray-900">8. Заключительные положения</h2>
              </div>
              <div className="space-y-4">
                <p className="text-gray-600">
                  8.1. Пользователь может обратиться за разъяснениями по вопросам обработки данных по электронной 
                  почте support@rusdecor.info;
                </p>
                <p className="text-gray-600">
                  8.2. Политика может быть обновлена, и актуальная версия доступна по адресу https://rusdecor.info/privacy.
                </p>
              </div>
            </motion.div>

            {/* Контактная информация */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-xl p-6 md:p-8"
            >
              <div className="flex items-center space-x-4 mb-6">
                <Phone className="w-8 h-8 text-purple-600" />
                <h2 className="text-2xl font-bold text-gray-900">Контактная информация</h2>
              </div>
              <div className="space-y-4">
                <p className="text-gray-600">
                  По всем вопросам, связанным с обработкой персональных данных, вы можете обратиться:
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center">
                    <Mail className="w-5 h-5 text-purple-600 mr-2" />
                    Email: support@rusdecor.info
                  </li>
                  <li className="flex items-center">
                    <Phone className="w-5 h-5 text-purple-600 mr-2" />
                    Телефон: +7 988-635-99-99
                  </li>
                  <li className="flex items-center">
                    <MessageSquare className="w-5 h-5 text-purple-600 mr-2" />
                    WhatsApp: +7 988-635-99-99
                  </li>
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}
