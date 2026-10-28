export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate=1200');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Query HCDN CKAN API for dictamenes and projects
    const ckanResponse = await fetch('https://datos.hcdn.gob.ar/api/3/action/package_show?id=proyectos-parlamentarios', {
      headers: { 'User-Agent': 'Mozilla/5.0 Si-o-No-Civic-App' }
    });
    
    const ckanData = await ckanResponse.json();
    const resources = ckanData.result?.resources || [];
    const jsonResource = resources.find(r => r.format === 'JSON') || resources[0];

    return res.status(200).json({
      success: true,
      source: 'datos.hcdn.gob.ar',
      endpoint: 'https://datos.hcdn.gob.ar/api/3/action/package_show?id=proyectos-parlamentarios',
      resourceName: jsonResource?.name || 'Proyectos Parlamentarios HCDN',
      resourceUrl: jsonResource?.url || 'https://datos.hcdn.gob.ar/',
      status: 'Online & Verificado',
      lastUpdate: new Date().toISOString()
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
}
