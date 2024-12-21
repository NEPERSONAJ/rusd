import React, { useState } from 'react';
import { Menu, X, Home, Info, Phone, Tag, FileText, ShoppingBag, Settings, BarChart3, Calculator, Clock, Instagram, Send, ChevronDown } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useSettings } from '../../hooks/useSettings';
import { useCategories } from '../../hooks/useCategories';
import { useAuth } from '../../context/AuthContext';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHoveringCatalog, setIsHoveringCatalog] = useState(false);
  const { settings } = useSettings();
  const location = useLocation();
  const { categories } = useCategories();
  const { user } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const menuItems = [
    { path: '/', icon: Home, label: 'Главная' },
    { path: '/catalog', icon: ShoppingBag, label: 'Каталог' },
    { path: '/sale', icon: Tag, label: 'Акции' },
    { path: '/blog', icon: FileText, label: 'Блог' },
    { path: '/about', icon: Info, label: 'О нас' },
    { path: '/contact', icon: Phone, label: 'Контакты' },
    { path: '/calculators', icon: Calculator, label: 'Калькуляторы' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Top Bar - Desktop */}
      <div className="hidden md:block bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-10 flex items-center justify-between">
            <div className="flex-1" />
            <div className="flex items-center space-x-6 justify-center flex-1">
              {settings.whatsapp_number && (
                <a href={`tel:${settings.whatsapp_number}`} className="flex items-center text-gray-600 hover:text-amber-600 transition-colors">
                  <Phone className="w-4 h-4 mr-2" />
                  <span>{settings.whatsapp_number}</span>
                </a>
              )}
              {settings.working_hours && (
                <div className="flex items-center text-gray-600">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>{settings.working_hours}</span>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-4 flex-1 justify-end">
              {settings.instagram_url && (
                <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-amber-600 transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
              )}
              {settings.telegram_url && (
                <a href={settings.telegram_url} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-amber-600 transition-colors">
                  <Send className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-24 flex items-center justify-between">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-amber-50 hover:text-amber-600"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
            <div className="flex-1 flex justify-center">
              <Link to="/" className="flex-shrink-0">
                <img
                  src={settings.logo_url}
                  alt={settings.site_title}
                  className="h-16 md:h-20 w-auto"
                  width={180}
                  height={72}
                  loading="eager"
                />
              </Link>
            </div>
          </div>

          {/* Navigation Menu - Desktop */}
          <nav className="hidden md:flex items-center justify-center h-12 border-t">
            {menuItems.map((item) => (
              item.path === '/catalog' ? (
                <div
                  key={item.path}
                  className="relative"
                  onMouseEnter={() => setIsHoveringCatalog(true)}
                  onMouseLeave={() => setIsHoveringCatalog(false)}
                >
                  <Link
                    to="/catalog"
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 ${
                      isActive('/catalog') || isHoveringCatalog
                        ? 'text-amber-600 bg-amber-50'
                        : 'text-gray-700 hover:text-amber-600 hover:bg-amber-50'
                    }`}
                    aria-expanded={isHoveringCatalog}
                    aria-haspopup="true"
                  >
                    <ShoppingBag className="w-5 h-5" aria-hidden="true" />
                    <span className="font-medium">Каталог</span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-300 ${isHoveringCatalog ? 'rotate-180' : ''}`}
                      aria-hidden="true"
                    />
                  </Link>

                  <AnimatePresence>
                    {isHoveringCatalog && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-full left-0 mt-2 w-[400px] bg-white rounded-xl shadow-xl p-4"
                        role="menu"
                      >
                        <div className="grid grid-cols-2 gap-2">
                          {categories.filter(c => !c.parent_id).map((category) => (
                            <Link
                              key={category.id}
                              to={`/category/${category.slug}`}
                              className="group flex items-center p-2 rounded-lg hover:bg-amber-50 transition-all duration-300"
                              onClick={() => setIsHoveringCatalog(false)}
                              role="menuitem"
                            >
                              <img
                                src={category.image}
                                alt=""
                                className="w-10 h-10 rounded-lg object-cover"
                                width={40}
                                height={40}
                                loading="lazy"
                                aria-hidden="true"
                              />
                              <span className="ml-3 text-sm font-medium text-gray-700 group-hover:text-amber-600">
                                {category.name}
                              </span>
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                    isActive(item.path)
                      ? 'text-amber-600 bg-amber-50'
                      : 'text-gray-700 hover:text-amber-600 hover:bg-amber-50'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              )
            ))}
          </nav>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t"
          >
            <div className="px-4 py-3 border-b space-y-2">
              {settings.whatsapp_number && (
                <a href={`tel:${settings.whatsapp_number}`} className="flex items-center text-gray-600">
                  <Phone className="w-4 h-4 mr-2" />
                  <span>{settings.whatsapp_number}</span>
                </a>
              )}
              {settings.working_hours && (
                <div className="flex items-center text-gray-600">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>{settings.working_hours}</span>
                </div>
              )}
            </div>
            <nav className="grid gap-2 p-4">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center space-x-3 p-3 rounded-lg ${
                    isActive(item.path)
                      ? 'bg-amber-50 text-amber-600'
                      : 'text-gray-700 hover:bg-amber-50 hover:text-amber-600'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}
            </nav>

            {/* Social Links - Mobile */}
            <div className="px-4 py-3 border-t flex justify-center space-x-6">
              {settings.instagram_url && (
                <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-amber-600">
                  <Instagram className="w-6 h-6" />
                </a>
              )}
              {settings.telegram_url && (
                <a href={settings.telegram_url} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-amber-600">
                  <Send className="w-6 h-6" />
                </a>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
