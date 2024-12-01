import { supabase } from '../supabase';
import { Product, ProductInput } from '../types';

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
    category_id: product.category_id,
    specs: specs,
    is_new: product.is_new,
    discount_enabled: product.discount_enabled,
    discount_percentage: product.discount_percentage,
    discount_price: product.discount_price,
    discount_start_date: product.discount_start_date,
    discount_end_date: product.discount_end_date,
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
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async create(product: ProductInput): Promise<Product> {
    // Ensure specs is properly formatted for storage
    const specsForDb = product.specs || [];

    const { data, error } = await supabase
      .from('products')
      .insert([{
        name: product.name,
        description: product.description,
        price: product.price,
        image: product.image,
        category_id: product.category_id,
        specs: specsForDb,
        is_new: product.isNew || false,
        discount_enabled: product.discount_enabled,
        discount_percentage: product.discount_percentage,
        discount_price: product.discount_price,
        discount_start_date: product.discount_start_date,
        discount_end_date: product.discount_end_date,
        category_path: null // Let the trigger handle this
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Partial<ProductInput>): Promise<Product> {
    const { isNew, discount_enabled, discount_percentage, discount_price, discount_start_date, discount_end_date, ...rest } = updates;
    
    const dbUpdates = {
      ...rest,
      specs: updates.specs || [],
      is_new: isNew,
      discount_enabled,
      discount_percentage,
      discount_price,
      discount_start_date,
      discount_end_date
};


    const { data, error } = await supabase
      .from('products')
      .update(dbUpdates)
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
      .select('*')
      .eq('is_new', true)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  }
};
