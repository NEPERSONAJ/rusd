import { supabase } from '../supabase';
import { Category, CategoryInput } from '../types';
import { imageService } from './imageService';

export const categoryService = {
  async getAll(): Promise<Category[]> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('position', { ascending: true })
      .order('name');

    if (error) throw error;
    return data || [];
  },

  async updatePositions(updates: { id: string; position: number }[]): Promise<void> {
    for (const update of updates) {
      const { error } = await supabase
        .from('categories')
        .update({ position: update.position })
        .eq('id', update.id);

      if (error) throw error;
    }
  },

  async getBySlug(slug: string): Promise<Category | null> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) throw error;
    return data;
  },

  async create(category: CategoryInput): Promise<Category> {
    // Get max position
    const { data: maxPositionData, error: maxPositionError } = await supabase
      .from('categories')
      .select('position')
      .order('position', { ascending: false })
      .limit(1);

    const nextPosition = maxPositionData && maxPositionData[0] 
      ? (maxPositionData[0].position || 0) + 1 
      : 0;

    // Validate input data
    if (!category.name?.trim()) throw new Error('Название категории обязательно');
    if (!category.slug?.trim()) throw new Error('URL категории обязателен');
    if (!category.image?.trim()) throw new Error('Изображение категории обязательно');

    // Process watermark if enabled
    let processedImage = null;
    if (category.watermark_enabled && category.watermark_image) {
      try {
        processedImage = await imageService.applyWatermark(
          category.image,
          {
            enabled: true,
            image: category.watermark_image,
            position: category.watermark_position || 'top-right',
            opacity: category.watermark_opacity || 0.5,
            size: category.watermark_size || 0.2
          }
        );
      } catch (error) {
        console.error('Error applying watermark:', error);
      }
    }

    // Ensure all required fields are present and properly formatted
    const categoryData = {
      name: category.name.trim(),
      description: category.description?.trim() || '',
      image: category.image.trim(),
      slug: category.slug.trim(),
      parent_id: category.parent_id || null,
      level: category.parent_id ? 1 : 0,
      path: [],
      position: nextPosition,
      discount_enabled: category.discount_enabled || false,
      discount_percentage: category.discount_enabled && category.discount_percentage 
        ? Number(category.discount_percentage) || 0 
        : null,
      discount_start_date: category.discount_enabled && category.discount_start_date 
        ? new Date(category.discount_start_date).toISOString() 
        : null,
      discount_end_date: category.discount_enabled && category.discount_end_date 
        ? new Date(category.discount_end_date).toISOString() 
        : null,
      seo_title: category.seo_title?.trim() || null,
      seo_description: category.seo_description?.trim() || null,
      seo_keywords: category.seo_keywords?.trim() || null,
      og_title: category.og_title?.trim() || null,
      og_description: category.og_description?.trim() || null,
      og_image: category.og_image?.trim() || null,
      schema_markup: category.schema_markup?.trim() || null,
      canonical_url: category.canonical_url?.trim() || null,
      robots_meta: category.robots_meta || 'index, follow',
      watermark_image: category.watermark_enabled ? category.watermark_image : null,
      watermark_position: category.watermark_enabled ? category.watermark_position : null,
      watermark_opacity: category.watermark_enabled ? category.watermark_opacity : null,
      watermark_size: category.watermark_enabled ? category.watermark_size : null,
      processed_image: processedImage,
      created_at: new Date().toISOString()
    };

    console.log('Creating category with data:', categoryData);

    const { data, error } = await supabase
      .from('categories')
      .insert([categoryData])
      .select()
      .single();

    if (error) {
      console.error('Error creating category:', error);
      let errorMessage = 'Ошибка при создании категории';
      if (error.code === '23505') {
        errorMessage = 'Категория с таким URL уже существует';
      } else if (error.code === '23503') {
        errorMessage = 'Указанная родительская категория не существует';
      }
      throw new Error(errorMessage);
    }
    
    if (!data) {
      throw new Error('Не удалось получить данные созданной категории');
    }

    return data;
  },

  async update(id: string, updates: Partial<CategoryInput>): Promise<Category> {
    const { level, children, ...validUpdates } = updates as any;

    if (!id) {
      throw new Error('ID категории не указан');
    }

    try {
      // Process watermark if enabled and image is present
      let processedImage = null;
      if (validUpdates.watermark_enabled && validUpdates.watermark_image && validUpdates.image) {
        try {
          processedImage = await imageService.applyWatermark(
            validUpdates.image,
            {
              enabled: true,
              image: validUpdates.watermark_image,
              position: validUpdates.watermark_position || 'top-right',
              opacity: validUpdates.watermark_opacity || 0.5,
              size: validUpdates.watermark_size || 0.2
            }
          );
        } catch (error) {
          console.error('Error applying watermark:', error);
        }
      }

      const formattedUpdates = {
        ...validUpdates,
        parent_id: validUpdates.parent_id || null,
        discount_enabled: Boolean(validUpdates.discount_enabled),
        discount_percentage: validUpdates.discount_enabled && validUpdates.discount_percentage 
          ? Number(validUpdates.discount_percentage) || 0 
          : null,
        discount_start_date: validUpdates.discount_enabled && validUpdates.discount_start_date 
          ? new Date(validUpdates.discount_start_date).toISOString() 
          : null,
        discount_end_date: validUpdates.discount_enabled && validUpdates.discount_end_date 
          ? new Date(validUpdates.discount_end_date).toISOString() 
          : null,
        watermark_image: validUpdates.watermark_enabled ? validUpdates.watermark_image : null,
        watermark_position: validUpdates.watermark_enabled ? validUpdates.watermark_position : null,
        watermark_opacity: validUpdates.watermark_enabled ? validUpdates.watermark_opacity : null,
        watermark_size: validUpdates.watermark_enabled ? validUpdates.watermark_size : null,
        processed_image: processedImage,
        seo_title: validUpdates.seo_title?.trim() || null,
        seo_description: validUpdates.seo_description?.trim() || null,
        seo_keywords: validUpdates.seo_keywords?.trim() || null,
        og_title: validUpdates.og_title?.trim() || null,
        og_description: validUpdates.og_description?.trim() || null,
        og_image: validUpdates.og_image?.trim() || null,
        schema_markup: validUpdates.schema_markup?.trim() || null,
        canonical_url: validUpdates.canonical_url?.trim() || null,
        robots_meta: validUpdates.robots_meta || 'index, follow'
      };

      console.log('Updating category with data:', formattedUpdates);

      const { data, error } = await supabase
        .from('categories')
        .update(formattedUpdates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating category:', error);
        let errorMessage = 'Ошибка при обновлении категории';
        if (error.code === '23505') {
          errorMessage = 'Категория с таким URL уже существует';
        } else if (error.code === '23503') {
          errorMessage = 'Указанная родительская категория не существует';
        }
        throw new Error(errorMessage);
      }

      if (!data) {
        throw new Error('Не удалось получить обновленные данные категории');
      }

      return data;
    } catch (error) {
      console.error('Error in categoryService.update:', error);
      throw error;
    }
  },

  async delete(id: string): Promise<void> {
    // First check if category has child categories
    const { data: childCategories, error: checkError } = await supabase
      .from('categories')
      .select('id')
      .eq('parent_id', id);

    if (checkError) throw checkError;

    if (childCategories && childCategories.length > 0) {
      throw new Error('Нельзя удалить категорию, содержащую подкатегории. Сначала удалите все подкатегории.');
    }

    // Check if category has products
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id')
      .eq('category_id', id);

    if (productsError) throw productsError;

    if (products && products.length > 0) {
      throw new Error('Нельзя удалить категорию, содержащую товары. Сначала удалите или переместите все товары из этой категории.');
    }

    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};