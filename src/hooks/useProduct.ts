import { useState, useEffect } from 'react';
import { Product } from '../lib/types';
import { productService } from '../lib/services/productService';
import toast from 'react-hot-toast';

export function useProduct(id: string) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const data = await productService.getById(id);
      setProduct(data);
      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Ошибка при загрузке товара';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return {
    product,
    loading,
    error,
    refreshProduct: fetchProduct
  };
}