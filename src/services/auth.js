import { SIGNIN_URL } from '../constants.js';

const encodeBasic = (identifier, password) => {
  const payload = `${identifier}:${password}`;
  if (typeof window !== 'undefined' && window.btoa) {
    return window.btoa(payload);
  }
  return Buffer.from(payload, 'utf8').toString('base64');
};

const decodeBase64Url = (segment = '') => {
  const padLength = (4 - (segment.length % 4 || 4)) % 4;
  const normalized = segment.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat(padLength);

  if (typeof window !== 'undefined' && window.atob) {
    return decodeURIComponent(
      window
        .atob(normalized)
        .split('')
        .map((c) => `%${c.charCodeAt(0).toString(16).padStart(2, '0')}`)
        .join(''),
    );
  }

  return Buffer.from(normalized, 'base64').toString('utf8');
};

export const decodeJwt = (token) => {
  if (!token) return {};
  const [, payload] = token.split('.');
  if (!payload) return {};
  try {
    return JSON.parse(decodeBase64Url(payload));
  } catch (error) {
    console.warn('Unable to decode JWT payload', error);
    return {};
  }
};

const extractToken = async (response) => {
  const text = await response.text();
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch (error) {
    parsed = null;
  }

  const tokenCandidate = parsed?.token || parsed?.jwt || text.trim();
  const strippedQuotes = tokenCandidate?.replace(/^["'\s]+|["'\s]+$/g, '') ?? '';
  const cleanToken = strippedQuotes.replace(/^(Bearer|JWT)\s+/i, '').trim();
  if (!cleanToken || !cleanToken.includes('.')) {
    throw new Error('Malformed authentication response');
  }

  return cleanToken;
};

export const signin = async (identifier, password) => {
  const response = await fetch(SIGNIN_URL, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${encodeBasic(identifier, password)}`,
    },
  });

  if (!response.ok) {
    const message = response.status === 401 ? 'Invalid credentials' : 'Unable to sign in';
    throw new Error(message);
  }

  const token = await extractToken(response);
  return {
    token,
    payload: decodeJwt(token),
  };
};
