// Vercel Serverless Function — proxy a GNews.
// La API key vive en process.env.GNEWS_API_KEY (configurada en Vercel),
// nunca llega al navegador.

export default {
  async fetch(request) {
    const apiKey = process.env.GNEWS_API_KEY;
    if (!apiKey) {
      return Response.json(
        { error: 'GNEWS_API_KEY no está configurada en Vercel.' },
        { status: 500 }
      );
    }

    const url = new URL(request.url);
    const q = url.searchParams.get('q') || 'tecnologia';
    const max = url.searchParams.get('max') || '3';
    const lang = url.searchParams.get('lang') || 'es';

    const gnewsUrl = `https://gnews.io/api/v4/search?${new URLSearchParams({
      q,
      lang,
      max,
      apikey: apiKey
    })}`;

    try {
      const upstream = await fetch(gnewsUrl);
      const body = await upstream.json();

      if (!upstream.ok) {
        return Response.json(body, { status: upstream.status });
      }

      // Cache CDN 10 min, sirve stale 1h mientras revalida.
      // Mantiene el consumo de GNews bajo el límite gratuito (100 req/día).
      return Response.json(body, {
        status: 200,
        headers: {
          'Cache-Control': 's-maxage=600, stale-while-revalidate=3600'
        }
      });
    } catch (err) {
      return Response.json(
        { error: `Fallo al contactar GNews: ${err.message}` },
        { status: 502 }
      );
    }
  }
};
