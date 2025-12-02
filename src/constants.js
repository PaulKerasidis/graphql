const REMOTE_BASE = 'https://platform.zone01.gr';
// Use relative paths in development to leverage Vite proxy, full URL in production
const API_BASE = import.meta.env.VITE_API_BASE ?? (import.meta.env.DEV ? '' : REMOTE_BASE);

export const SIGNIN_URL = `${API_BASE}/api/auth/signin`;
export const GRAPHQL_URL = `${API_BASE}/api/graphql-engine/v1/graphql`;
export const APP_TITLE = 'Zone01 Profile Dashboard';
