const REMOTE_BASE = 'https://platform.zone01.gr';
// Always use relative paths to leverage proxies (Vite dev proxy + Vercel rewrites)
const API_BASE = import.meta.env.VITE_API_BASE ?? '';

export const SIGNIN_URL = `${API_BASE}/api/auth/signin`;
export const GRAPHQL_URL = `${API_BASE}/api/graphql-engine/v1/graphql`;
export const APP_TITLE = 'Zone01 Profile Dashboard';
