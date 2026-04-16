import { useEffect, useState } from 'react';
import { ShieldAlert, Loader2, RefreshCcw } from 'lucide-react';
import { api } from '@/services/api';

type AccessState = 'checking' | 'allowed' | 'denied' | 'error';

export function AdminAccessGate({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AccessState>('checking');
  const [message, setMessage] = useState('');

  useEffect(() => {
    let active = true;

    async function verifyAccess() {
      try {
        await api.admin.overview();
        if (active) {
          setState('allowed');
        }
      } catch (error) {
        if (!active) return;

        const status = error instanceof Error && 'status' in error ? Number((error as { status?: number }).status) : 0;
        if (status === 401 || status === 403) {
          setState('denied');
          setMessage('This dashboard requires an authenticated staff session. Log in with a backend staff account, then reload this page.');
          return;
        }

        setState('error');
        setMessage(error instanceof Error ? error.message : 'Unable to verify staff access.');
      }
    }

    void verifyAccess();

    return () => {
      active = false;
    };
  }, []);

  if (state === 'checking') {
    return (
      <main className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="flex items-center gap-3 text-gray-500">
          <Loader2 className="h-5 w-5 animate-spin" />
          Verifying staff access...
        </div>
      </main>
    );
  }

  if (state === 'allowed') {
    return <>{children}</>;
  }

  return (
    <main className="min-h-[70vh] flex items-center justify-center px-4 py-16 bg-gray-50">
      <div className="max-w-xl w-full rounded-3xl border border-gray-200 bg-white p-8 shadow-sm text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600">
          <ShieldAlert className="h-7 w-7" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-3">Staff Access Required</h1>
        <p className="text-gray-600 mb-6 leading-relaxed">{message}</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 px-6 py-3 text-white font-semibold"
          >
            <RefreshCcw className="h-4 w-4" />
            Retry
          </button>
        </div>
        <p className="mt-4 text-xs text-gray-400">
          If you still see this message, ensure the backend session is authenticated for an admin user.
        </p>
      </div>
    </main>
  );
}
