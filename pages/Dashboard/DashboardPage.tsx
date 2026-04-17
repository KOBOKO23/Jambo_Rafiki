import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, Route, Routes } from 'react-router-dom';
import { BellRing, CalendarCheck2, Eye, FileText, GalleryHorizontalEnd, ImagePlus, LayoutDashboard, Loader2, MessageSquareText, Sparkles, UploadCloud, Users, DollarSign } from 'lucide-react';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { AdminShell } from '@/components/dashboard/AdminShell';
import { AdminResourcePage, type AdminColumn, type AdminResourceConfig } from '@/components/dashboard/AdminResourcePage';
import {
  api,
  type AdminAuditEventRecord,
  type AdminBackgroundJobRecord,
  type AdminBannerRecord,
  type AdminContact,
  type AdminContentRevisionRecord,
  type AdminDonation,
  type AdminMediaAssetRecord,
  type AdminNavigationItemRecord,
  type AdminNavigationMenuRecord,
  type AdminPageRecord,
  type AdminRedirectRuleRecord,
  type AdminSiteSettingsRecord,
  type AdminTestimonial,
  type AdminVolunteer,
  type GalleryCategory,
  type GalleryPhoto,
  type NewsletterSubscriberRecord,
} from '@/services/api';
import { SEO } from '@/components/SEO';

function formatDate(value?: string | null) {
  if (!value) return '—';
  return new Intl.DateTimeFormat('en-KE', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

function formatMoney(amount: string | number, currency = 'KES') {
  const numeric = typeof amount === 'number' ? amount : Number(amount);
  if (!Number.isFinite(numeric)) return `${currency} 0`;
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(numeric);
}

function splitCommaList(value: string) {
  return value
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function cleanCategoryLabel(value?: string | null) {
  if (!value) return '';
  return value.replace(/\s+[0-9a-f]{8}(?:\s*-\s*)?$/i, '').trim();
}

type ImageDestinationOption = {
  value: string;
  label: string;
  helper: string;
};

const IMAGE_DESTINATION_GROUPS: Array<{ group: string; options: ImageDestinationOption[] }> = [
  {
    group: 'Home page',
    options: [
      { value: 'Home page / Hero section', label: 'Hero section', helper: 'Top hero banner image on the homepage.' },
      { value: 'Home page / Featured Programs section', label: 'Featured Programs section', helper: 'Featured home cards that promote selected stories or programs.' },
      { value: 'Home page / Programs section', label: 'Programs section', helper: 'Homepage program cards pulled from gallery photos.' },
      { value: 'Home page / Recent Activities section', label: 'Recent Activities section', helper: 'Latest activity thumbnails on the home page.' },
      { value: 'Home page / Stories of Hope section', label: 'Stories of Hope section', helper: 'Story cards that show children, volunteers, or impact moments.' },
    ],
  },
  {
    group: 'About page',
    options: [
      { value: 'About page / Director section', label: 'Director section', helper: 'Executive Director and International Director portraits.' },
    ],
  },
  {
    group: 'Gallery',
    options: [
      { value: 'Gallery page / Gallery grid', label: 'Gallery grid', helper: 'Public gallery cards, lightbox previews, and homepage fallback images.' },
    ],
  },
  {
    group: 'Library',
    options: [
      { value: 'CMS media', label: 'CMS media', helper: 'Reusable internal assets for staff to search and reuse later.' },
    ],
  },
  {
    group: 'Branding',
    options: [
      { value: 'Site branding / Logo', label: 'Logo', helper: 'Brand logo used in the public site header and identity areas.' },
      { value: 'Site branding / Favicon', label: 'Favicon', helper: 'Browser tab icon and bookmark icon.' },
    ],
  },
] as const;

type ImageDestinationValue = ImageDestinationOption['value'];

const IMAGE_DESTINATION_OPTIONS = IMAGE_DESTINATION_GROUPS.flatMap((group) => group.options);

function getDestinationOption(value: string) {
  return IMAGE_DESTINATION_OPTIONS.find((option) => option.value === value) ?? IMAGE_DESTINATION_OPTIONS[0];
}

function DashboardSectionCard({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-[2rem] border border-orange-100 bg-white shadow-[0_20px_60px_rgba(251,146,60,0.08)]">
      <div className="border-b border-orange-100/70 bg-[linear-gradient(135deg,rgba(255,247,237,0.95),rgba(255,237,213,0.65),rgba(253,242,248,0.72))] px-6 py-5">
        <p className="text-xs uppercase tracking-[0.24em] text-orange-500">{eyebrow}</p>
        <h3 className="mt-2 text-2xl font-bold text-slate-900">{title}</h3>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">{description}</p>
      </div>
      <div className="p-6">{children}</div>
    </section>
  );
}

function StatusBadge({ status }: { status: string }) {
  const tone = status.toLowerCase();
  const className =
    tone.includes('success') || tone.includes('approved') || tone.includes('completed')
      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
      : tone.includes('pending') || tone.includes('processing') || tone.includes('review')
        ? 'bg-amber-50 text-amber-700 border-amber-200'
        : tone.includes('inactive') || tone.includes('failed') || tone.includes('rejected')
          ? 'bg-red-50 text-red-700 border-red-200'
          : 'bg-slate-50 text-slate-700 border-slate-200';
  return <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${className}`}>{status}</span>;
}

function OverviewCard({ title, value, icon: Icon, accent }: { title: string; value: string; icon: typeof LayoutDashboard; accent: string }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${accent} text-white shadow-lg`}>
        <Icon className="h-5 w-5" />
      </div>
      <p className="text-sm text-slate-500">{title}</p>
      <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
    </div>
  );
}

function useDashboardSummary() {
  const [state, setState] = useState({ loading: true, error: '', data: null as null | {
    donations: AdminDonation[];
    contacts: AdminContact[];
    volunteers: AdminVolunteer[];
    testimonials: AdminTestimonial[];
    subscribers: NewsletterSubscriberRecord[];
    reconciliation: Awaited<ReturnType<typeof api.donations.reconciliation>> | null;
    galleryPhotos: GalleryPhoto[];
    galleryCategories: GalleryCategory[];
  }});

  useEffect(() => {
    let active = true;

    async function load() {
      setState((prev) => ({ ...prev, loading: true, error: '' }));
      try {
        const [donations, contacts, volunteers, testimonials, subscribers, reconciliation, galleryPhotos, galleryCategories] = await Promise.all([
          api.donations.list<AdminDonation>('page_size=50'),
          api.contacts.list<AdminContact>('page_size=50'),
          api.volunteers.list<AdminVolunteer>('page_size=50'),
          api.testimonials.listPending<AdminTestimonial>('page_size=50'),
          api.newsletter.list<NewsletterSubscriberRecord>('page_size=50'),
          api.donations.reconciliation(),
          api.gallery.listPhotos('page_size=12'),
          api.gallery.listCategories(),
        ]);

        if (!active) return;
        setState({
          loading: false,
          error: '',
          data: {
            donations: donations.results,
            contacts: contacts.results,
            volunteers: volunteers.results,
            testimonials: testimonials.results,
            subscribers: subscribers.results,
            reconciliation,
            galleryPhotos: galleryPhotos.results,
            galleryCategories,
          },
        });
      } catch (error) {
        if (!active) return;
        setState({ loading: false, error: error instanceof Error ? error.message : 'Unable to load dashboard summary.', data: null });
      }
    }

    void load();
    return () => {
      active = false;
    };
  }, []);

  return state;
}

function OverviewPage() {
  const { loading, error, data } = useDashboardSummary();

  const donations = data?.donations ?? [];
  const contacts = data?.contacts ?? [];
  const volunteers = data?.volunteers ?? [];
  const testimonials = data?.testimonials ?? [];
  const subscribers = data?.subscribers ?? [];
  const reconciliation = data?.reconciliation;

  const chartData = useMemo(() => {
    const counts = reconciliation && typeof reconciliation === 'object' && 'donation_status_counts' in reconciliation
      ? (reconciliation as { donation_status_counts?: Record<string, number> }).donation_status_counts ?? {}
      : {};

    return Object.entries(counts).map(([label, value]) => ({ label, value }));
  }, [reconciliation]);

  if (loading) {
    return (
      <div className="flex items-center gap-3 rounded-3xl border border-slate-200 bg-white p-6 text-slate-500 shadow-sm">
        <Loader2 className="h-5 w-5 animate-spin" />
        Loading dashboard summary...
      </div>
    );
  }

  if (error) {
    return <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-700 shadow-sm">{error}</div>;
  }

  const recentDonations = donations.slice(0, 5);
  const recentContacts = contacts.slice(0, 5);
  const pendingVolunteers = volunteers.filter((item) => item.status?.toLowerCase() === 'pending').length;
  const unreadContacts = contacts.filter((item) => !item.is_read).length;
  const pendingTestimonials = testimonials.length;
  const activeSubscribers = subscribers.filter((item) => item.is_active).length;

  return (
    <div className="space-y-8">
      <SEO title="Dashboard" description="Jambo Rafiki CMS dashboard" path="/dashboard" noIndex />
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <OverviewCard title="Total Donations" value={String(donations.length)} icon={DollarSign as never} accent="from-orange-500 to-pink-500" />
        <OverviewCard title="Unread Contacts" value={String(unreadContacts)} icon={FileText as never} accent="from-blue-500 to-indigo-500" />
        <OverviewCard title="Pending Volunteers" value={String(pendingVolunteers)} icon={Users as never} accent="from-emerald-500 to-teal-500" />
        <OverviewCard title="Pending Testimonials" value={String(pendingTestimonials)} icon={MessageSquareText as never} accent="from-purple-500 to-fuchsia-500" />
        <OverviewCard title="Subscribers" value={String(activeSubscribers)} icon={BellRing as never} accent="from-cyan-500 to-blue-500" />
        <OverviewCard title="Gallery Photos" value={String(data?.galleryPhotos.length ?? 0)} icon={GalleryHorizontalEnd as never} accent="from-pink-500 to-rose-500" />
        <OverviewCard title="Categories" value={String(data?.galleryCategories.length ?? 0)} icon={Sparkles as never} accent="from-amber-500 to-orange-500" />
        <OverviewCard title="Stale Processing" value={String((reconciliation as { stale_processing_count?: number } | null)?.stale_processing_count ?? 0)} icon={CalendarCheck2 as never} accent="from-slate-700 to-slate-900" />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-slate-900">Donation Status Mix</h3>
              <p className="text-sm text-slate-500">From donation reconciliation summary</p>
            </div>
          </div>
          <div className="h-72">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="dashboardArea" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f97316" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#ec4899" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="label" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip />
                  <Area type="monotone" dataKey="value" stroke="#f97316" fill="url(#dashboardArea)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-slate-200 text-sm text-slate-500">
                No reconciliation data available yet.
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Queue / Reconciliation Health</h3>
            <div className="space-y-3 text-sm text-slate-600">
              <div className="flex items-center justify-between"><span>Stale processing</span><span className="font-semibold text-slate-900">{(reconciliation as { stale_processing_count?: number } | null)?.stale_processing_count ?? 0}</span></div>
              <div className="flex items-center justify-between"><span>Callbacks last 24h</span><span className="font-semibold text-slate-900">{(reconciliation as { callbacks_last_24h?: { total?: number } } | null)?.callbacks_last_24h?.total ?? 0}</span></div>
              <div className="flex items-center justify-between"><span>Unprocessed callbacks</span><span className="font-semibold text-slate-900">{(reconciliation as { callbacks_last_24h?: { unprocessed?: number } } | null)?.callbacks_last_24h?.unprocessed ?? 0}</span></div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Recent Moderation / Activity</h3>
            <div className="space-y-3 text-sm text-slate-600">
              {recentContacts.map((item) => (
                <div key={item.id} className="flex items-start gap-3 rounded-2xl bg-slate-50 p-3">
                  <Eye className="mt-0.5 h-4 w-4 text-slate-400" />
                  <div>
                    <p className="font-medium text-slate-900">{item.name}</p>
                    <p>{item.subject}</p>
                    <p className="text-xs text-slate-400">{formatDate(item.created_at)}</p>
                  </div>
                </div>
              ))}
              {recentContacts.length === 0 && <p className="text-slate-500">No recent activity yet.</p>}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Recent Donations</h3>
          <div className="space-y-3">
            {recentDonations.map((item) => (
              <Link key={item.id} to={`/dashboard/donations/${item.id}`} className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 hover:bg-slate-100">
                <div>
                  <p className="font-medium text-slate-900">{item.donor_name}</p>
                  <p className="text-xs text-slate-500">{item.payment_method} · {formatDate(item.created_at)}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-slate-900">{formatMoney(item.amount, item.currency)}</p>
                  <StatusBadge status={item.status} />
                </div>
              </Link>
            ))}
            {recentDonations.length === 0 && <p className="text-sm text-slate-500">No donations yet.</p>}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Gallery Preview</h3>
          <div className="grid grid-cols-3 gap-3">
            {data?.galleryPhotos.slice(0, 6).map((photo) => (
              <div key={photo.id} className="overflow-hidden rounded-2xl bg-slate-100 aspect-square">
                <img src={photo.image_url || photo.image} alt={photo.title} className="h-full w-full object-cover" />
              </div>
            ))}
            {(data?.galleryPhotos.length ?? 0) === 0 && <p className="text-sm text-slate-500">No gallery media loaded.</p>}
          </div>
        </div>
      </section>
    </div>
  );
}

function ContentStudioPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pages, setPages] = useState<AdminPageRecord[]>([]);
  const [revisions, setRevisions] = useState<AdminContentRevisionRecord[]>([]);

  useEffect(() => {
    let active = true;

    async function load() {
      setLoading(true);
      setError('');
      try {
        const [pageList, revisionList] = await Promise.all([
          api.admin.pages.list('page_size=8'),
          api.admin.contentRevisions.list('page_size=8'),
        ]);
        if (!active) return;
        setPages(pageList.results);
        setRevisions(revisionList.results);
      } catch (loadError) {
        if (!active) return;
        setError(loadError instanceof Error ? loadError.message : 'Unable to load content studio data.');
      } finally {
        if (active) setLoading(false);
      }
    }

    void load();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-2xl font-bold text-slate-900">Content Studio</h3>
        <p className="mt-2 text-slate-500">Manage pages, publishing workflows, and recent revisions.</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link to="/dashboard/content/pages" className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">Open Pages</Link>
          <Link to="/dashboard/marketing/banners" className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">Manage Banners</Link>
          <Link to="/dashboard/media" className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">Open Media Library</Link>
        </div>
      </div>

      {loading && <div className="rounded-3xl border border-slate-200 bg-white p-6 text-slate-500 shadow-sm">Loading content studio...</div>}
      {error && <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-700 shadow-sm">{error}</div>}

      {!loading && !error && (
        <div className="grid gap-6 xl:grid-cols-2">
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h4 className="text-lg font-semibold text-slate-900 mb-4">Recent Pages</h4>
            <div className="space-y-3">
              {pages.map((page) => (
                <Link key={page.id} to={`/dashboard/content/pages/${page.id}`} className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 hover:bg-slate-100">
                  <div>
                    <p className="text-sm font-medium text-slate-900">{page.title}</p>
                    <p className="text-xs text-slate-500">/{page.slug}</p>
                  </div>
                  <StatusBadge status={page.status || 'draft'} />
                </Link>
              ))}
              {pages.length === 0 && <p className="text-sm text-slate-500">No pages found.</p>}
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h4 className="text-lg font-semibold text-slate-900 mb-4">Recent Revisions</h4>
            <div className="space-y-3">
              {revisions.map((revision) => (
                <div key={revision.id} className="rounded-2xl bg-slate-50 px-4 py-3">
                  <p className="text-sm font-medium text-slate-900">{revision.entity_type || 'content'} #{revision.entity_id || revision.id}</p>
                  <p className="text-xs text-slate-500">{revision.summary || 'No summary provided'}</p>
                  <p className="mt-1 text-xs text-slate-400">{formatDate(revision.created_at)}</p>
                </div>
              ))}
              {revisions.length === 0 && <p className="text-sm text-slate-500">No revisions yet.</p>}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

function PagesModulePage() {
  const columns: AdminColumn<AdminPageRecord>[] = [
    { key: 'title', label: 'Title', render: (item) => item.title },
    { key: 'slug', label: 'Slug', render: (item) => `/${item.slug}` },
    { key: 'status', label: 'Status', render: (item) => <StatusBadge status={item.status || 'draft'} /> },
    { key: 'scheduled_for', label: 'Scheduled', render: (item) => formatDate(item.scheduled_for ?? null) },
    { key: 'updated_at', label: 'Updated', render: (item) => formatDate(item.updated_at) },
  ];

  const config: AdminResourceConfig<AdminPageRecord> = {
    title: 'Pages',
    description: 'Draft, publish, archive, and schedule page content.',
    pathBase: '/dashboard/content/pages',
    fetchList: (query) => api.admin.pages.list<AdminPageRecord>(query),
    fetchDetail: (id) => api.admin.pages.get<AdminPageRecord>(id),
    columns,
    detailFields: [
      { label: 'Title', render: (item) => item.title },
      { label: 'Slug', render: (item) => `/${item.slug}` },
      { label: 'Status', render: (item) => <StatusBadge status={item.status || 'draft'} /> },
      { label: 'Published', render: (item) => formatDate(item.published_at ?? null) },
      { label: 'Scheduled For', render: (item) => formatDate(item.scheduled_for ?? null) },
      { label: 'SEO Title', render: (item) => item.seo_title || '—' },
      { label: 'SEO Description', render: (item) => item.seo_description || '—' },
      { label: 'Canonical URL', render: (item) => item.canonical_url || '—' },
    ],
    rowActions: [
      {
        label: 'Publish',
        confirmMessage: 'Publish this page now?',
        handler: async (item) => {
          await api.admin.pages.publish(item.id);
        },
      },
      {
        label: 'Archive',
        tone: 'danger',
        confirmMessage: 'Archive this page?',
        handler: async (item) => {
          await api.admin.pages.archive(item.id);
        },
      },
      {
        label: 'Schedule',
        tone: 'secondary',
        promptMessage: 'Enter schedule datetime in ISO format (e.g. 2026-04-30T09:00:00Z)',
        handler: async (item, promptValue) => {
          if (!promptValue) throw new Error('Schedule datetime is required.');
          await api.admin.pages.schedule(item.id, promptValue);
        },
      },
    ],
  };

  return <AdminResourcePage config={config} />;
}

function NavigationModulePage() {
  const [tab, setTab] = useState<'menus' | 'items'>('menus');

  if (tab === 'menus') {
    const menuConfig: AdminResourceConfig<AdminNavigationMenuRecord> = {
      title: 'Navigation Menus',
      description: 'Header, footer, and utility menu definitions.',
      pathBase: '/dashboard/navigation',
      fetchList: (query) => api.admin.navigationMenus.list<AdminNavigationMenuRecord>(query),
      fetchDetail: (id) => api.admin.navigationMenus.get<AdminNavigationMenuRecord>(id),
      columns: [
        { key: 'name', label: 'Name', render: (item) => item.name || `Menu #${item.id}` },
        { key: 'slug', label: 'Slug', render: (item) => item.slug || '—' },
        { key: 'location', label: 'Location', render: (item) => item.location || '—' },
        { key: 'active', label: 'Active', render: (item) => <StatusBadge status={item.is_active ? 'Active' : 'Inactive'} /> },
      ],
      detailFields: [
        { label: 'Name', render: (item) => item.name || '—' },
        { label: 'Slug', render: (item) => item.slug || '—' },
        { label: 'Location', render: (item) => item.location || '—' },
        { label: 'Updated', render: (item) => formatDate(item.updated_at) },
      ],
    };

    return (
      <div className="space-y-4">
        <div className="inline-flex rounded-full border border-slate-200 bg-white p-1">
          <button type="button" onClick={() => setTab('menus')} className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white">Menus</button>
          <button type="button" onClick={() => setTab('items')} className="rounded-full px-4 py-2 text-sm font-medium text-slate-600">Items</button>
        </div>
        <AdminResourcePage config={menuConfig} />
      </div>
    );
  }

  const itemConfig: AdminResourceConfig<AdminNavigationItemRecord> = {
    title: 'Navigation Items',
    description: 'Nested links and page references used by menus.',
    pathBase: '/dashboard/navigation',
    fetchList: (query) => api.admin.navigationItems.list<AdminNavigationItemRecord>(query),
    fetchDetail: (id) => api.admin.navigationItems.get<AdminNavigationItemRecord>(id),
    columns: [
      { key: 'label', label: 'Label', render: (item) => item.label },
      { key: 'url', label: 'URL', render: (item) => item.url || '—' },
      { key: 'menu', label: 'Menu ID', render: (item) => String(item.menu ?? '—') },
      { key: 'sort_order', label: 'Order', render: (item) => String(item.sort_order ?? 0) },
      { key: 'active', label: 'Active', render: (item) => <StatusBadge status={item.is_active ? 'Active' : 'Inactive'} /> },
    ],
    detailFields: [
      { label: 'Label', render: (item) => item.label },
      { label: 'URL', render: (item) => item.url || '—' },
      { label: 'Menu', render: (item) => String(item.menu ?? '—') },
      { label: 'Parent', render: (item) => String(item.parent ?? '—') },
      { label: 'Open in New Tab', render: (item) => (item.open_in_new_tab ? 'Yes' : 'No') },
    ],
  };

  return (
    <div className="space-y-4">
      <div className="inline-flex rounded-full border border-slate-200 bg-white p-1">
        <button type="button" onClick={() => setTab('menus')} className="rounded-full px-4 py-2 text-sm font-medium text-slate-600">Menus</button>
        <button type="button" onClick={() => setTab('items')} className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white">Items</button>
      </div>
      <AdminResourcePage config={itemConfig} />
    </div>
  );
}

function MediaUploadForm({ onUploaded }: { onUploaded: () => void }) {
  const [form, setForm] = useState({
    title: '',
    altText: '',
    caption: '',
    destination: 'CMS media' as ImageDestinationValue,
    tags: '',
  });
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (!file) {
      setError('Choose an image file to upload.');
      return;
    }

    setSaving(true);
    try {
      await api.admin.mediaAssets.create({
        title: form.title.trim(),
        file,
        alt_text: form.altText.trim() || undefined,
        caption: form.caption.trim() || undefined,
        category: form.destination,
        tags: splitCommaList(form.tags),
      });

      setSuccess('Media uploaded to CMS media.');
      setForm({ title: '', altText: '', caption: '', destination: 'CMS media' as ImageDestinationValue, tags: '' });
      setFile(null);
      onUploaded();
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : 'Unable to upload media.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-[1.75rem] border border-orange-100 bg-white p-5 shadow-sm">
      <div className="flex items-start gap-3 rounded-2xl bg-gradient-to-r from-orange-50 to-pink-50 px-4 py-3 text-sm text-slate-700">
        <UploadCloud className="mt-0.5 h-5 w-5 text-orange-500" />
        <p>Choose the exact destination first, then add tags if you want the file to be searchable or reusable later.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2 text-sm font-medium text-slate-700">
          <span>Title</span>
          <input
            value={form.title}
            onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
            required
            placeholder="Example: Director portrait"
            className="w-full rounded-2xl border border-orange-100 bg-white px-4 py-3 text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
          />
        </label>

        <label className="space-y-2 text-sm font-medium text-slate-700">
          <span>Destination</span>
          <select
            value={form.destination}
            onChange={(event) => setForm((prev) => ({ ...prev, destination: event.target.value as ImageDestinationValue }))}
            className="w-full rounded-2xl border border-orange-100 bg-white px-4 py-3 text-slate-900 outline-none transition-colors focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
          >
            {IMAGE_DESTINATION_GROUPS.map((group) => (
              <optgroup key={group.group} label={group.group}>
                {group.options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label} - {option.helper}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
          <p className="text-xs text-slate-500">{getDestinationOption(form.destination).helper}</p>
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2 text-sm font-medium text-slate-700">
          <span>Alt text</span>
          <input
            value={form.altText}
            onChange={(event) => setForm((prev) => ({ ...prev, altText: event.target.value }))}
            placeholder="Describe the image for screen readers"
            className="w-full rounded-2xl border border-orange-100 bg-white px-4 py-3 text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
          />
        </label>

        <label className="space-y-2 text-sm font-medium text-slate-700">
          <span>Tags</span>
          <input
            value={form.tags}
            onChange={(event) => setForm((prev) => ({ ...prev, tags: event.target.value }))}
            placeholder="volunteer, children, portrait"
            className="w-full rounded-2xl border border-orange-100 bg-white px-4 py-3 text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
          />
        </label>
      </div>

      <label className="block space-y-2 text-sm font-medium text-slate-700">
        <span>Caption</span>
        <textarea
          value={form.caption}
          onChange={(event) => setForm((prev) => ({ ...prev, caption: event.target.value }))}
          rows={3}
          placeholder="Short internal caption or note"
          className="w-full rounded-2xl border border-orange-100 bg-white px-4 py-3 text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
        />
      </label>

      <label className="block space-y-2 text-sm font-medium text-slate-700">
        <span>File</span>
        <input
          type="file"
          accept="image/*"
          onChange={(event) => setFile(event.target.files?.[0] ?? null)}
          required
          className="block w-full rounded-2xl border border-dashed border-orange-200 bg-orange-50/60 px-4 py-3 text-sm text-slate-700 file:mr-4 file:rounded-full file:border-0 file:bg-gradient-to-r file:from-orange-500 file:to-pink-500 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:bg-orange-50"
        />
        {file && <p className="text-xs text-slate-500">Selected: {file.name}</p>}
      </label>

      {error && <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
      {success && <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{success}</div>}

      <div className="flex items-center justify-end gap-3">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-500/20 transition-transform hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <UploadCloud className="h-4 w-4" />
          {saving ? 'Uploading...' : 'Upload media'}
        </button>
      </div>
    </form>
  );
}

function GalleryUploadForm({ onUploaded }: { onUploaded: () => void }) {
  const [categories, setCategories] = useState<GalleryCategory[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    dateTaken: '',
    isFeatured: false,
  });
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    let active = true;

    async function loadCategories() {
      setLoadingCategories(true);
      try {
        const response = await api.gallery.listCategories();
        if (!active) return;
        const normalizedCategories = Array.isArray(response)
          ? response
          : Array.isArray((response as { results?: GalleryCategory[] }).results)
            ? (response as { results: GalleryCategory[] }).results
            : [];
        setCategories(normalizedCategories);
        setForm((prev) => ({ ...prev, category: prev.category || String(normalizedCategories[0]?.id ?? '') }));
      } catch {
        if (!active) return;
        setCategories([]);
      } finally {
        if (active) setLoadingCategories(false);
      }
    }

    void loadCategories();
    return () => {
      active = false;
    };
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (!file) {
      setError('Choose an image file to upload.');
      return;
    }

    setSaving(true);
    try {
      await api.admin.galleryPhotos.create({
        title: form.title.trim(),
        image: file,
        description: form.description.trim() || undefined,
        category: form.category ? Number(form.category) : undefined,
        is_featured: form.isFeatured,
        date_taken: form.dateTaken || undefined,
      });

      setSuccess('Photo uploaded to Gallery page / Gallery grid.');
      setForm({ title: '', description: '', category: categories[0] ? String(categories[0].id) : '', dateTaken: '', isFeatured: false });
      setFile(null);
      onUploaded();
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : 'Unable to upload gallery photo.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-[1.75rem] border border-orange-100 bg-white p-5 shadow-sm">
      <div className="flex items-start gap-3 rounded-2xl bg-gradient-to-r from-orange-50 to-pink-50 px-4 py-3 text-sm text-slate-700">
        <ImagePlus className="mt-0.5 h-5 w-5 text-orange-500" />
        <p>Upload a photo for the public gallery. Mark it featured if you want it to appear in the homepage hero or featured program blocks.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2 text-sm font-medium text-slate-700">
          <span>Title</span>
          <input
            value={form.title}
            onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
            required
            placeholder="Example: Children at play"
            className="w-full rounded-2xl border border-orange-100 bg-white px-4 py-3 text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
          />
        </label>

        <label className="space-y-2 text-sm font-medium text-slate-700">
          <span>Gallery category</span>
          <select
            value={form.category}
            onChange={(event) => setForm((prev) => ({ ...prev, category: event.target.value }))}
            disabled={loadingCategories}
            className="w-full rounded-2xl border border-orange-100 bg-white px-4 py-3 text-slate-900 outline-none transition-colors focus:border-orange-400 focus:ring-2 focus:ring-orange-200 disabled:opacity-60"
          >
            {categories.length === 0 ? (
              <option value="">No gallery categories loaded</option>
            ) : (
              categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {cleanCategoryLabel(category.name) || category.name} - {category.description || 'Gallery category'} ({category.count} photos)
                </option>
              ))
            )}
          </select>
          {form.category && (
            <p className="text-xs text-slate-500">
              {(() => {
                const selected = categories.find((category) => String(category.id) === String(form.category));
                return selected ? `${cleanCategoryLabel(selected.name) || selected.name} is currently used for ${selected.count} photos.` : 'This category controls where the gallery photo appears and how it is grouped.';
              })()}
            </p>
          )}
        </label>
      </div>

      <label className="block space-y-2 text-sm font-medium text-slate-700">
        <span>Description</span>
        <textarea
          value={form.description}
          onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
          rows={3}
          placeholder="Short description shown in the admin record"
          className="w-full rounded-2xl border border-orange-100 bg-white px-4 py-3 text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
        />
      </label>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2 text-sm font-medium text-slate-700">
          <span>Date taken</span>
          <input
            type="date"
            value={form.dateTaken}
            onChange={(event) => setForm((prev) => ({ ...prev, dateTaken: event.target.value }))}
            className="w-full rounded-2xl border border-orange-100 bg-white px-4 py-3 text-slate-900 outline-none transition-colors focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
          />
        </label>

        <label className="flex items-center gap-3 rounded-2xl border border-orange-100 bg-orange-50/50 px-4 py-3 text-sm font-medium text-slate-700">
          <input
            type="checkbox"
            checked={form.isFeatured}
            onChange={(event) => setForm((prev) => ({ ...prev, isFeatured: event.target.checked }))}
            className="h-4 w-4 rounded border-orange-300 text-orange-500 focus:ring-orange-400"
          />
          Featured photo
        </label>
      </div>

      <label className="block space-y-2 text-sm font-medium text-slate-700">
        <span>Image file</span>
        <input
          type="file"
          accept="image/*"
          onChange={(event) => setFile(event.target.files?.[0] ?? null)}
          required
          className="block w-full rounded-2xl border border-dashed border-orange-200 bg-orange-50/60 px-4 py-3 text-sm text-slate-700 file:mr-4 file:rounded-full file:border-0 file:bg-gradient-to-r file:from-orange-500 file:to-pink-500 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:bg-orange-50"
        />
        {file && <p className="text-xs text-slate-500">Selected: {file.name}</p>}
      </label>

      {error && <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
      {success && <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{success}</div>}

      <div className="flex items-center justify-end gap-3">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-500/20 transition-transform hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <ImagePlus className="h-4 w-4" />
          {saving ? 'Uploading...' : 'Upload gallery photo'}
        </button>
      </div>
    </form>
  );
}

function MediaLibraryPage() {
  const [refreshKey, setRefreshKey] = useState(0);
  const config: AdminResourceConfig<AdminMediaAssetRecord> = {
    title: 'Media Library',
    description: 'Media assets with metadata, alt text, caption, and usage context.',
    pathBase: '/dashboard/media',
    fetchList: (query) => api.admin.mediaAssets.list<AdminMediaAssetRecord>(query),
    fetchDetail: (id) => api.admin.mediaAssets.get<AdminMediaAssetRecord>(id),
    columns: [
      {
        key: 'preview',
        label: 'Preview',
        render: (item) => {
          const image = item.file_url || item.file;
          return image ? <img src={String(image)} alt={item.alt_text || item.title} className="h-10 w-10 rounded-lg object-cover" /> : '—';
        },
      },
      { key: 'title', label: 'Title', render: (item) => item.title },
      { key: 'category', label: 'Category', render: (item) => cleanCategoryLabel(item.category) || '—' },
      { key: 'usage_count', label: 'Usage', render: (item) => String(item.usage_count ?? 0) },
      { key: 'updated_at', label: 'Updated', render: (item) => formatDate(item.updated_at) },
    ],
    detailFields: [
      { label: 'Title', render: (item) => item.title },
      { label: 'Alt Text', render: (item) => item.alt_text || '—' },
      { label: 'Caption', render: (item) => item.caption || '—' },
      { label: 'Category', render: (item) => cleanCategoryLabel(item.category) || '—' },
      { label: 'Usage Count', render: (item) => String(item.usage_count ?? 0) },
      {
        label: 'File URL',
        render: (item) => {
          const image = item.file_url || item.file;
          return image ? <a href={String(image)} target="_blank" rel="noreferrer" className="text-blue-600 underline">Open asset</a> : '—';
        },
      },
    ],
    rowActions: [
      {
        label: 'Rename',
        tone: 'secondary',
        promptMessage: 'Enter a new title for this media asset.',
        handler: async (item, promptValue) => {
          if (!promptValue?.trim()) throw new Error('Title is required.');
          await api.admin.mediaAssets.update(item.id, { title: promptValue.trim() });
        },
      },
      {
        label: 'Delete',
        tone: 'danger',
        confirmMessage: 'Delete this media asset permanently?',
        handler: async (item) => {
          await api.admin.mediaAssets.delete(item.id);
        },
      },
    ],
  };

  return (
    <div className="space-y-6">
      <DashboardSectionCard
        eyebrow="Dashboard / Media Library"
        title="Upload reusable image files"
        description="Add a file here when you want staff to reuse it later across the site. The table below refreshes after each upload."
      >
        <MediaUploadForm onUploaded={() => setRefreshKey((value) => value + 1)} />
      </DashboardSectionCard>

      <div key={refreshKey}>
        <AdminResourcePage config={config} />
      </div>
    </div>
  );
}

function MarketingPage() {
  const [tab, setTab] = useState<'banners' | 'redirects'>('banners');

  if (tab === 'banners') {
    const bannerConfig: AdminResourceConfig<AdminBannerRecord> = {
      title: 'Marketing Banners',
      description: 'Campaign banners with CTA and start/end scheduling.',
      pathBase: '/dashboard/marketing/banners',
      fetchList: (query) => api.admin.banners.list<AdminBannerRecord>(query),
      fetchDetail: (id) => api.admin.banners.get<AdminBannerRecord>(id),
      columns: [
        { key: 'title', label: 'Title', render: (item) => item.title },
        { key: 'active', label: 'Status', render: (item) => <StatusBadge status={item.is_active ? 'Active' : 'Inactive'} /> },
        { key: 'starts_at', label: 'Starts', render: (item) => formatDate(item.starts_at ?? null) },
        { key: 'ends_at', label: 'Ends', render: (item) => formatDate(item.ends_at ?? null) },
      ],
      detailFields: [
        { label: 'Title', render: (item) => item.title },
        { label: 'Message', render: (item) => item.message || '—' },
        { label: 'CTA Label', render: (item) => item.cta_label || '—' },
        { label: 'CTA URL', render: (item) => item.cta_url || '—' },
        { label: 'Priority', render: (item) => String(item.priority ?? 0) },
      ],
    };

    return (
      <div className="space-y-4">
        <div className="inline-flex rounded-full border border-slate-200 bg-white p-1">
          <button type="button" onClick={() => setTab('banners')} className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white">Banners</button>
          <button type="button" onClick={() => setTab('redirects')} className="rounded-full px-4 py-2 text-sm font-medium text-slate-600">Redirects</button>
        </div>
        <AdminResourcePage config={bannerConfig} />
      </div>
    );
  }

  const redirectConfig: AdminResourceConfig<AdminRedirectRuleRecord> = {
    title: 'Redirect Rules',
    description: 'Slug and path redirects for SEO-safe URL migrations.',
    pathBase: '/dashboard/marketing',
    fetchList: (query) => api.admin.redirectRules.list<AdminRedirectRuleRecord>(query),
    fetchDetail: (id) => api.admin.redirectRules.get<AdminRedirectRuleRecord>(id),
    columns: [
      { key: 'source_path', label: 'Source', render: (item) => item.source_path },
      { key: 'target_url', label: 'Target', render: (item) => item.target_url },
      { key: 'status_code', label: 'Code', render: (item) => String(item.status_code ?? 301) },
      { key: 'active', label: 'Status', render: (item) => <StatusBadge status={item.is_active ? 'Active' : 'Inactive'} /> },
    ],
    detailFields: [
      { label: 'Source Path', render: (item) => item.source_path },
      { label: 'Target URL', render: (item) => item.target_url },
      { label: 'Status Code', render: (item) => String(item.status_code ?? 301) },
      { label: 'Active', render: (item) => (item.is_active ? 'Yes' : 'No') },
    ],
  };

  return (
    <div className="space-y-4">
      <div className="inline-flex rounded-full border border-slate-200 bg-white p-1">
        <button type="button" onClick={() => setTab('banners')} className="rounded-full px-4 py-2 text-sm font-medium text-slate-600">Banners</button>
        <button type="button" onClick={() => setTab('redirects')} className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white">Redirects</button>
      </div>
      <AdminResourcePage config={redirectConfig} />
    </div>
  );
}

function AuditLogPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [events, setEvents] = useState<AdminAuditEventRecord[]>([]);
  const [revisions, setRevisions] = useState<AdminContentRevisionRecord[]>([]);
  const [jobs, setJobs] = useState<AdminBackgroundJobRecord[]>([]);

  async function load() {
    setLoading(true);
    setError('');
    try {
      const [eventRes, revisionRes, jobRes] = await Promise.all([
        api.admin.auditEvents.list('page_size=10'),
        api.admin.contentRevisions.list('page_size=10'),
        api.admin.backgroundJobs.list('page_size=10'),
      ]);

      setEvents(eventRes.results);
      setRevisions(revisionRes.results);
      setJobs(jobRes.results);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Unable to load audit feed.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="text-2xl font-bold text-slate-900">Audit Log / Activity</h3>
            <p className="text-slate-500">Publish history, moderation events, and background job health.</p>
          </div>
          <button type="button" onClick={() => void load()} className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">Refresh</button>
        </div>
      </div>

      {loading && <div className="rounded-3xl border border-slate-200 bg-white p-6 text-slate-500 shadow-sm">Loading audit activity...</div>}
      {error && <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-700 shadow-sm">{error}</div>}

      {!loading && !error && (
        <div className="grid gap-6 xl:grid-cols-3">
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h4 className="text-lg font-semibold text-slate-900 mb-4">Audit Events</h4>
            <div className="space-y-3">
              {events.map((event) => (
                <div key={event.id} className="rounded-2xl bg-slate-50 p-3">
                  <p className="text-sm font-medium text-slate-900">{event.action || 'event'} by {event.actor || 'system'}</p>
                  <p className="text-xs text-slate-500">{event.target_type || 'entity'} #{event.target_id ?? event.id}</p>
                  <p className="mt-1 text-xs text-slate-400">{formatDate(event.created_at)}</p>
                </div>
              ))}
              {events.length === 0 && <p className="text-sm text-slate-500">No audit events found.</p>}
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h4 className="text-lg font-semibold text-slate-900 mb-4">Content Revisions</h4>
            <div className="space-y-3">
              {revisions.map((revision) => (
                <div key={revision.id} className="rounded-2xl bg-slate-50 p-3">
                  <p className="text-sm font-medium text-slate-900">{revision.entity_type || 'content'} #{revision.entity_id ?? revision.id}</p>
                  <p className="text-xs text-slate-500">{revision.status || 'draft'} · v{revision.version ?? 1}</p>
                  <p className="mt-1 text-xs text-slate-400">{formatDate(revision.created_at)}</p>
                </div>
              ))}
              {revisions.length === 0 && <p className="text-sm text-slate-500">No revisions found.</p>}
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h4 className="text-lg font-semibold text-slate-900 mb-4">Background Jobs</h4>
            <div className="space-y-3">
              {jobs.map((job) => (
                <div key={job.id} className="rounded-2xl bg-slate-50 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium text-slate-900">{job.name || `Job #${job.id}`}</p>
                    <StatusBadge status={job.status || 'unknown'} />
                  </div>
                  <p className="text-xs text-slate-500">Attempts: {job.attempts ?? 0}</p>
                  {job.status?.toLowerCase().includes('failed') && (
                    <button
                      type="button"
                      onClick={() => void api.admin.backgroundJobs.retry(job.id).then(() => load())}
                      className="mt-2 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100"
                    >
                      Retry Job
                    </button>
                  )}
                </div>
              ))}
              {jobs.length === 0 && <p className="text-sm text-slate-500">No jobs found.</p>}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

function SettingsAssetField({
  label,
  value,
  onChange,
  uploadTitle,
  uploadCategory,
  helperText,
}: {
  label: string;
  value: string;
  onChange: (nextValue: string) => void;
  uploadTitle: string;
  uploadCategory: string;
  helperText: string;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  async function upload() {
    setError('');
    setMessage('');

    if (!file) {
      setError('Choose an image file first.');
      return;
    }

    setSaving(true);
    try {
      const response = await api.admin.mediaAssets.create({
        title: uploadTitle,
        file,
        category: uploadCategory,
        alt_text: label,
      });
      const nextUrl = String(response.file_url || response.file || '');
      onChange(nextUrl);
      setMessage('Uploaded and attached to this setting.');
      setFile(null);
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : 'Unable to upload image.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="rounded-[1.75rem] border border-orange-100 bg-white p-5 shadow-[0_18px_40px_rgba(251,146,60,0.08)]">
      <p className="text-xs uppercase tracking-[0.2em] text-orange-500">{label}</p>
      <p className="mt-2 text-sm text-slate-500">{helperText}</p>

      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Paste a public image URL"
        className="mt-4 w-full rounded-2xl border border-orange-100 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
      />

      <div className="mt-4 space-y-3">
        <input
          type="file"
          accept="image/*"
          onChange={(event) => setFile(event.target.files?.[0] ?? null)}
          className="block w-full rounded-2xl border border-dashed border-orange-200 bg-orange-50/60 px-4 py-3 text-sm text-slate-700 file:mr-4 file:rounded-full file:border-0 file:bg-gradient-to-r file:from-orange-500 file:to-pink-500 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:bg-orange-50"
        />
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs text-slate-500">{file ? file.name : 'Upload an image or paste a URL.'}</p>
          <button
            type="button"
            onClick={() => void upload()}
            disabled={saving}
            className="rounded-full bg-gradient-to-r from-orange-500 to-pink-500 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-orange-500/20 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? 'Uploading...' : 'Upload'}
          </button>
        </div>
      </div>

      {message && <p className="mt-3 text-sm text-emerald-700">{message}</p>}
      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
    </div>
  );
}

function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState<AdminSiteSettingsRecord>({});

  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      setError('');
      try {
        const settings = await api.admin.siteSettings.get<AdminSiteSettingsRecord>();
        if (!active) return;
        setForm(settings);
      } catch (loadError) {
        if (!active) return;
        setError(loadError instanceof Error ? loadError.message : 'Unable to load site settings.');
      } finally {
        if (active) setLoading(false);
      }
    }

    void load();
    return () => {
      active = false;
    };
  }, []);

  async function save() {
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const payload: Record<string, unknown> = {
        site_name: form.site_name ?? '',
        tagline: form.tagline ?? '',
        support_email: form.support_email ?? '',
        support_phone: form.support_phone ?? '',
        address: form.address ?? '',
        seo_default_title: form.seo_default_title ?? '',
        seo_default_description: form.seo_default_description ?? '',
        homepage_title: form.homepage_title ?? '',
        homepage_subtitle: form.homepage_subtitle ?? '',
        primary_color: form.primary_color ?? '',
        secondary_color: form.secondary_color ?? '',
        logo: form.logo_url ?? form.logo ?? '',
        logo_url: form.logo_url ?? form.logo ?? '',
        favicon: form.favicon_url ?? form.favicon ?? '',
        favicon_url: form.favicon_url ?? form.favicon ?? '',
        director_executive_image_url: form.director_executive_image_url ?? '',
        director_international_image_url: form.director_international_image_url ?? '',
      };
      const next = await api.admin.siteSettings.update<AdminSiteSettingsRecord>(payload, 'PATCH');
      setForm(next);
      setSuccess('Settings updated successfully.');
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Unable to save settings.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="rounded-3xl border border-slate-200 bg-white p-6 text-slate-500 shadow-sm">Loading site settings...</div>;

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-2xl font-bold text-slate-900">Site Settings</h3>
        <p className="text-slate-500">Brand identity, support contact, and default SEO content.</p>
      </div>

      {error && <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-700 shadow-sm">{error}</div>}
      {success && <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6 text-emerald-700 shadow-sm">{success}</div>}

      <div className="grid gap-6 md:grid-cols-2">
        {[
          ['site_name', 'Site Name'],
          ['tagline', 'Tagline'],
          ['support_email', 'Support Email'],
          ['support_phone', 'Support Phone'],
          ['address', 'Address'],
          ['seo_default_title', 'SEO Default Title'],
          ['seo_default_description', 'SEO Default Description'],
          ['homepage_title', 'Homepage Title'],
          ['homepage_subtitle', 'Homepage Subtitle'],
          ['primary_color', 'Primary Color'],
          ['secondary_color', 'Secondary Color'],
        ].map(([field, label]) => (
          <label key={field} className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
            <span className="text-xs uppercase tracking-[0.2em] text-slate-500">{label}</span>
            <input
              value={String(form[field as keyof AdminSiteSettingsRecord] ?? '')}
              onChange={(event) => setForm((prev) => ({ ...prev, [field]: event.target.value }))}
              className="mt-3 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400"
            />
          </label>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <SettingsAssetField
          label="Branding / Logo"
          value={String(form.logo_url || form.logo || '')}
          onChange={(nextValue) => setForm((prev) => ({ ...prev, logo: nextValue, logo_url: nextValue }))}
          uploadTitle="Site logo"
          uploadCategory="branding"
          helperText="This logo appears in the public brand identity."
        />
        <SettingsAssetField
          label="Branding / Favicon"
          value={String(form.favicon_url || form.favicon || '')}
          onChange={(nextValue) => setForm((prev) => ({ ...prev, favicon: nextValue, favicon_url: nextValue }))}
          uploadTitle="Site favicon"
          uploadCategory="branding"
          helperText="This icon appears in the browser tab and bookmarks."
        />
        <SettingsAssetField
          label="About page / Director section"
          value={String(form.director_executive_image_url || '')}
          onChange={(nextValue) => setForm((prev) => ({ ...prev, director_executive_image_url: nextValue }))}
          uploadTitle="Executive director portrait"
          uploadCategory="about"
          helperText="This image appears beside Mr. Benjamin Oyoo Ondoro on the About page."
        />
        <SettingsAssetField
          label="About page / Director section"
          value={String(form.director_international_image_url || '')}
          onChange={(nextValue) => setForm((prev) => ({ ...prev, director_international_image_url: nextValue }))}
          uploadTitle="International director portrait"
          uploadCategory="about"
          helperText="This image appears beside JM on the About page."
        />
      </div>

      <div>
        <button
          type="button"
          disabled={saving}
          onClick={() => void save()}
          className="rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white disabled:opacity-60"
        >
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
}

function ProfilePage() {
  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h3 className="text-2xl font-bold text-slate-900">Profile / Account</h3>
        <p className="mt-3 max-w-2xl text-slate-500">Staff identity is currently managed by backend session authentication. This page is intentionally minimal until a dedicated profile endpoint is introduced.</p>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h4 className="text-lg font-semibold text-slate-900">Current Access Model</h4>
        <ul className="mt-3 list-disc pl-5 text-sm text-slate-600 space-y-2">
          <li>Dashboard access is protected by server-side admin permissions.</li>
          <li>Mutating requests include CSRF protection automatically.</li>
          <li>No credential tokens are stored in localStorage.</li>
        </ul>
      </div>
    </div>
  );
}

function ContactsPage() {
  const columns: AdminColumn<AdminContact>[] = [
    { key: 'name', label: 'Name', render: (item) => item.name },
    { key: 'email', label: 'Email', render: (item) => item.email },
    { key: 'subject', label: 'Subject', render: (item) => item.subject },
    { key: 'status', label: 'Read', render: (item) => <StatusBadge status={item.is_read ? 'Read' : 'Unread'} /> },
    { key: 'created_at', label: 'Submitted', render: (item) => formatDate(item.created_at) },
  ];

  const config: AdminResourceConfig<AdminContact> = {
    title: 'Contacts',
    description: 'Admin inbox for contact submissions.',
    pathBase: '/dashboard/contacts',
    fetchList: (query) => api.contacts.list<AdminContact>(query),
    fetchDetail: (id) => api.contacts.get<AdminContact>(id),
    columns,
    detailFields: [
      { label: 'Name', render: (item) => item.name },
      { label: 'Email', render: (item) => item.email },
      { label: 'Subject', render: (item) => item.subject },
      { label: 'Message', render: (item) => item.message },
      { label: 'Read', render: (item) => (item.is_read ? 'Yes' : 'No') },
    ],
    rowActions: [
      {
        label: 'Mark read',
        tone: 'secondary',
        confirmMessage: 'Mark this contact as read?',
        handler: async (item) => {
          await api.contacts.markRead(item.id);
        },
      },
    ],
  };

  return <AdminResourcePage config={config} />;
}

function DonationsPage() {
  const columns: AdminColumn<AdminDonation>[] = [
    { key: 'donor', label: 'Donor', render: (item) => item.donor_name },
    { key: 'amount', label: 'Amount', render: (item) => formatMoney(item.amount, item.currency) },
    { key: 'method', label: 'Method', render: (item) => item.payment_method },
    { key: 'status', label: 'Status', render: (item) => <StatusBadge status={item.status} /> },
    { key: 'created_at', label: 'Created', render: (item) => formatDate(item.created_at) },
  ];

  const config: AdminResourceConfig<AdminDonation> = {
    title: 'Donations',
    description: 'Donation records, payment state, and reconciliation-related identifiers.',
    pathBase: '/dashboard/donations',
    fetchList: (query) => api.donations.list<AdminDonation>(query),
    fetchDetail: (id) => api.donations.get<AdminDonation>(id),
    columns,
    detailFields: [
      { label: 'Donor', render: (item) => item.donor_name },
      { label: 'Email', render: (item) => item.donor_email },
      { label: 'Phone', render: (item) => item.donor_phone || '—' },
      { label: 'Amount', render: (item) => formatMoney(item.amount, item.currency) },
      { label: 'Status', render: (item) => <StatusBadge status={item.status} /> },
      { label: 'Transaction', render: (item) => item.transaction_id || '—' },
      { label: 'Stripe Intent', render: (item) => item.stripe_payment_intent || '—' },
      { label: 'M-Pesa Receipt', render: (item) => item.mpesa_receipt || '—' },
      { label: 'Created', render: (item) => formatDate(item.created_at) },
      { label: 'Updated', render: (item) => formatDate(item.updated_at) },
    ],
  };

  return <AdminResourcePage config={config} />;
}

function VolunteersPage() {
  const statusOptions = ['pending', 'reviewing', 'approved', 'rejected', 'contacted', 'scheduled'];
  const columns: AdminColumn<AdminVolunteer>[] = [
    { key: 'name', label: 'Name', render: (item) => item.name },
    { key: 'skills', label: 'Skills', render: (item) => item.skills },
    { key: 'availability', label: 'Availability', render: (item) => item.availability },
    { key: 'status', label: 'Status', render: (item) => <StatusBadge status={item.status} /> },
    { key: 'created_at', label: 'Applied', render: (item) => formatDate(item.created_at) },
  ];

  const config: AdminResourceConfig<AdminVolunteer> = {
    title: 'Volunteers',
    description: 'Volunteer applications with review status controls.',
    pathBase: '/dashboard/volunteers',
    fetchList: (query) => api.volunteers.list<AdminVolunteer>(query),
    fetchDetail: (id) => api.volunteers.get<AdminVolunteer>(id),
    columns,
    detailFields: [
      { label: 'Name', render: (item) => item.name },
      { label: 'Email', render: (item) => item.email },
      { label: 'Phone', render: (item) => item.phone },
      { label: 'Location', render: (item) => item.location },
      { label: 'Skills', render: (item) => item.skills },
      { label: 'Availability', render: (item) => item.availability },
      { label: 'Duration', render: (item) => item.duration },
      { label: 'Motivation', render: (item) => item.motivation },
      { label: 'Status', render: (item) => item.status },
      { label: 'Reviewed', render: (item) => formatDate(item.reviewed_at) },
    ],
    rowActions: statusOptions.map((status) => ({
      label: `Set ${status}`,
      tone: status === 'rejected' ? 'danger' : 'secondary',
      confirmMessage: `Set this volunteer application to ${status}?`,
      promptMessage: `Type ${status} to confirm.`,
      handler: async (item, promptValue) => {
        if (promptValue !== status) throw new Error('Confirmation text did not match.');
        await api.volunteers.updateStatus(item.id, status);
      },
    })),
  };

  return <AdminResourcePage config={config} />;
}

function NewsletterPage() {
  const columns: AdminColumn<NewsletterSubscriberRecord>[] = [
    { key: 'email', label: 'Email', render: (item) => item.email },
    { key: 'name', label: 'Name', render: (item) => item.name || '—' },
    { key: 'active', label: 'Status', render: (item) => <StatusBadge status={item.is_active ? 'Active' : 'Inactive'} /> },
    { key: 'source', label: 'Source', render: (item) => item.source || '—' },
    { key: 'subscribed_at', label: 'Subscribed', render: (item) => formatDate(item.subscribed_at) },
  ];

  const config: AdminResourceConfig<NewsletterSubscriberRecord> = {
    title: 'Newsletter',
    description: 'Subscriber records and subscription state.',
    pathBase: '/dashboard/newsletter',
    fetchList: (query) => api.newsletter.list<NewsletterSubscriberRecord>(query),
    fetchDetail: (id) => api.newsletter.get<NewsletterSubscriberRecord>(id),
    columns,
    detailFields: [
      { label: 'Email', render: (item) => item.email },
      { label: 'Name', render: (item) => item.name || '—' },
      { label: 'Active', render: (item) => (item.is_active ? 'Yes' : 'No') },
      { label: 'Source', render: (item) => item.source || '—' },
      { label: 'Subscribed', render: (item) => formatDate(item.subscribed_at) },
      { label: 'Unsubscribed', render: (item) => formatDate(item.unsubscribed_at) },
    ],
    rowActions: [
      {
        label: 'Unsubscribe',
        tone: 'danger',
        confirmMessage: 'Unsubscribe this address from the newsletter?',
        handler: async (item) => {
          await api.newsletter.unsubscribe(item.email);
        },
      },
    ],
  };

  return <AdminResourcePage config={config} />;
}

function TestimonialsPage() {
  const [view, setView] = useState<'pending' | 'approved'>('pending');
  const [state, setState] = useState<{ loading: boolean; error: string; data: AdminTestimonial[] }>({ loading: true, error: '', data: [] });
  const [refreshCount, setRefreshCount] = useState(0);

  useEffect(() => {
    let active = true;

    async function load() {
      setState((prev) => ({ ...prev, loading: true, error: '' }));
      try {
        const response = view === 'pending'
          ? await api.testimonials.listPending<AdminTestimonial>('page_size=50')
          : await api.testimonials.listApproved();

        if (!active) return;
        setState({ loading: false, error: '', data: response.results as AdminTestimonial[] });
      } catch (error) {
        if (!active) return;
        setState({ loading: false, error: error instanceof Error ? error.message : 'Unable to load testimonials.', data: [] });
      }
    }

    void load();
    return () => { active = false; };
  }, [view, refreshCount]);

  const rows = state.data;

  async function approve(item: AdminTestimonial) {
    await api.testimonials.approve(item.id);
    setRefreshCount((count) => count + 1);
  }

  async function reject(item: AdminTestimonial) {
    const notes = window.prompt('Reject notes (optional)') ?? '';
    await api.testimonials.reject(item.id, notes || undefined);
    setRefreshCount((count) => count + 1);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h3 className="text-2xl font-bold text-slate-900">Testimonials</h3>
            <p className="text-slate-500">Moderate community submissions and manage approvals.</p>
          </div>
          <div className="inline-flex rounded-full border border-slate-200 bg-slate-50 p-1">
            {(['pending', 'approved'] as const).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setView(key)}
                className={`rounded-full px-4 py-2 text-sm font-medium capitalize ${view === key ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}`}
              >
                {key}
              </button>
            ))}
          </div>
        </div>
      </div>

      {state.loading && <div className="rounded-3xl border border-slate-200 bg-white p-6 text-slate-500 shadow-sm">Loading testimonials...</div>}
      {state.error && <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-700 shadow-sm">{state.error}</div>}

      {!state.loading && !state.error && (
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Name</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Role</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Text</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Status</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80">
                  <td className="px-4 py-4 text-sm text-slate-900">{item.name}</td>
                  <td className="px-4 py-4 text-sm text-slate-700">{item.display_role || item.role}</td>
                  <td className="px-4 py-4 text-sm text-slate-700 max-w-[28rem] truncate">{item.text}</td>
                  <td className="px-4 py-4 text-sm text-slate-700">
                    <StatusBadge status={item.status || (view === 'approved' ? 'Approved' : 'Pending')} />
                  </td>
                  <td className="px-4 py-4 text-right">
                    <div className="inline-flex items-center gap-2">
                      <Link to={`/dashboard/testimonials/${item.id}`} className="rounded-full border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50">Open</Link>
                      {view === 'pending' && (
                        <>
                          <button type="button" onClick={() => void approve(item)} className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700 hover:bg-emerald-100">Approve</button>
                          <button type="button" onClick={() => void reject(item)} className="rounded-full border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-700 hover:bg-red-100">Reject</button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-14 text-center text-sm text-slate-500">No testimonials found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function SponsorshipsPage() {
  const [active, setActive] = useState<'children' | 'sponsors' | 'records'>('children');
  const [state, setState] = useState<{ loading: boolean; error: string; data: unknown[] }>({ loading: true, error: '', data: [] });
  const [detailId, setDetailId] = useState<number | null>(null);
  const [detail, setDetail] = useState<unknown | null>(null);

  useEffect(() => {
    let mounted = true;

    async function load() {
      setState({ loading: true, error: '', data: [] });
      try {
        const response = active === 'children'
          ? await api.sponsorships.getChildren()
          : active === 'sponsors'
            ? await api.sponsorships.listSponsors()
            : await api.sponsorships.listSponsorships();

        if (!mounted) return;
        setState({ loading: false, error: '', data: Array.isArray(response) ? response : response.results });
      } catch (error) {
        if (!mounted) return;
        setState({ loading: false, error: error instanceof Error ? error.message : 'Unable to load sponsorship data.', data: [] });
      }
    }

    void load();
    return () => { mounted = false; };
  }, [active]);

  useEffect(() => {
    let mounted = true;
    const currentDetailId = detailId;
    if (currentDetailId === null) { return; }
    const resolvedDetailId = currentDetailId as number;

    async function loadDetail() {
      try {
        const result = active === 'children'
          ? await api.sponsorships.getChild(resolvedDetailId)
          : active === 'sponsors'
            ? await api.sponsorships.getSponsor(resolvedDetailId)
            : await api.sponsorships.getSponsorship(resolvedDetailId);
        if (!mounted) return;
        setDetail(result);
      } catch {
        if (mounted) setDetail(null);
      }
    }

    void loadDetail();
    return () => { mounted = false; };
  }, [active, detailId]);

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h3 className="text-2xl font-bold text-slate-900">Sponsorships</h3>
            <p className="text-slate-500">Children, sponsor registry, and sponsorship records.</p>
          </div>
          <div className="inline-flex rounded-full border border-slate-200 bg-slate-50 p-1">
            {(['children', 'sponsors', 'records'] as const).map((key) => (
              <button key={key} type="button" onClick={() => { setActive(key); setDetailId(null); }} className={`rounded-full px-4 py-2 text-sm font-medium capitalize ${active === key ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}`}>
                {key}
              </button>
            ))}
          </div>
        </div>
      </div>

      {state.loading && <div className="rounded-3xl border border-slate-200 bg-white p-6 text-slate-500 shadow-sm">Loading sponsorship data...</div>}
      {state.error && <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-700 shadow-sm">{state.error}</div>}

      {!state.loading && !state.error && (
        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Name / Title</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Status</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {state.data.map((item) => {
                  const record = item as { id: number; first_name?: string; last_name?: string; name?: string; is_sponsored?: boolean; needs_sponsor?: boolean };
                  const label = active === 'children' ? `${record.first_name ?? ''} ${record.last_name ?? ''}`.trim() : record.name ?? `Record #${record.id}`;
                  const status = active === 'children'
                    ? record.needs_sponsor ? 'Needs sponsor' : record.is_sponsored ? 'Sponsored' : 'Open'
                    : 'Record';
                  return (
                    <tr key={record.id} className="hover:bg-slate-50/80">
                      <td className="px-4 py-4 text-sm text-slate-900">{label || `Item #${record.id}`}</td>
                      <td className="px-4 py-4 text-sm text-slate-700"><StatusBadge status={status} /></td>
                      <td className="px-4 py-4 text-right">
                        <button type="button" onClick={() => setDetailId(record.id)} className="rounded-full border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50">Open</button>
                      </td>
                    </tr>
                  );
                })}
                {state.data.length === 0 && <tr><td colSpan={3} className="px-4 py-14 text-center text-sm text-slate-500">No records found.</td></tr>}
              </tbody>
            </table>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Detail Preview</h3>
            {detail ? <pre className="overflow-auto rounded-2xl bg-slate-950 p-4 text-xs text-slate-100">{JSON.stringify(detail, null, 2)}</pre> : <p className="text-sm text-slate-500">Select a record to inspect JSON detail.</p>}
          </div>
        </div>
      )}
    </div>
  );
}

function GalleryPage() {
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [categories, setCategories] = useState<GalleryCategory[]>([]);
  const [active, setActive] = useState<'photos' | 'featured' | 'random' | 'categories'>('photos');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);
      setError('');
      try {
        const [photoResponse, categoryResponse] = await Promise.all([
          active === 'featured' ? api.gallery.listFeaturedPhotos() : active === 'random' ? api.gallery.listRandomPhotos(24) : api.gallery.listPhotos('page_size=24'),
          api.gallery.listCategories(),
        ]);

        if (!mounted) return;
        setPhotos(Array.isArray(photoResponse) ? photoResponse : photoResponse.results);
        setCategories(categoryResponse);
      } catch (error) {
        if (!mounted) return;
        setError(error instanceof Error ? error.message : 'Unable to load gallery data.');
      } finally {
        if (mounted) setLoading(false);
      }
    }

    void load();
    return () => { mounted = false; };
  }, [active, refreshKey]);

  return (
    <div className="space-y-6">
      <DashboardSectionCard
        eyebrow="Gallery / Media Library"
        title="Upload public gallery photos"
        description="Upload a photo here when it should appear on the public gallery and be available for homepage featured content."
      >
        <GalleryUploadForm onUploaded={() => setRefreshKey((value) => value + 1)} />
      </DashboardSectionCard>

      <div className="rounded-[1.75rem] border border-orange-100 bg-white p-6 shadow-[0_18px_40px_rgba(251,146,60,0.08)]">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h3 className="text-2xl font-bold text-slate-900">Gallery / Media Library</h3>
            <p className="text-slate-500">Live preview of gallery categories and public photos.</p>
          </div>
          <div className="inline-flex rounded-full border border-orange-100 bg-orange-50/70 p-1">
            {(['photos', 'featured', 'random', 'categories'] as const).map((key) => (
              <button key={key} type="button" onClick={() => setActive(key)} className={`rounded-full px-4 py-2 text-sm font-medium capitalize transition-colors ${active === key ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-900'}`}>
                {key}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading && <div className="rounded-[1.75rem] border border-orange-100 bg-white p-6 text-slate-500 shadow-[0_18px_40px_rgba(251,146,60,0.08)]">Loading media library...</div>}
      {error && <div className="rounded-[1.75rem] border border-red-200 bg-red-50 p-6 text-red-700 shadow-sm">{error}</div>}

      {!loading && !error && (
        active === 'categories' ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {categories.map((category) => (
              <div key={category.id} className="rounded-[1.75rem] border border-orange-100 bg-white p-5 shadow-[0_18px_40px_rgba(251,146,60,0.08)]">
                <p className="text-xs uppercase tracking-[0.2em] text-orange-400">{category.slug}</p>
                <h4 className="mt-2 text-xl font-bold text-slate-900">{category.name}</h4>
                <p className="mt-2 text-sm text-slate-500">{category.description}</p>
                <div className="mt-4 text-sm text-slate-700">{category.count} photos</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {photos.map((photo) => (
              <div key={photo.id} className="overflow-hidden rounded-[1.75rem] border border-orange-100 bg-white shadow-[0_18px_40px_rgba(251,146,60,0.08)]">
                <div className="flex items-center justify-end gap-2 border-b border-orange-100/70 px-3 py-3">
                  <button
                    type="button"
                    onClick={() => {
                      const nextTitle = window.prompt('Rename this photo', photo.title) ?? '';
                      if (!nextTitle.trim()) return;
                      void api.admin.galleryPhotos.update(photo.id, { title: nextTitle.trim() }).then(() => setRefreshKey((value) => value + 1));
                    }}
                    className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Rename
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (!window.confirm('Delete this gallery photo permanently?')) return;
                      void api.admin.galleryPhotos.delete(photo.id).then(() => setRefreshKey((value) => value + 1));
                    }}
                    className="rounded-full border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100"
                  >
                    Delete
                  </button>
                </div>
                <div className="aspect-square bg-slate-100">
                  <img src={photo.image_url || photo.image} alt={photo.title} className="h-full w-full object-cover" />
                </div>
                <div className="p-4">
                  <p className="text-sm font-semibold text-slate-900">{photo.title}</p>
                  <p className="mt-1 text-xs text-slate-500">{photo.category_name}</p>
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}

export function DashboardPage() {
  return (
    <AdminShell>
      <Routes>
        <Route index element={<OverviewPage />} />
          <Route path="content" element={<ContentStudioPage />} />
          <Route path="content/pages" element={<PagesModulePage />} />
          <Route path="content/pages/:id" element={<PagesModulePage />} />
          <Route path="navigation" element={<NavigationModulePage />} />
          <Route path="navigation/:id" element={<NavigationModulePage />} />
          <Route path="media" element={<MediaLibraryPage />} />
          <Route path="media/:id" element={<MediaLibraryPage />} />
          <Route path="donations" element={<DonationsPage />} />
          <Route path="donations/:id" element={<DonationsPage />} />
          <Route path="contacts" element={<ContactsPage />} />
          <Route path="contacts/:id" element={<ContactsPage />} />
          <Route path="volunteers" element={<VolunteersPage />} />
          <Route path="volunteers/:id" element={<VolunteersPage />} />
          <Route path="newsletter" element={<NewsletterPage />} />
          <Route path="newsletter/:id" element={<NewsletterPage />} />
          <Route path="testimonials" element={<TestimonialsPage />} />
          <Route path="testimonials/:id" element={<TestimonialsPage />} />
          <Route path="sponsorships" element={<SponsorshipsPage />} />
          <Route path="sponsorships/:id" element={<SponsorshipsPage />} />
          <Route path="gallery" element={<GalleryPage />} />
          <Route path="gallery/:id" element={<GalleryPage />} />
          <Route path="marketing" element={<MarketingPage />} />
          <Route path="marketing/:id" element={<MarketingPage />} />
          <Route path="marketing/banners" element={<MarketingPage />} />
          <Route path="marketing/banners/:id" element={<MarketingPage />} />
          <Route path="audit-log" element={<AuditLogPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AdminShell>
    );
  }
  