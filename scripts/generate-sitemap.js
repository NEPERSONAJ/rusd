import { cronService } from '../src/lib/services/cronService.js';

// Run sitemap generation
cronService.runDailyTasks()
  .then(() => {
    console.log('Sitemap generation completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error generating sitemaps:', error);
    process.exit(1);
  });
