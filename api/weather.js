// Vercel Serverless Function — proxy a OpenWeatherMap.
// La API key vive en process.env.OPENWEATHER_API_KEY (configurada en Vercel),
// nunca llega al navegador.

export default {
  async fetch(request) {
    const apiKey = (process.env.OPENWEATHER_API_KEY ?? '').trim();
    if (!apiKey) {
      return Response.json(
        {
          error:
            'OPENWEATHER_API_KEY no llegó a este deployment. Configúrala en Vercel → Settings → Environment Variables (Production), guarda y redeploy.',
          envVarPresent: 'OPENWEATHER_API_KEY' in process.env
        },
        { status: 500 }
      );
    }

    const url = new URL(request.url);
    const q = url.searchParams.get('q');
    const lat = url.searchParams.get('lat');
    const lon = url.searchParams.get('lon');

    if (!q && !(lat && lon)) {
      return Response.json(
        { error: 'Falta el parámetro `q` (ciudad) o `lat`+`lon` (coordenadas).' },
        { status: 400 }
      );
    }

    const params = new URLSearchParams({
      appid: apiKey,
      units: 'metric',
      lang: 'es'
    });
    if (q) params.set('q', q);
    if (lat && lon) {
      params.set('lat', lat);
      params.set('lon', lon);
    }

    try {
      const upstream = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?${params}`
      );
      const body = await upstream.json();

      if (!upstream.ok) {
        return Response.json(body, { status: upstream.status });
      }

      // Cache CDN 10 min — el clima no cambia tanto y reduce llamadas a OWM.
      return Response.json(body, {
        status: 200,
        headers: {
          'Cache-Control': 's-maxage=600, stale-while-revalidate=1800'
        }
      });
    } catch (err) {
      return Response.json(
        { error: `Fallo al contactar OpenWeatherMap: ${err.message}` },
        { status: 502 }
      );
    }
  }
};
