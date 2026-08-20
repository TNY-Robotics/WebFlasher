export default defineEventHandler(async (event) => {
    const query = getQuery(event);
    const targetUrl = query.url as string;

    if (!targetUrl) {
        throw createError({ statusCode: 400, statusMessage: 'URL manquante' });
    }

    const response = await fetch(targetUrl, {
        method: 'GET',
        headers: {
            'Accept': 'application/octet-stream'
        }
    });

    if (!response.ok) {
        throw createError({ statusCode: response.status, statusMessage: 'Erreur GitHub' });
    }

    const contentType = response.headers.get('content-type') || 'application/octet-stream';
    setHeader(event, 'Content-Type', contentType);

    return response.body;
});