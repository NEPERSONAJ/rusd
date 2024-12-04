export interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
  slug: string;
  parent_id?: string | null;
  level?: number;
  position?: number;
  discount_enabled?: boolean;
  discount_percentage?: number;
  discount_start_date?: string;
  discount_end_date?: string;
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string;
  og_title?: string;
  og_description?: string;
  og_image?: string;
  schema_markup?: string;
  canonical_url?: string;
  robots_meta?: string;
  created_at?: string;
  path?: string[];
  watermark_enabled?: boolean;
  watermark_image?: string;
  watermark_position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
  watermark_opacity?: number;
  watermark_size?: number;
  processed_image?: string;
}

export interface CategoryInput {
  name: string;
  description: string;
  image: string;
  slug: string;
  parent_id?: string | null;
  level?: number;
  position?: number;
  discount_enabled?: boolean;
  discount_percentage?: number;
  discount_start_date?: string;
  discount_end_date?: string;
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string;
  og_title?: string;
  og_description?: string;
  og_image?: string;
  schema_markup?: string;
  canonical_url?: string;
  robots_meta?: string;
  watermark_enabled?: boolean;
  watermark_image?: string;
  watermark_position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
  watermark_opacity?: number;
  watermark_size?: number;
  processed_image?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  additional_images?: string[];
  processed_additional_images?: string[];
  watermark_image?: string;
  watermark_position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
  watermark_opacity?: number;
  watermark_size?: number;
  processed_image?: string;
  category_id: string;
  specs: string[];
  is_new?: boolean;
  discount_enabled?: boolean;
  discount_percentage?: number;
  discount_price?: number;
  discount_start_date?: string;
  discount_end_date?: string;
  category_discount_enabled?: boolean;
  category_discount_percentage?: number;
  category_discount_start_date?: string;
  category_discount_end_date?: string;
  created_at?: string;
}

export interface ProductInput {
  name: string;
  description: string;
  price: number;
  image: string;
  additional_images?: string[];
  watermark_image?: string;
  watermark_position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
  watermark_opacity?: number;
  processed_image?: string;
  category_id: string;
  specs: string[];
  isNew?: boolean;
  discount_enabled?: boolean;
  discount_percentage?: number;
  discount_price?: number;
  discount_start_date?: string;
  discount_end_date?: string;
}

export interface WatermarkSettings {
  enabled: boolean;
  image: string;
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
  opacity: number;
  size?: number;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at?: string;
  meta_title?: string;
  meta_description?: string;
  tags: string[];
}
export interface ContactMethod {
  type: 'whatsapp' | 'telegram' | 'phone' | 'email' | 'other';
  value: string;
  customLabel?: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  contact_method: ContactMethod;
  message: string;
  created_at: string;
  read: boolean;
}

