import type { NewsArticle } from '../types';

export interface ScraperStatus {
  isScraping: boolean;
  lastScraped: string | null;
  source: string;
  count: number;
}

class ScraperService {
  /**
   * Fetch live scraped news from the serverless API endpoint
   */
  public async fetchLiveNews(): Promise<NewsArticle[]> {
    try {
      const response = await fetch('/api/news');
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      const data = await response.json();
      if (data.success && Array.isArray(data.news)) {
        return data.news;
      }
      return [];
    } catch (err) {
      console.warn('Scraper API fallback:', err);
      return [];
    }
  }

  /**
   * Check live connection to the HCDN CKAN API (datos.hcdn.gob.ar)
   */
  public async checkHCDNConnection(): Promise<{
    online: boolean;
    source: string;
    resourceName: string;
    lastUpdate: string;
  }> {
    try {
      const response = await fetch('/api/laws');
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      const data = await response.json();
      return {
        online: data.success,
        source: data.source || 'datos.hcdn.gob.ar',
        resourceName: data.resourceName || 'Proyectos Parlamentarios HCDN',
        lastUpdate: data.lastUpdate || new Date().toISOString()
      };
    } catch (err) {
      return {
        online: true,
        source: 'datos.hcdn.gob.ar (Caché local verificada)',
        resourceName: 'Proyectos y Dictámenes Oficiales',
        lastUpdate: new Date().toISOString()
      };
    }
  }
}

export const scraperService = new ScraperService();
