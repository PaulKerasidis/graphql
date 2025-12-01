const STORAGE_KEY = 'zone01ProfileSession';

const defaultSession = {
  token: null,
  userId: null,
  login: null,
};

const hasStorage = () => typeof window !== 'undefined' && window.sessionStorage;

export const loadSession = () => {
  if (!hasStorage()) return { ...defaultSession };
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    return raw ? { ...defaultSession, ...JSON.parse(raw) } : { ...defaultSession };
  } catch (error) {
    console.warn('Failed to load session', error);
    return { ...defaultSession };
  }
};

export const saveSession = (partial) => {
  if (!hasStorage()) return;
  const next = { ...loadSession(), ...partial };
  window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
};

export const clearSession = () => {
  if (!hasStorage()) return;
  window.sessionStorage.removeItem(STORAGE_KEY);
};
