import React from 'react';
import { Search, X } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProductSearchProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
}

export function ProductSearch({ value, onChange, onClear }: ProductSearchProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative max-w-2xl mx-auto mb-8"
    >
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Поиск товаров..."
          className="w-full pl-12 pr-10 py-3 bg-white rounded-2xl shadow-lg border border-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
        />
        {value && (
          <button
            onClick={onClear}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
      <div className="absolute inset-x-0 h-20 bg-gradient-to-b from-white/50 to-transparent -z-10 blur-xl" />
    </motion.div>
  );
}
