import { supabase } from '../supabase';
import { Product, ProductInput } from '../types';
import { imageService } from './imageService';

const formatProduct = (product: any): Product => {
  let specs;
  try {
    if (!product.specs) {
      specs = [];
    } else if (Array.isArray(product.specs)) {
      specs = product.specs;
    } else if (typeof product.specs === 'string') {
      specs = JSON.parse(product.specs);
    } else if (typeof product.specs === 'object') {
      specs = Object.values(product.specs);
    } else {
      specs = [];
    }
  } catch (error) {
    console.error('Error parsing specs:', error);
    specs = [];
  }

  return {
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    image: product.image,
    additional_images: product.additional_images || [],
    processed_additional_images: product.processed_additional_images || [],
    category_id: product.category_id,
    specs: specs,
    is_new: product.is_new,
    discount_enabled: product.discount_enabled,
    discount_percentage: product.discount_percentage,
    discount_price: product.discount_price,
    discount_start_date: product.discount_start_date,
    discount_end_date: product.discount_end_date,
    watermark_image: product.watermark_image,
    watermark_position: product.watermark_position,
    watermark_opacity: product.watermark_opacity,
    watermark_size: product.watermark_size,
    processed_image: product.processed_image,
    created_at: product.created_at
  };
};

export const productService = {
  async getAll(): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        categories!inner (
          id,
          name,
          discount_enabled,
          discount_percentage,
          discount_start_date,
          discount_end_date
        )
      `)
      .order('created_at', { ascending: false });

    console.log('Raw product data from DB:', data);

    if (error) {
      console.error('Error fetching products:', error);
      throw new Error('Failed to load products');
    }
    
    return (data || []).map(product => ({
      ...product,
      specs: Array.isArray(product.specs) ? product.specs : 
             typeof product.specs === 'object' ? Object.values(product.specs) : [],
      additional_images: Array.isArray(product.additional_images) ? product.additional_images : [],
      processed_additional_images: Array.isArray(product.processed_additional_images) ? product.processed_additional_images : [],
      category_discount_enabled: product.categories?.discount_enabled,
      category_discount_percentage: product.categories?.discount_percentage,
      category_discount_start_date: product.categories?.discount_start_date,
      category_discount_end_date: product.categories?.discount_end_date
    }));
  },

  async getByCategory(category: string): Promise<Product[]> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories:categories!inner (
            id,
            name,
            discount_enabled,
            discount_percentage,
            discount_start_date,
            discount_end_date
          )
        `, { count: 'exact' })
        .eq('categories.slug', category)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error('Не удалось загрузить товары для этой категории');
      }

      return (data || []).map(product => ({
        ...product,
        specs: Array.isArray(product.specs) ? product.specs : 
               typeof product.specs === 'object' ? Object.values(product.specs) : [],
        additional_images: Array.isArray(product.additional_images) ? product.additional_images : [],
        processed_additional_images: Array.isArray(product.processed_additional_images) ? product.processed_additional_images : [],
        category_discount_enabled: product.categories?.discount_enabled,
        category_discount_percentage: product.categories?.discount_percentage,
        category_discount_start_date: product.categories?.discount_start_date,
        category_discount_end_date: product.categories?.discount_end_date
      }));
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Ошибка при загрузке товаров: ${error.message}`);
      }
      throw new Error('Произошла непредвиденная ошибка при загрузке товаров');
    }
  },

  async getById(id: string): Promise<Product | null> {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        categories!inner (
          id,
          name,
          discount_enabled,
          discount_percentage,
          discount_start_date,
          discount_end_date
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;

    if (!data) return null;

    return {
      ...data,
      specs: Array.isArray(data.specs) ? data.specs : 
             typeof data.specs === 'object' ? Object.values(data.specs) : [],
      additional_images: Array.isArray(data.additional_images) ? data.additional_images : [],
      processed_additional_images: Array.isArray(data.processed_additional_images) ? data.processed_additional_images : [],
      category_discount_enabled: data.categories?.discount_enabled,
      category_discount_percentage: data.categories?.discount_percentage,
      category_discount_start_date: data.categories?.discount_start_date,
      category_discount_end_date: data.categories?.discount_end_date
    };
  },

  async create(product: ProductInput): Promise<Product> {
    // Process watermark for main image if enabled
    let processedImage = null;
    let processedAdditionalImages = [];

    if (product.watermark_image && product.image) {
      try {
        processedImage = await imageService.applyWatermark(product.image, {
          enabled: true,
          image: product.watermark_image,
          position: product.watermark_position || 'top-right',
          opacity: product.watermark_opacity || 0.5,
          size: product.watermark_size || 0.2
        });

        // Process additional images if they exist
        if (product.additional_images && product.additional_images.length > 0) {
          processedAdditionalImages = await Promise.all(
            product.additional_images.map(img => 
              imageService.applyWatermark(img, {
                enabled: true,
                image: product.watermark_image!,
                position: product.watermark_position || 'top-right',
                opacity: product.watermark_opacity || 0.5,
                size: product.watermark_size || 0.2
              })
            )
          );
        }
      } catch (error) {
        console.error('Error processing watermarks:', error);
      }
    }

    const { data, error } = await supabase
      .from('products')
      .insert([{
        name: product.name.trim(),
        description: product.description.trim(),
        price: product.price,
        image: product.image.trim(),
        additional_images: product.additional_images || [],
        processed_additional_images: processedAdditionalImages,
        category_id: product.category_id,
        specs: product.specs || [],
        is_new: product.is_new || false,
        discount_enabled: product.discount_enabled,
        discount_percentage: product.discount_percentage,
        discount_price: product.discount_price,
        discount_start_date: product.discount_start_date,
        discount_end_date: product.discount_end_date,
        watermark_image: product.watermark_image,
        watermark_position: product.watermark_position,
        watermark_opacity: product.watermark_opacity,
        watermark_size: product.watermark_size,
        processed_image: processedImage,
        category_path: null // Let the trigger handle this
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Partial<ProductInput>): Promise<Product> {
    let processedImage = null;
    let processedAdditionalImages = [];

    if (updates.watermark_image && updates.image) {
      try {
        processedImage = await imageService.applyWatermark(updates.image, {
          enabled: true,
          image: updates.watermark_image,
          position: updates.watermark_position || 'top-right',
          opacity: updates.watermark_opacity || 0.5,
          size: updates.watermark_size || 0.2
        });

        if (updates.additional_images && updates.additional_images.length > 0) {
          processedAdditionalImages = await Promise.all(
            updates.additional_images.map(img => 
              imageService.applyWatermark(img, {
                enabled: true,
                image: updates.watermark_image!,
                position: updates.watermark_position || 'top-right',
                opacity: updates.watermark_opacity || 0.5,
                size: updates.watermark_size || 0.2
              })
            )
          );
        }
      } catch (error) {
        console.error('Error processing watermarks:', error);
      }
    }

    const { data, error } = await supabase
      .from('products')
      .update({
        ...updates,
        name: updates.name?.trim(),
        description: updates.description?.trim(),
        image: updates.image?.trim(),
        additional_images: updates.additional_images || [],
        processed_additional_images: processedAdditionalImages.length > 0 ? processedAdditionalImages : undefined,
        specs: updates.specs || [],
        is_new: updates.is_new,
        discount_enabled: updates.discount_enabled,
        discount_percentage: updates.discount_percentage,
        discount_price: updates.discount_price,
        discount_start_date: updates.discount_start_date,
        discount_end_date: updates.discount_end_date,
        watermark_image: updates.watermark_image,
        watermark_position: updates.watermark_position,
        watermark_opacity: updates.watermark_opacity,
        watermark_size: updates.watermark_size,
        processed_image: processedImage || updates.processed_image
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async getNewProducts(limit: number = 6): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        categories!inner (
          id,
          name,
          discount_enabled,
          discount_percentage,
          discount_start_date,
          discount_end_date
        )
      `)
      .eq('is_new', true)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;

    return (data || []).map(product => ({
      ...product,
      specs: Array.isArray(product.specs) ? product.specs : 
             typeof product.specs === 'object' ? Object.values(product.specs) : [],
      additional_images: Array.isArray(product.additional_images) ? product.additional_images : [],
      processed_additional_images: Array.isArray(product.processed_additional_images) ? product.processed_additional_images : [],
      category_discount_enabled: product.categories?.discount_enabled,
      category_discount_percentage: product.categories?.discount_percentage,
      category_discount_start_date: product.categories?.discount_start_date,
      category_discount_end_date: product.categories?.discount_end_date
    }));
  }
};
