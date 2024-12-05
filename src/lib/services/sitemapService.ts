import { supabase } from '../supabase';
import { settingsService } from './settingsService';

interface SitemapURL {
  loc: string;
  lastmod?: string;
  changefreq?: string;
  priority?: number;
}

export const sitemapService = {
  async generateSitemaps(): Promise<void> {
    const settings = await settingsService.getAll();
    const baseUrl = settings.site_url.replace(/\/$/, '');

    // Generate main sitemap index
    const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${baseUrl}/sitemap-categories.xml</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-products.xml</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-blog.xml</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-static.xml</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>
</sitemapindex>`;

    // Generate categories sitemap
    const { data: categories } = await supabase
      .from('categories')
      .select('slug, updated_at')
      .order('updated_at', { ascending: false });

    const categoryUrls: SitemapURL[] = (categories || []).map(category => ({
      loc: `${baseUrl}/category/${category.slug}`,
      lastmod: category.updated_at,
      changefreq: 'weekly',
      priority: 0.8
    }));

    // Generate products sitemap
    const { data: products } = await supabase
      .from('products')
      .select('id, updated_at, category_id, categories!inner(slug)')
      .order('updated_at', { ascending: false });

    const productUrls: SitemapURL[] = (products || []).map(product => ({
      loc: `${baseUrl}/category/${product.categories.slug}/product/${product.id}`,
      lastmod: product.updated_at,
      changefreq: 'daily',
      priority: 1.0
    }));

    // Generate blog sitemap
    const { data: blogPosts } = await supabase
      .from('blog_posts')
      .select('slug, published_at, updated_at')
      .eq('is_published', true)
      .order('published_at', { ascending: false });

    const blogUrls: SitemapURL[] = (blogPosts || []).map(post => ({
      loc: `${baseUrl}/blog/${post.slug}`,
      lastmod: post.updated_at || post.published_at,
      changefreq: 'weekly',
      priority: 0.6
    }));

    // Static pages
    const staticUrls: SitemapURL[] = [
      { loc: baseUrl, changefreq: 'daily', priority: 1.0 },
      { loc: `${baseUrl}/catalog`, changefreq: 'daily', priority: 0.9 },
      { loc: `${baseUrl}/sale`, changefreq: 'daily', priority: 0.8 },
      { loc: `${baseUrl}/blog`, changefreq: 'daily', priority: 0.7 },
      { loc: `${baseUrl}/about`, changefreq: 'monthly', priority: 0.6 },
      { loc: `${baseUrl}/contact`, changefreq: 'monthly', priority: 0.6 },
      { loc: `${baseUrl}/calculators`, changefreq: 'monthly', priority: 0.6 }
    ];

    // Generate individual sitemaps
    const categoriesSitemap = this.generateSitemapXML([...staticUrls, ...categoryUrls]);
    const productsSitemap = this.generateSitemapXML(productUrls);
    const blogSitemap = this.generateSitemapXML(blogUrls);
    const staticSitemap = this.generateSitemapXML(staticUrls);

    // Save sitemaps to public directory
    const fs = require('fs');
    const path = require('path');
    const publicDir = path.join(process.cwd(), 'public');

    fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemapIndex);
    fs.writeFileSync(path.join(publicDir, 'sitemap-categories.xml'), categoriesSitemap);
    fs.writeFileSync(path.join(publicDir, 'sitemap-products.xml'), productsSitemap);
    fs.writeFileSync(path.join(publicDir, 'sitemap-blog.xml'), blogSitemap);
    fs.writeFileSync(path.join(publicDir, 'sitemap-static.xml'), staticSitemap);
  },

  generateSitemapXML(urls: SitemapURL[]): string {
    const urlset = urls.map(url => `
  <url>
    <loc>${this.escapeXML(url.loc)}</loc>
    ${url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : ''}
    ${url.changefreq ? `<changefreq>${url.changefreq}</changefreq>` : ''}
    ${url.priority ? `<priority>${url.priority}</priority>` : ''}
  </url>`).join('');

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urlset}
</urlset>`;
  },

  escapeXML(str: string): string {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }
};
