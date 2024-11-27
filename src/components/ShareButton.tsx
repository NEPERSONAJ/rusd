import React from 'react';
import { Share2 } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

interface ShareButtonProps {
  title: string;
  text: string;
  url: string;
}

export function ShareButton({ title, text, url }: ShareButtonProps) {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text,
          url
        });
      } catch (error) {
        if (error instanceof Error && error.name !== 'AbortError') {
          console.error('Error sharing:', error);
          handleFallbackShare();
        }
      }
    } else {
      handleFallbackShare();
    }
  };

  const handleFallbackShare = () => {
    navigator.clipboard.writeText(url).then(() => {
      toast.success('Ссылка скопирована в буфер обмена');
    }).catch(() => {
      toast.error('Не удалось скопировать ссылку');
    });
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleShare}
      className="p-2 rounded-lg bg-purple-100 text-purple-600 hover:bg-purple-200 transition-colors"
      title="Поделиться"
    >
      <Share2 className="w-4 h-4" />
    </motion.button>
  );
}
