import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import { SEO } from '@/components/SEO';

export function AdminForbiddenPage() {
  return (
    <>
      <SEO title="Access Restricted" description="You do not have permission to access the admin dashboard." path="/admin/forbidden" noIndex />
      <div className="min-h-screen flex items-center justify-center px-4 py-24 bg-slate-50">
        <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 text-amber-700">
            <ShieldAlert className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Access restricted</h1>
          <p className="mt-3 text-slate-600">
            Your account is signed in, but it does not have permission to access the admin dashboard.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Link
              to="/admin/login"
              className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Back to login
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}