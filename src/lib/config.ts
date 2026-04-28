const toBool = (value: string | undefined, fallback = false) => {
  if (value == null) return fallback;
  return ['1', 'true', 'yes', 'on'].includes(value.toLowerCase());
};

const authMode = (import.meta.env.VITE_AUTH_MODE || '').toLowerCase();

export const appConfig = {
  appName: import.meta.env.VITE_APP_NAME || 'Neural Hub',
  apiBaseUrl: (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, ''),
  apiTimeoutMs: Number(import.meta.env.VITE_API_TIMEOUT_MS || 10000),
  authMode: (authMode || (toBool(import.meta.env.VITE_ALLOW_DEMO_AUTH, false) ? 'demo' : 'firebase')) as 'demo' | 'firebase' | 'openclaw',
  firebase: {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  },
};

export const hasFirebaseConfig = Object.values(appConfig.firebase).every(Boolean);
export const isDemoAuth = appConfig.authMode === 'demo';
export const isOpenClawAuth = appConfig.authMode === 'openclaw';
export const hasApiBaseUrl = Boolean(appConfig.apiBaseUrl) || isOpenClawAuth;
