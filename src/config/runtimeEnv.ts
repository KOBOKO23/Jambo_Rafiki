type RuntimeEnv = {
  apiUrl: string;
  stripeKey: string;
  enableCredentials: boolean;
};

function isTestMode() {
  return import.meta.env.MODE === 'test';
}

function isProductionLike() {
  return !import.meta.env.DEV && !isTestMode();
}

function firstEnv(...names: string[]) {
  for (const name of names) {
    const value = (import.meta.env as Record<string, string | undefined>)[name]?.trim();
    if (value) {
      return value;
    }
  }

  return '';
}

function requireApiUrl() {
  const value = firstEnv('VITE_API_BASE_URL', 'VITE_API_URL');
  if (value) {
    return value;
  }

  if (import.meta.env.DEV || isTestMode()) {
    return 'http://localhost:8000/api/v1';
  }

  throw new Error('VITE_API_BASE_URL (or VITE_API_URL) is required');
}

function requireStripeKey() {
  const value = firstEnv('VITE_STRIPE_KEY');
  if (value) {
    return value;
  }

  if (import.meta.env.DEV || isTestMode()) {
    return '';
  }

  throw new Error('VITE_STRIPE_KEY is required');
}

function parseBoolean(value: string | undefined, fallback: boolean) {
  if (!value) return fallback;

  const normalized = value.trim().toLowerCase();
  if (['1', 'true', 'yes', 'on'].includes(normalized)) return true;
  if (['0', 'false', 'no', 'off'].includes(normalized)) return false;
  return fallback;
}

export function getRuntimeEnv(): RuntimeEnv {
  return {
    apiUrl: requireApiUrl(),
    stripeKey: requireStripeKey(),
    enableCredentials: parseBoolean(import.meta.env.VITE_ENABLE_CREDENTIALS, true),
  };
}

export function validateRuntimeEnv() {
  if (!isProductionLike()) {
    return;
  }

  // Fail fast during production startup if required config is missing.
  getRuntimeEnv();
}
