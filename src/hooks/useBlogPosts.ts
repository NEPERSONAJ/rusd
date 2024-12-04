import { useState, useEffect } from 'react';
import { BlogPost } from '../lib/types';
import { blogService } from '../lib/services/blogService';
import toast from 'react-hot-toast';

export function useBlogPosts() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const data = await blogService.getPublished();
      setPosts(data);
      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Ошибка при загрузке статей';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return {
    posts,
    loading,
    error,
    refreshPosts: fetchPosts
  };
}