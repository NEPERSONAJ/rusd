import { supabase } from '../supabase';

export interface AnalyticsData {
  period: string;
  unique_visitors: number;
  total_visits: number;
  whatsapp_clicks: number;
  conversion_rate: number;
}

export interface PopularProduct {
  id: string;
  name: string;
  image: string;
  clicks: number;
  last_click: string;
  conversion_rate: number;
}

const visitedPages = new Set<string>();
const lastVisitTime = new Map<string, number>();
const VISIT_COOLDOWN = 5 * 60 * 1000; // 5 minutes
const currentPageLoadTracked = new Set<string>();

export const analyticsService = {
  async getDailyStats(days: number = 7): Promise<AnalyticsData[]> {
    const { data, error } = await supabase
      .from('daily_stats')
      .select('*')
      .gte('date', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString())
      .order('date', { ascending: false })
      .limit(days);

    if (error) {
      console.error('Analytics error:', error);
      return [];
    }

    return (data || []).map(row => ({
      period: new Date(row.date).toISOString().split('T')[0],
      unique_visitors: row.unique_visitors,
      total_visits: row.total_visits,
      whatsapp_clicks: row.whatsapp_clicks,
      conversion_rate: row.conversion_rate
    }));
  },

  async getWeeklyStats(weeks: number = 4): Promise<AnalyticsData[]> {
    const { data, error } = await supabase
      .from('weekly_stats')
      .select('*')
      .gte('week', new Date(Date.now() - weeks * 7 * 24 * 60 * 60 * 1000).toISOString())
      .order('week', { ascending: false })
      .limit(weeks);

    if (error) {
      console.error('Analytics error:', error);
      return [];
    }

    return (data || []).map(row => ({
      period: new Date(row.week).toISOString().split('T')[0],
      unique_visitors: row.unique_visitors,
      total_visits: row.total_visits,
      whatsapp_clicks: row.whatsapp_clicks,
      conversion_rate: row.conversion_rate
    }));
  },

  async getMonthlyStats(months: number = 12): Promise<AnalyticsData[]> {
    const { data, error } = await supabase
      .from('monthly_stats')
      .select('*')
      .gte('month', new Date(Date.now() - months * 30 * 24 * 60 * 60 * 1000).toISOString())
      .order('month', { ascending: false })
      .limit(months);

    if (error) {
      console.error('Analytics error:', error);
      return [];
    }

    return (data || []).map(row => ({
      period: new Date(row.month).toISOString().split('T')[0],
      unique_visitors: row.unique_visitors,
      total_visits: row.total_visits,
      whatsapp_clicks: row.whatsapp_clicks,
      conversion_rate: row.conversion_rate
    }));
  },

  async getYearlyStats(): Promise<AnalyticsData[]> {
    const { data, error } = await supabase
      .from('yearly_stats')
      .select('*')
      .order('year', { ascending: false });

    if (error) {
      console.error('Analytics error:', error);
      return [];
    }

    return (data || []).map(row => ({
      period: new Date(row.year).toISOString().split('T')[0],
      unique_visitors: row.unique_visitors,
      total_visits: row.total_visits,
      whatsapp_clicks: row.whatsapp_clicks,
      conversion_rate: row.conversion_rate
    }));
  },

  async getPopularProducts(page: number = 1, limit: number = 5): Promise<{ data: PopularProduct[], total: number }> {
    const offset = (page - 1) * limit;
    
    const { data, error } = await supabase
      .rpc('get_popular_products', { 
        limit_count: limit,
        offset_count: offset
      });

    if (error) {
      console.error('Error fetching popular products:', error);
      return { data: [], total: 0 };
    }

    // Get total count
    const { count } = await supabase
      .from('whatsapp_clicks')
      .select('*', { count: 'exact', head: true });

    return {
      data: data || [],
      total: count || 0
    };
  },

  async trackVisit(pageUrl: string): Promise<void> {
    try {
      if (pageUrl.startsWith('/admin')) {
        return;
      }

      let visitorId = localStorage.getItem('visitor_id');
      if (!visitorId) {
        visitorId = `${Math.random().toString(36).substring(2)}${Date.now().toString(36)}`;
        localStorage.setItem('visitor_id', visitorId);
      }

      const trackingKey = `${visitorId}-${pageUrl}`;

      if (currentPageLoadTracked.has(trackingKey)) {
        return;
      }

      const now = Date.now();
      const lastVisit = lastVisitTime.get(trackingKey);
      if (lastVisit && now - lastVisit < VISIT_COOLDOWN) {
        return;
      }

      currentPageLoadTracked.add(trackingKey);
      lastVisitTime.set(trackingKey, now);

      const { error } = await supabase.rpc('track_visit', {
        page_url: pageUrl,
        visitor_id: visitorId,
        device: navigator.userAgent,
        source: document.referrer || null,
        country: null
      });

      if (error) {
        console.error('Error tracking visit:', error);
        return;
      }

      if (!visitedPages.has(pageUrl)) {
        visitedPages.add(pageUrl);
      }

      setTimeout(() => {
        currentPageLoadTracked.delete(trackingKey);
      }, VISIT_COOLDOWN);

    } catch (error) {
      console.error('Error in trackVisit:', error);
    }
  },

  async trackWhatsAppClick(productId: string): Promise<void> {
    try {
      const visitorId = localStorage.getItem('visitor_id');
      if (!visitorId) {
        console.error('No visitor ID found for WhatsApp click tracking');
        return;
      }

      const { error } = await supabase
        .from('whatsapp_clicks')
        .insert([{
          product_id: productId,
          visitor_id: visitorId
        }]);

      if (error) {
        console.error('Error tracking WhatsApp click:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error in trackWhatsAppClick:', error);
      throw error;
    }
  }
};
