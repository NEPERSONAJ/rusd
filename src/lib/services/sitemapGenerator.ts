import { supabase } from '../supabase';
import fs from 'fs';
import path from 'path';

export class SitemapGenerator {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl.replace(/\/$/, ''); // Remove trailing slash
  }

  private async generateCategoriesSitemap(): Promise<string> {
    const { data: categories } = await supabase
      .from('categories')
      .select('slug, updated_at')
      .order('updated_at', { ascending: false });

    const urls = categories?.map(category => `
      <url>
        <loc>${this.baseUrl}/category/${category.slug}</loc>
        <lastmod>${new Date(category.updated_at).toISOString()}</lastmod>
        <changefreq>daily</changefreq>
        <priority>0.8</priority>
      </url>
    `).join('') || '';

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${this.baseUrl}/catalog</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  ${urls}
</urlset>`;
  }

  private async generateProductsSitemap(): Promise<string> {
    const { data: products } = await supabase
      .from('products')
      .select('id, updated_at, category_id, categories!inner(slug)')
      .order('updated_at', { ascending: false });

    const urls = products?.map(product => `
      <url>
        <loc>${this.baseUrl}/category/${product.categories.slug}/product/${product.id}</loc>
        <lastmod>${new Date(product.updated_at).toISOString()}</lastmod>
        <changefreq>daily</changefreq>
        <priority>0.9</priority>
      </url>
    `).join('') || '';

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls}
</urlset>`;
  }

  private async generateBlogSitemap(): Promise<string> {
    const { data: posts } = await supabase
      .from('blog_posts')
      .select('slug, published_at, updated_at')
      .eq('is_published', true)
      .order('published_at', { ascending: false });

    const urls = posts?.map(post => `
      <url>
        <loc>${this.baseUrl}/blog/${post.slug}</loc>
        <lastmod>${new Date(post.updated_at || post.published_at).toISOString()}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.7</priority>
      </url>
    `).join('') || '';

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${this.baseUrl}/blog</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  ${urls}
</urlset>`;
  }

  private async generateSitemapIndex(): Promise<string> {
    const now = new Date().toISOString();
    return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${this.baseUrl}/sitemap-categories.xml</loc>
    <lastmod>${now}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${this.baseUrl}/sitemap-products.xml</loc>
    <lastmod>${now}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${this.baseUrl}/sitemap-blog.xml</loc>
    <lastmod>${now}</lastmod>
  </sitemap>
</sitemapindex>`;
  }

  public async generateSitemaps(): Promise<void> {
    try {
      // Generate all sitemaps
      const [categoriesSitemap, productsSitemap, blogSitemap, sitemapIndex] = await Promise.all([
        this.generateCategoriesSitemap(),
        this.generateProductsSitemap(),
        this.generateBlogSitemap(),
        this.generateSitemapIndex()
      ]);

      // Write files
      const publicDir = path.join(process.cwd(), 'public');
      
      fs.writeFileSync(path.join(publicDir, 'sitemap-categories.xml'), categoriesSitemap);
      fs.writeFileSync(path.join(publicDir, 'sitemap-products.xml'), productsSitemap);
      fs.writeFileSync(path.join(publicDir, 'sitemap-blog.xml'), blogSitemap);
      fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemapIndex);

      console.log('Sitemaps generated successfully');
    } catch (error) {
      console.error('Error generating sitemaps:', error);
      throw error;
    }
  }
}
