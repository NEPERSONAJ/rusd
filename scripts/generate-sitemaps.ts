import { SitemapGenerator } from '../src/lib/services/sitemapGenerator';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const SITE_URL = process.env.SITE_URL || 'https://rusdecor.info';

async function main() {
  try {
    const generator = new SitemapGenerator(SITE_URL);
    await generator.generateSitemaps();
    console.log('Sitemaps generated successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error generating sitemaps:', error);
    process.exit(1);
  }
}

main();
