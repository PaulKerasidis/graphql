const TARGET_BASE = 'https://platform.zone01.gr';
const ALLOWED_HEADERS = ['content-type', 'authorization', 'accept', 'x-requested-with'];

const corsHeaders = (origin) => ({
  'Access-Control-Allow-Origin': origin || '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': ALLOWED_HEADERS.join(', '),
});

exports.handler = async function handler(event) {
  const origin = event.headers.origin || '*';

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders(origin),
      body: '',
    };
  }

  const path = event.path
    .replace(/^\/.netlify\/functions\/[^/]+/, '')
    .replace(/^\/zone01/, '');
  const query = event.rawQuery ? `?${event.rawQuery}` : '';
  const upstreamUrl = `${TARGET_BASE}${path}${query}`;

  try {
    const res = await fetch(upstreamUrl, {
      method: event.httpMethod,
      headers: {
        'content-type': event.headers['content-type'],
        accept: event.headers.accept,
        authorization: event.headers.authorization,
      },
      body: event.body,
    });

    const text = await res.text();

    return {
      statusCode: res.status,
      headers: {
        ...corsHeaders(origin),
        'content-type': res.headers.get('content-type') || 'text/plain',
      },
      body: text,
    };
  } catch (error) {
    return {
      statusCode: 502,
      headers: corsHeaders(origin),
      body: JSON.stringify({ error: 'Proxy error', detail: error.message }),
    };
  }
};
