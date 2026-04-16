import { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Loader2, RefreshCcw, Search } from 'lucide-react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import type { PaginatedResponse } from '@/services/api';

export type AdminColumn<T> = {
  key: string;
  label: string;
  render: (item: T) => React.ReactNode;
  className?: string;
};

export type AdminAction<T> = {
  label: string;
  tone?: 'default' | 'danger' | 'secondary';
  confirmMessage?: string;
  promptMessage?: string;
  handler: (item: T, promptValue?: string) => Promise<void>;
};

export type AdminResourceConfig<T> = {
  title: string;
  description: string;
  pathBase: string;
  fetchList: (query: string) => Promise<PaginatedResponse<T>>;
  fetchDetail: (id: number) => Promise<T>;
  columns: AdminColumn<T>[];
  detailFields: Array<{ label: string; render: (item: T) => React.ReactNode }>;
  rowActions?: AdminAction<T>[];
  searchPlaceholder?: string;
  emptyMessage?: string;
};

function toneClass(tone?: AdminAction<unknown>['tone']) {
  switch (tone) {
    case 'danger':
      return 'border-red-200 bg-red-50 text-red-700 hover:bg-red-100';
    case 'secondary':
      return 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100';
    default:
      return 'border-orange-200 bg-orange-50 text-orange-700 hover:bg-orange-100';
  }
}

export function AdminResourcePage<T>({ config }: { config: AdminResourceConfig<T> }) {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const routeParams = useParams();
  const detailId = routeParams.id ? Number(routeParams.id) : null;
  const page = Number(searchParams.get('page') || '1');
  const search = searchParams.get('search') || '';

  const [state, setState] = useState<{
    loading: boolean;
    error: string | null;
    data: PaginatedResponse<T> | null;
  }>({ loading: true, error: null, data: null });
  const [detailState, setDetailState] = useState<{
    loading: boolean;
    error: string | null;
    data: T | null;
  }>({ loading: true, error: null, data: null });
  const [actionBusy, setActionBusy] = useState<string | null>(null);

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    params.set('page', String(page));
    if (search) params.set('search', search);
    return params.toString();
  }, [page, search]);

  useEffect(() => {
    let active = true;

    async function loadList() {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      try {
        const response = await config.fetchList(queryString);
        if (!active) return;
        setState({ loading: false, error: null, data: response });
      } catch (error) {
        if (!active) return;
        setState({ loading: false, error: error instanceof Error ? error.message : 'Unable to load data.', data: null });
      }
    }

    void loadList();
    return () => {
      active = false;
    };
  }, [config, queryString]);

  useEffect(() => {
    const currentDetailId = detailId;

    if (currentDetailId === null) {
      setDetailState({ loading: false, error: null, data: null });
      return;
    }

    const resolvedDetailId = currentDetailId as number;

    let active = true;

    async function loadDetail() {
      setDetailState({ loading: true, error: null, data: null });
      try {
        const response = await config.fetchDetail(resolvedDetailId);
        if (!active) return;
        setDetailState({ loading: false, error: null, data: response });
      } catch (error) {
        if (!active) return;
        setDetailState({ loading: false, error: error instanceof Error ? error.message : 'Unable to load detail.', data: null });
      }
    }

    void loadDetail();
    return () => {
      active = false;
    };
  }, [config, detailId]);

  async function runAction(action: AdminAction<T>, item: T) {
    const promptValue = action.promptMessage ? window.prompt(action.promptMessage) ?? undefined : undefined;
    if (action.confirmMessage && !window.confirm(action.confirmMessage)) return;
    if (action.promptMessage && promptValue === undefined) return;

    const actionKey = `${action.label}-${JSON.stringify(item)}`;
    setActionBusy(actionKey);
    try {
      await action.handler(item, promptValue);
      const response = await config.fetchList(queryString);
      setState({ loading: false, error: null, data: response });
      if (detailId) {
        const detailResponse = await config.fetchDetail(detailId);
        setDetailState({ loading: false, error: null, data: detailResponse });
      }
    } catch (error) {
      window.alert(error instanceof Error ? error.message : 'Action failed');
    } finally {
      setActionBusy(null);
    }
  }

  if (detailId) {
    return (
      <div className="space-y-6">
        <button
          type="button"
          onClick={() => navigate(config.pathBase)}
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to list
        </button>

        {detailState.loading && (
          <div className="rounded-3xl border border-slate-200 bg-white p-8 text-slate-500 shadow-sm">
            Loading detail...
          </div>
        )}

        {detailState.error && (
          <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-700">{detailState.error}</div>
        )}

        {detailState.data && (
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 mb-4">Detail View</h3>
              <dl className="grid gap-4 sm:grid-cols-2">
                {config.detailFields.map((field) => (
                  <div key={field.label} className="rounded-2xl bg-slate-50 p-4">
                    <dt className="text-xs uppercase tracking-[0.2em] text-slate-500">{field.label}</dt>
                    <dd className="mt-2 text-sm text-slate-900">{field.render(detailState.data as T)}</dd>
                  </div>
                ))}
              </dl>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 mb-4">Raw JSON</h3>
              <pre className="overflow-auto rounded-2xl bg-slate-950 p-4 text-xs text-slate-100">
                {JSON.stringify(detailState.data, null, 2)}
              </pre>
            </section>
          </div>
        )}
      </div>
    );
  }

  const data = state.data?.results ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h3 className="text-2xl font-bold text-slate-900">{config.title}</h3>
          <p className="text-slate-500">{config.description}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative w-full lg:w-80">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(event) => {
                const next = new URLSearchParams(searchParams);
                if (event.target.value) next.set('search', event.target.value); else next.delete('search');
                next.set('page', '1');
                setSearchParams(next);
              }}
              placeholder={config.searchPlaceholder ?? 'Search...'}
              className="w-full rounded-full border border-slate-200 bg-white px-10 py-3 text-sm text-slate-900 outline-none focus:border-orange-400"
            />
          </div>
          <button
            type="button"
            onClick={() => {
              setSearchParams((prev) => {
                const next = new URLSearchParams(prev);
                next.set('page', '1');
                return next;
              });
            }}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <RefreshCcw className="h-4 w-4" />
            Refresh
          </button>
        </div>
      </div>

      {state.loading && (
        <div className="flex items-center gap-3 rounded-3xl border border-slate-200 bg-white p-6 text-slate-500 shadow-sm">
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading {config.title.toLowerCase()}...
        </div>
      )}

      {state.error && (
        <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-700 shadow-sm">{state.error}</div>
      )}

      {!state.loading && !state.error && (
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  {config.columns.map((column) => (
                    <th key={column.key} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                      {column.label}
                    </th>
                  ))}
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.map((item, index) => (
                  <tr key={index} className="hover:bg-slate-50/80">
                    {config.columns.map((column) => (
                      <td key={column.key} className={`px-4 py-4 text-sm text-slate-700 ${column.className ?? ''}`}>
                        {column.render(item)}
                      </td>
                    ))}
                    <td className="px-4 py-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <Link
                          to={`${config.pathBase}/${(item as { id?: number }).id ?? index}`}
                          className="inline-flex items-center rounded-full border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                        >
                          Open
                        </Link>
                        {config.rowActions?.map((action) => (
                          <button
                            key={action.label}
                            type="button"
                            disabled={actionBusy === `${action.label}-${JSON.stringify(item)}`}
                            onClick={() => void runAction(action, item)}
                            className={`inline-flex items-center rounded-full border px-3 py-2 text-xs font-medium transition-colors ${toneClass(action.tone)}`}
                          >
                            {actionBusy === `${action.label}-${JSON.stringify(item)}` ? '...' : action.label}
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}

                {data.length === 0 && (
                  <tr>
                    <td colSpan={config.columns.length + 1} className="px-4 py-14 text-center text-sm text-slate-500">
                      {config.emptyMessage ?? 'No records found.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between border-t border-slate-200 px-4 py-4">
            <p className="text-sm text-slate-500">Page {page}</p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={!state.data?.previous}
                onClick={() => {
                  const next = new URLSearchParams(searchParams);
                  next.set('page', String(Math.max(1, page - 1)));
                  setSearchParams(next);
                }}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </button>
              <button
                type="button"
                disabled={!state.data?.next}
                onClick={() => {
                  const next = new URLSearchParams(searchParams);
                  next.set('page', String(page + 1));
                  setSearchParams(next);
                }}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 disabled:opacity-40"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
