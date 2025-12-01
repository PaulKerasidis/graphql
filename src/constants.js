const REMOTE_BASE = 'https://platform.zone01.gr';
const API_BASE = import.meta.env.DEV ? '/zone01' : REMOTE_BASE;

export const SIGNIN_URL = `${API_BASE}/api/auth/signin`;
export const GRAPHQL_URL = `${API_BASE}/api/graphql-engine/v1/graphql`;
export const APP_TITLE = 'Zone01 Profile Dashboard';
