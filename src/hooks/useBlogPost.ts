import { useState, useEffect } from 'react';
import { BlogPost } from '../lib/types';
import { blogService } from '../lib/services/blogService';
import toast from 'react-hot-toast';

export function useBlogPost(slug: string) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPost();
  }, [slug]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const data = await blogService.getBySlug(slug);
      setPost(data);
      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Ошибка при загрузке статьи';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return {
    post,
    loading,
    error,
    refreshPost: fetchPost
  };
}