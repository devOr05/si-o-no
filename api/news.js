export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const FEEDS = [
    {
      source: 'Clarín',
      logo: 'CLARIN',
      category: 'Sociedad',
      url: 'https://www.clarin.com/rss/lo-ultimo/'
    },
    {
      source: 'BBC Mundo',
      logo: 'BBC',
      category: 'Tecnología',
      url: 'https://feeds.bbci.co.uk/mundo/rss.xml'
    },
    {
      source: 'La Nación',
      logo: 'LA NACION',
      category: 'Política',
      url: 'https://www.lanacion.com.ar/arc/outboundfeeds/rss/?outputType=xml'
    }
  ];

  try {
    const results = await Promise.allSettled(
      FEEDS.map(async (feed) => {
        const response = await fetch(feed.url, {
          headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Si-o-No-Civic-App' }
        });
        const xml = await response.text();
        const items = xml.match(/<item>[\s\S]*?<\/item>/g) || [];

        return items.slice(0, 4).map((item, idx) => {
          const rawTitle = item.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/) || item.match(/<title>(.*?)<\/title>/);
          const rawDesc = item.match(/<description><!\[CDATA\[(.*?)\]\]><\/description>/) || item.match(/<description>(.*?)<\/description>/);
          const rawLink = item.match(/<link>(.*?)<\/link>/);

          let title = rawTitle ? rawTitle[1].replace(/<\/?[^>]+(>|$)/g, '').trim() : 'Noticia';
          let desc = rawDesc ? rawDesc[1].replace(/<\/?[^>]+(>|$)/g, '').trim() : '';
          let link = rawLink ? rawLink[1].trim() : '#';

          // Detect category from title keywords
          let category = feed.category;
          const lower = (title + ' ' + desc).toLowerCase();
          if (lower.includes('inflación') || lower.includes('dólar') || lower.includes('banco central') || lower.includes('mercado') || lower.includes('precios')) {
            category = 'Economía';
          } else if (lower.includes('gobierno') || lower.includes('congreso') || lower.includes('diputados') || lower.includes('senado') || lower.includes('ministro') || lower.includes('ley')) {
            category = 'Política';
          } else if (lower.includes('fútbol') || lower.includes('selección') || lower.includes('gol') || lower.includes('messi') || lower.includes('campeonato')) {
            category = 'Deportes';
          } else if (lower.includes('ia') || lower.includes('inteligencia artificial') || lower.includes('tecnología') || lower.includes('celular') || lower.includes('redes')) {
            category = 'Tecnología';
          } else if (lower.includes('música') || lower.includes('cine') || lower.includes('serie') || lower.includes('teatro') || lower.includes('artista')) {
            category = 'Espectáculos';
          }

          // Generate 3 structured bullets
          const sentences = desc.split(/[.!?]+/).map(s => s.trim()).filter(s => s.length > 15);
          let b1 = sentences[0] || `${title}.`;
          let b2 = sentences[1] || `Cobertura y detalles informados por la redacción de ${feed.source}.`;
          let b3 = sentences[2] || `Seguimiento de la coyuntura e impacto en la opinión pública.`;

          return {
            id: `live-${feed.source.toLowerCase()}-${idx}-${Date.now()}`,
            source: feed.source,
            sourceLogoText: feed.logo,
            category,
            title,
            timeAgo: 'En vivo',
            bullets: [b1, b2, b3],
            readTime: '2 min',
            url: link,
            likes: Math.floor(150 + Math.random() * 400),
            userLiked: false
          };
        });
      })
    );

    const liveNews = results
      .filter((r) => r.status === 'fulfilled')
      .flatMap((r) => r.value)
      .slice(0, 10);

    return res.status(200).json({
      success: true,
      timestamp: new Date().toISOString(),
      count: liveNews.length,
      news: liveNews
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
}
