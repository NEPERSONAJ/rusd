import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Book, ShieldCheck, AlertTriangle, HelpCircle, Scale, Clock, Truck } from 'lucide-react';
import { SEO } from '../components/SEO';

export default function TermsPage() {
  return (
    <>
      <SEO 
        title="Условия использования | РусДекор"
        description="Условия использования сайта и услуг РусДекор"
      />

      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center mb-4">
              <Book className="w-12 h-12 text-purple-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Условия использования</h1>
            <p className="text-xl text-gray-600">
              Правила и условия использования сайта и услуг РусДекор
            </p>
          </motion.div>

          <div className="space-y-8">
            {/* Общие положения */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-xl p-6 md:p-8"
            >
              <div className="flex items-center space-x-4 mb-6">
                <FileText className="w-8 h-8 text-purple-600" />
                <h2 className="text-2xl font-bold text-gray-900">Общие положения</h2>
              </div>
              <div className="prose prose-purple max-w-none">
                <p>
                  Настоящие Условия использования регулируют отношения между ИП Магомирзаев Рамазан 
                  Сабигулаевич (далее – РусДекор) и пользователями сайта https://rusdecor.info/ 
                  (далее – Сайт).
                </p>
                <p>
                  Используя Сайт, вы принимаете настоящие условия в полном объеме. Если вы не согласны 
                  с условиями, вам следует прекратить использование Сайта.
                </p>
              </div>
            </motion.div>

            {/* Интеллектуальная собственность */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-xl p-6 md:p-8"
            >
              <div className="flex items-center space-x-4 mb-6">
                <ShieldCheck className="w-8 h-8 text-purple-600" />
                <h2 className="text-2xl font-bold text-gray-900">Интеллектуальная собственность</h2>
              </div>
              <div className="prose prose-purple max-w-none">
                <p>
                  Все материалы, размещенные на Сайте, включая тексты, изображения, логотипы, товарные 
                  знаки и другие объекты интеллектуальной собственности, принадлежат РусДекор или 
                  используются на законных основаниях.
                </p>
                <p>
                  Любое использование материалов Сайта без письменного разрешения РусДекор запрещено 
                  и может повлечь ответственность, предусмотренную законодательством РФ.
                </p>
              </div>
            </motion.div>

            {/* Правила покупки */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-xl p-6 md:p-8"
            >
              <div className="flex items-center space-x-4 mb-6">
                <Scale className="w-8 h-8 text-purple-600" />
                <h2 className="text-2xl font-bold text-gray-900">Правила покупки</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Clock className="w-5 h-5 text-purple-600 mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-900">Оформление заказа</h3>
                      <p className="text-gray-600">
                        Заказы принимаются через сайт круглосуточно. Обработка заказов осуществляется 
                        в рабочее время.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Truck className="w-5 h-5 text-purple-600 mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-900">Доставка</h3>
                      <p className="text-gray-600">
                        Доставка осуществляется по всей России. Сроки и стоимость рассчитываются 
                        индивидуально.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="w-5 h-5 text-purple-600 mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-900">Возврат</h3>
                      <p className="text-gray-600">
                        Возврат товара осуществляется в соответствии с законодательством РФ о защите 
                        прав потребителей.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <HelpCircle className="w-5 h-5 text-purple-600 mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-900">Консультации</h3>
                      <p className="text-gray-600">
                        Наши специалисты готовы ответить на все вопросы по товарам и оформлению заказа.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Ответственность */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-xl p-6 md:p-8"
            >
              <div className="flex items-center space-x-4 mb-6">
                <AlertTriangle className="w-8 h-8 text-purple-600" />
                <h2 className="text-2xl font-bold text-gray-900">Ответственность</h2>
              </div>
              <div className="prose prose-purple max-w-none">
                <p>
                  РусДекор не несет ответственности за:
                </p>
                <ul>
                  <li>Временную недоступность Сайта по техническим причинам</li>
                  <li>Действия третьих лиц, использующих Сайт</li>
                  <li>Достоверность информации, предоставленной пользователями</li>
                  <li>Любые косвенные убытки, возникшие в результате использования Сайта</li>
                </ul>
                <p>
                  РусДекор оставляет за собой право вносить изменения в работу Сайта без 
                  предварительного уведомления пользователей.
                </p>
              </div>
            </motion.div>

            {/* Изменение условий */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-xl p-6 md:p-8"
            >
              <div className="flex items-center space-x-4 mb-6">
                <Book className="w-8 h-8 text-purple-600" />
                <h2 className="text-2xl font-bold text-gray-900">Изменение условий</h2>
              </div>
              <div className="prose prose-purple max-w-none">
                <p>
                  РусДекор оставляет за собой право изменять настоящие Условия использования в любое 
                  время без предварительного уведомления пользователей.
                </p>
                <p>
                  Новая редакция Условий вступает в силу с момента ее размещения на Сайте. Продолжение 
                  использования Сайта после внесения изменений означает принятие новой редакции Условий.
                </p>
              </div>
            </motion.div>

            {/* Контакты */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-xl p-6 md:p-8"
            >
              <div className="flex items-center space-x-4 mb-6">
                <HelpCircle className="w-8 h-8 text-purple-600" />
                <h2 className="text-2xl font-bold text-gray-900">Контактная информация</h2>
              </div>
              <div className="prose prose-purple max-w-none">
                <p>
                  По всем вопросам, связанным с использованием Сайта, вы можете обратиться:
                </p>
                <ul>
                  <li>По электронной почте: support@rusdecor.info</li>
                  <li>По телефону: +7 988-635-99-99</li>
                  <li>По адресу: Город Хасавюрт, Рынок Терек, 8 ряд - 5 магазин</li>
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}
