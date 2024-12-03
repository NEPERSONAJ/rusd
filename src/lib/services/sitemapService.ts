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

    const categoriesSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/catalog</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  ${categoryUrls.map(url => `
  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('')}
</urlset>`;

    // Generate products sitemap
    const { data: products } = await supabase
      .from('products')
      .select('id, updated_at, category_id, categories!inner(slug)')
      .order('updated_at', { ascending: false });

    const productsSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${(products || []).map(product => `
  <url>
    <loc>${baseUrl}/category/${product.categories.slug}/product/${product.id}</loc>
    <lastmod>${new Date(product.updated_at).toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>`).join('')}
</urlset>`;

    // Generate blog sitemap
    const { data: posts } = await supabase
      .from('blog_posts')
      .select('slug, published_at, updated_at')
      .eq('is_published', true)
      .order('published_at', { ascending: false });

    const blogSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/blog</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  ${(posts || []).map(post => `
  <url>
    <loc>${baseUrl}/blog/${post.slug}</loc>
    <lastmod>${new Date(post.updated_at || post.published_at).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`).join('')}
</urlset>`;

    // Save sitemaps to Supabase storage
    const { error: mainError } = await supabase
      .storage
      .from('public')
      .upload('sitemap.xml', sitemapIndex, {
        contentType: 'application/xml',
        cacheControl: '3600',
        upsert: true
      });

    const { error: categoriesError } = await supabase
      .storage
      .from('public')
      .upload('sitemap-categories.xml', categoriesSitemap, {
        contentType: 'application/xml',
        cacheControl: '3600',
        upsert: true
      });

    const { error: productsError } = await supabase
      .storage
      .from('public')
      .upload('sitemap-products.xml', productsSitemap, {
        contentType: 'application/xml',
        cacheControl: '3600',
        upsert: true
      });

    const { error: blogError } = await supabase
      .storage
      .from('public')
      .upload('sitemap-blog.xml', blogSitemap, {
        contentType: 'application/xml',
        cacheControl: '3600',
        upsert: true
      });

    if (mainError || categoriesError || productsError || blogError) {
      throw new Error('Failed to save sitemaps');
    }
  }
};
