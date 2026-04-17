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

function resolveApiUrl() {
  const value = firstEnv('VITE_API_BASE_URL', 'VITE_API_URL');
  if (value) {
    return value;
  }

  if (import.meta.env.DEV || isTestMode()) {
    return 'http://localhost:8000/api/v1';
  }

  // Keep production app renderable even if env is missing.
  return '/api/v1';
}

function resolveStripeKey() {
  const value = firstEnv('VITE_STRIPE_KEY');
  if (value) {
    return value;
  }

  return '';
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
    apiUrl: resolveApiUrl(),
    stripeKey: resolveStripeKey(),
    enableCredentials: parseBoolean(import.meta.env.VITE_ENABLE_CREDENTIALS, true),
  };
}

export function validateRuntimeEnv() {
  if (!isProductionLike()) {
    return;
  }

  const problems: string[] = [];

  if (!firstEnv('VITE_API_BASE_URL', 'VITE_API_URL')) {
    problems.push('Missing VITE_API_BASE_URL (or VITE_API_URL). Falling back to /api/v1.');
  }

  if (!firstEnv('VITE_STRIPE_KEY')) {
    problems.push('Missing VITE_STRIPE_KEY. Card donations will be unavailable.');
  }

  if (problems.length > 0) {
    console.warn('[runtimeEnv] Production environment warnings:\n- ' + problems.join('\n- '));
  }
}
