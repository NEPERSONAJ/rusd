import { sitemapService } from './sitemapService';

export const cronService = {
  async runDailyTasks(): Promise<void> {
    try {
      // Generate fresh sitemaps
      await sitemapService.generateSitemaps();
      console.log('Sitemaps generated successfully');
    } catch (error) {
      console.error('Error running daily tasks:', error);
      throw error;
    }
  }
};
