import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  BookOpen,
  BrainCircuit,
  Settings,
  LogOut,
  BarChart3,
  Menu,
  X,
  MessagesSquare 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { messageService } from '../../lib/services/messageService';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const messages = await messageService.getAll();
        const unread = messages.filter(msg => !msg.read).length;
        setUnreadCount(unread);
      } catch (error) {
        console.error('Error fetching unread messages:', error);
      }
    };

    fetchUnreadCount();
    // Poll for new messages every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/admin/login');
      toast.success('Вы успешно вышли из системы');
    } catch (error) {
      toast.error('Ошибка при выходе из системы');
    }
  };

  const menuItems = [
    {
      icon: LayoutDashboard,
      label: 'Панель',
      path: '/admin/dashboard'
    },
    {
      icon: Package,
      label: 'Товары',
      path: '/admin/products'
    },
    {
      icon: ShoppingBag,
      label: 'Категории',
      path: '/admin/categories'
    },
    {
      icon: BookOpen,
      label: 'Блог',
      path: '/admin/blog'
    },
    {
      icon: MessagesSquare,
      label: 'Сообщения',
      path: '/admin/messages',
      badge: unreadCount > 0 ? unreadCount : undefined
    },
    {
      icon: BrainCircuit,
      label: 'Настройки ИИ',
      path: '/admin/ai-settings'
    },
    {
      icon: BarChart3,
      label: 'Аналитика',
      path: '/admin/analytics'
    },
    {
      icon: Settings,
      label: 'Настройки',
      path: '/admin/settings'
    }
  ];

  const sidebarContent = (
    <div className="h-full flex flex-col">
      <div className="p-4">
        <Link to="/admin/dashboard" className="flex items-center space-x-2">
          <img
            src="https://i.ibb.co/Zf9jHX6/rusdecor-2.png"
            alt="RusDecor"
            className="h-8 w-auto"
          />
          <span className="font-semibold text-gray-900">Админ панель</span>
        </Link>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                  location.pathname === item.path
                    ? 'bg-purple-50 text-purple-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded-full text-xs font-medium">
                    {item.badge}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t">
        <button
          onClick={handleSignOut}
          className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors w-full px-3 py-2"
        >
          <LogOut className="w-5 h-5" />
          <span>Выйти</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Desktop Sidebar */}
      <div className="hidden md:block w-64 bg-white shadow-sm">
        {sidebarContent}
      </div>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-20 bg-white shadow-sm">
        <div className="flex items-center justify-between p-4">
          <Link to="/admin/dashboard" className="flex items-center space-x-2">
            <img
              src="https://i.ibb.co/Zf9jHX6/rusdecor-2.png"
              alt="RusDecor"
              className="h-8 w-auto"
            />
            <span className="font-semibold text-gray-900">Админ панель</span>
          </Link>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            {isSidebarOpen ? (
              <X className="w-6 h-6 text-gray-600" />
            ) : (
              <Menu className="w-6 h-6 text-gray-600" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-30 md:hidden"
              onClick={() => setIsSidebarOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed left-0 top-0 bottom-0 w-64 bg-white z-40 md:hidden"
            >
              {sidebarContent}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <main className="flex-1 overflow-y-auto pt-16 md:pt-0">
          <div className="container mx-auto p-4 md:p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
