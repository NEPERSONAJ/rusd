import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Search, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* 404 Animation */}
          <div className="relative mb-8">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-9xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-600 to-yellow-500"
            >
              404
            </motion.div>
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4, type: "spring" }}
              className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-24 h-24 bg-gradient-to-br from-amber-100 to-amber-50 rounded-full -z-10 blur-xl"
            />
          </div>

          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-bold text-gray-900 mb-4"
          >
            Страница не найдена
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-gray-600 mb-8 max-w-md mx-auto"
          >
            К сожалению, запрашиваемая страница не существует или была перемещена.
            Возможно, вы перешли по устаревшей ссылке или неверно ввели адрес.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              to="/"
              className="flex items-center px-6 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-white rounded-xl font-medium hover:shadow-lg transition-shadow group"
            >
              <Home className="w-5 h-5 mr-2 transition-transform group-hover:-translate-y-1" />
              На главную
            </Link>

            <Link
              to="/catalog"
              className="flex items-center px-6 py-3 bg-white text-gray-700 rounded-xl font-medium shadow-sm hover:shadow-lg transition-shadow border border-gray-100 group"
            >
              <Search className="w-5 h-5 mr-2 transition-transform group-hover:rotate-12" />
              Перейти в каталог
            </Link>

            <button
              onClick={() => window.history.back()}
              className="flex items-center px-6 py-3 bg-gray-50 text-gray-700 rounded-xl font-medium hover:bg-gray-100 transition-colors group"
            >
              <ArrowLeft className="w-5 h-5 mr-2 transition-transform group-hover:-translate-x-1" />
              Назад
            </button>
          </motion.div>

          {/* Decorative Elements */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ delay: 0.6 }}
            className="absolute inset-0 pointer-events-none"
          >
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-amber-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
            <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-yellow-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
            <div className="absolute bottom-1/4 left-1/2 w-64 h-64 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
