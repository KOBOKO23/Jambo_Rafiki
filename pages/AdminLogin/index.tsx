import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { SEO } from '@/components/SEO';

export function AdminLoginPage() {
  const navigate = useNavigate();
  const { login, isLoading, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLocalError('');

    if (!email || !password) {
      setLocalError('Email and password are required.');
      return;
    }

    try {
      const success = await login(email, password);
      if (success) {
        navigate('/dashboard', { replace: true });
      }
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Login failed.');
    }
  }

  const displayError = localError || error;

  return (
    <>
      <SEO title="Admin Login" description="Jambo Rafiki staff access" path="/admin/login" noIndex />
      <div className="min-h-screen flex items-center justify-center px-4 py-24 bg-slate-50">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-900 text-white mb-4">
              <Shield className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900">Staff Access</h1>
            <p className="mt-2 text-slate-500">Jambo Rafiki CMS admin dashboard</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            {displayError && (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {displayError}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-900 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                disabled={isLoading}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none transition-colors disabled:bg-slate-50 disabled:text-slate-500 focus:border-slate-400 focus:bg-white"
                autoComplete="email"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-900 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={isLoading}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none transition-colors disabled:bg-slate-50 disabled:text-slate-500 focus:border-slate-400 focus:bg-white"
                autoComplete="current-password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-slate-800 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>

            <p className="text-center text-xs text-slate-500 leading-relaxed">
              Session auth and CSRF are enforced by the backend.{' '}
              <br />
              Use your staff account credentials.
            </p>
          </form>

          {/* Footer hint */}
          <p className="mt-6 text-center text-xs text-slate-500">
            If you don't have access, contact your site administrator.
          </p>
        </div>
      </div>
    </>
  );
}
