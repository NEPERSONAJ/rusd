import React from 'react';
import { MapPin, Phone, Mail, Clock, Instagram, Send, Calculator } from 'lucide-react';
import { useCategories } from '../../hooks/useCategories';
import { useSettings } from '../../hooks/useSettings';
import { Link } from 'react-router-dom';

export function Footer() {
  const { categories } = useCategories();
  const { settings } = useSettings();
  
  const mainCategories = categories.filter(c => !c.parent_id);
  const midPoint = Math.ceil(mainCategories.length / 2);
  const firstColumn = mainCategories.slice(0, midPoint);
  const secondColumn = mainCategories.slice(midPoint);

  return (
    <footer className="relative bg-gradient-to-b from-gray-900 to-gray-800 text-gray-300 pt-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-amber-900/20 to-yellow-900/20" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Company Info */}
          <div>
            <img
              src={settings.logo_url}
              alt={settings.site_title}
              className="h-12 w-auto mb-6 brightness-0 invert"
            />
            <p className="text-gray-400 leading-relaxed mb-6">
              {settings.site_description}
            </p>
            <div className="flex space-x-4">
              {settings.instagram_url && (
                <a
                  href={settings.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-amber-600/20 flex items-center justify-center hover:bg-amber-600 transition-colors"
                >
                  <Instagram className="w-5 h-5" />
                </a>
              )}
              {settings.telegram_url && (
                <a
                  href={settings.telegram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-amber-600/20 flex items-center justify-center hover:bg-amber-600 transition-colors"
                >
                  <Send className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>

          {/* Categories Columns */}
          <div>
            <ul className="space-y-4">
              {firstColumn.map((category) => (
                <li key={category.id}>
                  <Link
                    to={`/category/${category.slug}`}
                    className="group flex items-center text-gray-400 hover:text-amber-400 transition-colors"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <ul className="space-y-4">
              {secondColumn.map((category) => (
                <li key={category.id}>
                  <Link
                    to={`/category/${category.slug}`}
                    className="group flex items-center text-gray-400 hover:text-amber-400 transition-colors"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {category.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to="/calculators"
                  className="group flex items-center text-gray-400 hover:text-amber-400 transition-colors"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <Calculator className="w-4 h-4 mr-2" />
                  Калькуляторы
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-6">Контакты</h4>
            <ul className="space-y-4">
              {settings.street_address && (
                <li className="flex items-center text-gray-400">
                  <MapPin className="w-5 h-5 mr-3 text-amber-400" />
                  <span>{settings.street_address}</span>
                </li>
              )}
              {settings.whatsapp_number && (
                <li className="flex items-center text-gray-400">
                  <Phone className="w-5 h-5 mr-3 text-amber-400" />
                  <span>{settings.whatsapp_number}</span>
                </li>
              )}
              {settings.email && (
                <li className="flex items-center text-gray-400">
                  <Mail className="w-5 h-5 mr-3 text-amber-400" />
                  <span>{settings.email}</span>
                </li>
              )}
              {settings.working_hours && (
                <li className="flex items-center text-gray-400">
                  <Clock className="w-5 h-5 mr-3 text-amber-400" />
                  <span>{settings.working_hours}</span>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} {settings.site_title}. Все права защищены.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <Link to="/privacy" className="text-sm text-gray-400 hover:text-white transition-colors">
                Политика конфиденциальности
              </Link>
              <Link to="/terms" className="text-sm text-gray-400 hover:text-white transition-colors">
                Условия использования
              </Link>
              <Link to="/about" className="text-sm text-gray-400 hover:text-white transition-colors">
                О компании
              </Link>
              <Link to="/contact" className="text-sm text-gray-400 hover:text-white transition-colors">
                Контакты
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
