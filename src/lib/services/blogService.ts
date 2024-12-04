import { supabase } from '../supabase';
import { BlogPost } from '../types';
import { generateSlug } from '../utils';

export const blogService = {
  async getAll(): Promise<BlogPost[]> {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('published_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getPublished(): Promise<BlogPost[]> {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('is_published', true)
      .order('published_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getBySlug(slug: string): Promise<BlogPost | null> {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) throw error;
    return data;
  },

  async create(post: Partial<BlogPost>): Promise<BlogPost> {
    // Prepare data
    const postData = {
      id: crypto.randomUUID(),
      title: post.title?.trim(),
      slug: generateSlug(post.title || ''),
      excerpt: post.excerpt?.trim(),
      content: post.content?.trim(),
      image: post.image?.trim(),
      author: post.author?.trim(),
      is_published: post.is_published || false,
      published_at: post.is_published ? new Date().toISOString() : null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      meta_title: post.meta_title?.trim(),
      meta_description: post.meta_description?.trim(),
      tags: Array.isArray(post.tags) ? post.tags : []
    };

    const { data, error } = await supabase
      .from('blog_posts')
      .insert([postData])
      .select()
      .single();

    if (error) {
      console.error('Error creating blog post:', error);
      throw new Error('Ошибка при создании статьи: ' + error.message);
    }

    return data;
  },

  async update(id: string, updates: Partial<BlogPost>): Promise<BlogPost> {
    // Prepare update data
    const updateData: Partial<BlogPost> = {
      title: updates.title?.trim(),
      excerpt: updates.excerpt?.trim(),
      content: updates.content?.trim(),
      image: updates.image?.trim(),
      author: updates.author?.trim(),
      is_published: updates.is_published,
      meta_title: updates.meta_title?.trim(),
      meta_description: updates.meta_description?.trim(),
      tags: Array.isArray(updates.tags) ? updates.tags : undefined,
      updated_at: new Date().toISOString()
    };

    // Only update slug if title is provided
    if (updates.title) {
      updateData.slug = generateSlug(updates.title);
    }

    // Only update published_at if is_published status changes
    if (typeof updates.is_published !== 'undefined') {
      updateData.published_at = updates.is_published ? new Date().toISOString() : null;
    }

    const { data, error } = await supabase
      .from('blog_posts')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating blog post:', error);
      throw new Error('Ошибка при обновлении статьи: ' + error.message);
    }

    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting blog post:', error);
      throw new Error('Ошибка при удалении статьи: ' + error.message);
    }
  }
};
