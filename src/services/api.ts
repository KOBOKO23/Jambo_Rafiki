/**
 * API Service for Jambo Rafiki Backend
 *
 * This file contains all API calls to the Django backend
 */

import { getRuntimeEnv } from '@/config/runtimeEnv';

type ApiEnvelope<T> = {
  message: string;
  data: T;
};

export type PaginatedResponse<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

type UnknownRecord = Record<string, unknown>;

export type DonationPaymentMethod = 'mpesa' | 'stripe' | 'paypal' | 'bank' | 'cash' | 'other';
export type DonationStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'refunded' | 'cancelled';
export type DonationType = 'one_time' | 'monthly' | 'quarterly' | 'annual';
export type DonationCurrency = 'KES' | 'USD' | 'EUR' | 'GBP';
export type VolunteerStatus = 'pending' | 'reviewing' | 'approved' | 'rejected' | 'contacted' | 'scheduled';
export type TestimonialRole = 'community_member' | 'volunteer' | 'donor' | 'sponsor' | 'partner' | 'other';
export type TestimonialStatus = 'pending' | 'approved' | 'rejected';

const API_PATHS = {
  organization: '/organization/',
  authLogin: '/admin/auth/login/',
  authLogout: '/admin/auth/logout/',
  authCurrentUser: '/admin/auth/me/',
  authCsrf: '/admin/auth/csrf/',
  contacts: '/contacts/',
  donations: '/donations/',
  donationsMpesa: '/donations/mpesa/',
  donationsMpesaAsync: '/donations/mpesa-async/',
  donationsMpesaSync: '/donations/mpesa-sync/',
  donationsStripe: '/donations/stripe/',
  volunteers: '/volunteers/',
  newsletterSubscribe: '/newsletter/',
  newsletterUnsubscribe: '/newsletter/unsubscribe/',
  testimonials: '/testimonials/',
  sponsorships: '/sponsorships/',
  sponsorshipChildren: '/sponsorships/children/',
  sponsorshipInterest: '/sponsorships/interest/',
  galleryCategories: '/gallery/categories/',
  galleryPhotos: '/gallery/photos/',
  galleryFeaturedPhotos: '/gallery/photos/featured/',
  galleryRandomPhotos: '/gallery/photos/random/',
  health: '/health/',
  ready: '/ready/',
  adminOverview: '/admin/overview/',
  adminAuditEvents: '/admin/audit-events/',
  adminBackgroundJobs: '/admin/background-jobs/',
  adminSiteSettings: '/admin/site-settings/',
  adminPages: '/admin/pages/',
  adminPageSections: '/admin/page-sections/',
  adminNavigationMenus: '/admin/navigation-menus/',
  adminNavigationItems: '/admin/navigation-items/',
  adminBanners: '/admin/banners/',
  adminRedirectRules: '/admin/redirect-rules/',
  adminMediaAssets: '/admin/media-assets/',
  adminContentRevisions: '/admin/content-revisions/',
  adminGalleryCategories: '/admin/gallery/categories/',
  adminGalleryPhotos: '/admin/gallery/photos/',
} as const;

function resolveApiBaseUrl(): string {
  const configured = getRuntimeEnv().apiUrl.trim().replace(/\/+$/, '');

  if (/\/api\/v1$/i.test(configured)) {
    return configured;
  }

  if (/\/api$/i.test(configured)) {
    return `${configured}/v1`;
  }

  return `${configured}/api/v1`;
}

const API_BASE_URL = resolveApiBaseUrl();
const { enableCredentials } = getRuntimeEnv();

const JSON_HEADERS = {
  'Content-Type': 'application/json',
} as const;

const MUTATING_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

function normalizeErrorMessage(payload: unknown): string | null {
  if (!payload) return null;

  if (typeof payload === 'string') {
    return payload;
  }

  if (typeof payload !== 'object') {
    return null;
  }

  const record = payload as UnknownRecord;
  const preferred = record.message ?? record.error ?? record.detail;

  if (typeof preferred === 'string' && preferred.trim()) {
    return preferred;
  }

  for (const value of Object.values(record)) {
    if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'string') {
      return value[0];
    }
  }

  return null;
}

function fallbackErrorMessage(status: number): string {
  switch (status) {
    case 400:
      return 'Invalid request. Please review your input and try again.';
    case 403:
      return 'You do not have permission to perform this action.';
    case 429:
      return 'Too many requests. Please wait a moment and try again.';
    default:
      if (status >= 500) {
        return 'Server error. Please try again shortly.';
      }
      return 'Request failed. Please try again.';
  }
}

// Types
export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface MPesaDonation {
  donor_name: string;
  donor_email: string;
  donor_phone: string;
  amount: number;
  currency?: DonationCurrency;
  donation_type?: DonationType;
  purpose?: string;
  message?: string;
  is_anonymous?: boolean;
}

export interface StripeDonation {
  donor_name: string;
  donor_email: string;
  amount: number;
  currency?: DonationCurrency;
  donation_type?: DonationType;
  purpose?: string;
  message?: string;
  is_anonymous?: boolean;
  payment_method_id?: string;
}

export interface VolunteerApplication {
  name: string;
  email: string;
  phone: string;
  location: string;
  skills: string;
  availability: string;
  duration: string;
  motivation: string;
  experience?: string;
  areas_of_interest?: string;
}

export interface NewsletterSubscription {
  email: string;
  name?: string;
  source?: string;
}

export interface SponsorshipInterest {
  name: string;
  email: string;
  phone: string;
  preferred_level?: string | null;
}

export interface TestimonialSubmission {
  name: string;
  email: string;
  role: TestimonialRole;
  role_custom?: string;
  text: string;
}

export interface HealthResponse {
  status: string;
  service: string;
  timestamp: string;
}

export interface ReadinessResponse {
  status: 'ready' | 'not_ready';
  checks: Record<string, string>;
  errors?: Record<string, string>;
  timestamp: string;
}

export interface OrganizationWebsiteConfig {
  domain: string;
  url: string;
}

export interface OrganizationContactConfig {
  email: string;
  call_redirect_number: string;
  call_redirect_url: string;
}

export interface OrganizationBankAccountConfig {
  bank_code: string;
  branch_code: string;
  swift_code: string;
  account_name: string;
  account_number: string;
}

export interface OrganizationConfig {
  website: OrganizationWebsiteConfig;
  contact: OrganizationContactConfig;
  bank_account: OrganizationBankAccountConfig;
  timestamp: string;
}

export interface GalleryPhoto {
  id: number;
  title: string;
  description: string;
  image: string;
  image_url?: string | null;
  category: number;
  category_name: string;
  date_taken: string | null;
  is_featured: boolean;
  created_at: string;
}

export interface GalleryCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  icon?: string | null;
  color?: string | null;
  count: number;
}

export interface AdminContact extends ContactFormData {
  id: number;
  created_at: string;
  updated_at?: string;
  is_read: boolean;
  notes?: string | null;
}

export interface AdminDonation {
  id: number;
  donor_name: string;
  donor_email: string;
  donor_phone?: string;
  is_anonymous: boolean;
  amount: string | number;
  currency: DonationCurrency;
  donation_type: DonationType;
  purpose?: string;
  message?: string;
  payment_method: DonationPaymentMethod;
  status: DonationStatus;
  transaction_id?: string | null;
  mpesa_receipt?: string | null;
  mpesa_phone?: string | null;
  mpesa_checkout_request_id?: string | null;
  mpesa_merchant_request_id?: string | null;
  stripe_payment_intent?: string | null;
  stripe_charge_id?: string | null;
  paypal_order_id?: string | null;
  receipt_sent?: boolean;
  receipt_number?: string | null;
  created_at: string;
  updated_at?: string;
  completed_at?: string | null;
  notes?: string | null;
}

export interface AdminVolunteer extends VolunteerApplication {
  id: number;
  status: VolunteerStatus;
  created_at: string;
  updated_at?: string;
  reviewed_at?: string | null;
  notes?: string | null;
}

export interface NewsletterSubscriberRecord extends NewsletterSubscription {
  id: number;
  is_active: boolean;
  subscribed_at: string;
  unsubscribed_at?: string | null;
}

export interface AdminTestimonial {
  id: number;
  name: string;
  email: string;
  role: TestimonialRole;
  role_custom?: string | null;
  display_role?: string;
  text: string;
  status: TestimonialStatus;
  notes?: string | null;
  created_at: string;
  updated_at?: string;
  approved_at?: string | null;
}

export interface SponsorRecord extends UnknownRecord {
  id: number;
}

export interface SponsorshipRecord extends UnknownRecord {
  id: number;
}

export interface AdminPageRecord extends UnknownRecord {
  id: number;
  title: string;
  slug: string;
  status: string;
  published_at?: string | null;
  scheduled_for?: string | null;
  updated_at?: string;
  seo_title?: string;
  seo_description?: string;
  canonical_url?: string;
}

export interface AdminNavigationMenuRecord extends UnknownRecord {
  id: number;
  name?: string;
  slug?: string;
  location?: string;
  is_active?: boolean;
  updated_at?: string;
}

export interface AdminNavigationItemRecord extends UnknownRecord {
  id: number;
  label: string;
  url?: string;
  menu?: number;
  page?: number | null;
  parent?: number | null;
  sort_order?: number;
  is_active?: boolean;
  open_in_new_tab?: boolean;
}

export interface AdminBannerRecord extends UnknownRecord {
  id: number;
  title: string;
  message?: string;
  cta_label?: string;
  cta_url?: string;
  starts_at?: string | null;
  ends_at?: string | null;
  is_active?: boolean;
  priority?: number;
}

export interface AdminRedirectRuleRecord extends UnknownRecord {
  id: number;
  source_path: string;
  target_url: string;
  status_code?: number;
  is_active?: boolean;
}

export interface AdminMediaAssetRecord extends UnknownRecord {
  id: number;
  title: string;
  file?: string;
  file_url?: string | null;
  alt_text?: string;
  caption?: string;
  category?: string;
  tags?: string[] | string;
  usage_count?: number;
  updated_at?: string;
}

export interface AdminContentRevisionRecord extends UnknownRecord {
  id: number;
  entity_type?: string;
  entity_id?: number;
  version?: number;
  status?: string;
  author?: string;
  published_by?: string;
  created_at?: string;
  published_at?: string;
  summary?: string;
}

export interface AdminAuditEventRecord extends UnknownRecord {
  id: number;
  actor?: string;
  action?: string;
  target_type?: string;
  target_id?: number;
  target_label?: string;
  created_at?: string;
  metadata?: UnknownRecord;
}

export interface AdminBackgroundJobRecord extends UnknownRecord {
  id: number;
  name?: string;
  status?: string;
  attempts?: number;
  created_at?: string;
  updated_at?: string;
  last_error?: string;
}

export interface AdminSiteSettingsRecord extends UnknownRecord {
  id?: number;
  site_name?: string;
  tagline?: string;
  logo?: string;
  logo_url?: string;
  favicon?: string;
  favicon_url?: string;
  primary_color?: string;
  secondary_color?: string;
  support_email?: string;
  support_phone?: string;
  address?: string;
  social_links?: UnknownRecord;
  seo_default_title?: string;
  seo_default_description?: string;
  homepage_title?: string;
  homepage_subtitle?: string;
  updated_at?: string;
}

export interface AdminLoginRequest {
  email: string;
  password: string;
}

export interface AdminLoginResponse {
  message: string;
  user: AdminUserProfile;
}

export interface AdminUserProfile extends UnknownRecord {
  id: number;
  email: string;
  username?: string;
  first_name?: string;
  last_name?: string;
  is_staff: boolean;
  is_superuser: boolean;
  is_active: boolean;
  role?: string;
  permissions?: string[];
}

// Helper function to handle API responses
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    const message = normalizeErrorMessage(payload) ?? fallbackErrorMessage(response.status);
    throw new ApiError(message, response.status);
  }
  return response.json();
}

function getCookieValue(name: string): string {
  if (typeof document === 'undefined') return '';

  const cookies = document.cookie ? document.cookie.split(';') : [];
  for (const cookie of cookies) {
    const [cookieName, ...rest] = cookie.trim().split('=');
    if (cookieName === name) {
      return decodeURIComponent(rest.join('='));
    }
  }

  return '';
}

function buildRequestInit(init?: RequestInit): RequestInit {
  const method = (init?.method ?? 'GET').toUpperCase();
  const headers = new Headers(init?.headers);

  if (!headers.has('Accept')) {
    headers.set('Accept', 'application/json');
  }

  if (init?.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  if (enableCredentials && MUTATING_METHODS.has(method)) {
    const csrfToken = getCookieValue('csrftoken');
    if (csrfToken && !headers.has('X-CSRFToken')) {
      headers.set('X-CSRFToken', csrfToken);
    }
  }

  return {
    ...init,
    method,
    headers,
    credentials: enableCredentials ? 'include' : init?.credentials,
  };
}

async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, buildRequestInit(init));
  return handleResponse<T>(response);
}

// API Service
export const api = {
  // Auth API
  auth: {
    csrf: async () => {
      return requestJson<{ csrf_token: string }>(API_PATHS.authCsrf);
    },

    login: async (email: string, password: string) => {
      return requestJson<AdminLoginResponse>(API_PATHS.authLogin, {
        method: 'POST',
        headers: JSON_HEADERS,
        body: JSON.stringify({ email, password }),
      });
    },

    logout: async () => {
      return requestJson<{ message: string }>(API_PATHS.authLogout, {
        method: 'POST',
        headers: JSON_HEADERS,
      });
    },

    currentUser: async <T = AdminUserProfile>() => {
      return requestJson<T>(API_PATHS.authCurrentUser);
    },
  },

  // Contact Form API
  contacts: {
    /**
     * Submit contact form
     */
    submit: async (data: ContactFormData) => {
      return requestJson<ApiEnvelope<UnknownRecord>>(API_PATHS.contacts, {
        method: 'POST',
        headers: JSON_HEADERS,
        body: JSON.stringify(data),
      });
    },

    list: async <T = AdminContact>(query = '') => {
      const suffix = query ? `?${query}` : '';
      return requestJson<PaginatedResponse<T>>(`${API_PATHS.contacts}${suffix}`);
    },

    get: async <T = AdminContact>(id: number) => {
      return requestJson<T>(`${API_PATHS.contacts}${id}/`);
    },

    markRead: async (id: number) => {
      return requestJson<UnknownRecord>(`${API_PATHS.contacts}${id}/mark_read/`, {
        method: 'PATCH',
        headers: JSON_HEADERS,
      });
    },
  },

  organization: {
    get: async <T = OrganizationConfig>() => {
      return requestJson<T>(API_PATHS.organization);
    },
  },

  // Donations API
  donations: {
    /**
     * Initiate M-Pesa donation
     */
    mpesa: async (data: MPesaDonation) => {
      return requestJson<{
        message: string;
        donation_id: number;
        job_id?: number;
        status?: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded' | 'cancelled';
        checkout_request_id?: string;
        merchant_request_id?: string;
      }>(API_PATHS.donationsMpesa, {
        method: 'POST',
        headers: JSON_HEADERS,
        body: JSON.stringify(data),
      });
    },

    mpesaAsync: async (data: MPesaDonation) => {
      return requestJson<{
        message: string;
        donation_id: number;
        job_id: number;
        status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded' | 'cancelled';
      }>(API_PATHS.donationsMpesaAsync, {
        method: 'POST',
        headers: JSON_HEADERS,
        body: JSON.stringify(data),
      });
    },

    mpesaSync: async (data: MPesaDonation) => {
      return requestJson<{
        message: string;
        donation_id: number;
        checkout_request_id?: string;
        merchant_request_id?: string;
      }>(API_PATHS.donationsMpesaSync, {
        method: 'POST',
        headers: JSON_HEADERS,
        body: JSON.stringify(data),
      });
    },

    /**
     * Process Stripe donation
     */
    stripe: async (data: StripeDonation) => {
      return requestJson<{
        message: string;
        donation_id: number;
        payment_intent_id: string;
        client_secret: string;
        status: string;
      }>(API_PATHS.donationsStripe, {
        method: 'POST',
        headers: JSON_HEADERS,
        body: JSON.stringify(data),
      });
    },

    list: async <T = AdminDonation>(query = '') => {
      const suffix = query ? `?${query}` : '';
      return requestJson<PaginatedResponse<T>>(`${API_PATHS.donations}${suffix}`);
    },

    get: async <T = AdminDonation>(id: number) => {
      return requestJson<T>(`${API_PATHS.donations}${id}/`);
    },

    reconciliation: async <T = UnknownRecord>() => {
      return requestJson<T>(`${API_PATHS.donations}reconciliation/`);
    },
  },

  // Volunteers API
  volunteers: {
    /**
     * Submit volunteer application
     */
    submit: async (data: VolunteerApplication) => {
      return requestJson<ApiEnvelope<UnknownRecord>>(API_PATHS.volunteers, {
        method: 'POST',
        headers: JSON_HEADERS,
        body: JSON.stringify(data),
      });
    },

    list: async <T = AdminVolunteer>(query = '') => {
      const suffix = query ? `?${query}` : '';
      return requestJson<PaginatedResponse<T>>(`${API_PATHS.volunteers}${suffix}`);
    },

    get: async <T = AdminVolunteer>(id: number) => {
      return requestJson<T>(`${API_PATHS.volunteers}${id}/`);
    },

    updateStatus: async (id: number, status: string) => {
      return requestJson<UnknownRecord>(`${API_PATHS.volunteers}${id}/update_status/`, {
        method: 'PATCH',
        headers: JSON_HEADERS,
        body: JSON.stringify({ status }),
      });
    },
  },

  // Newsletter API
  newsletter: {
    /**
     * Subscribe to newsletter
     */
    subscribe: async (data: NewsletterSubscription) => {
      return requestJson<{ message: string }>(API_PATHS.newsletterSubscribe, {
        method: 'POST',
        headers: JSON_HEADERS,
        body: JSON.stringify(data),
      });
    },

    /**
     * Unsubscribe from newsletter
     */
    unsubscribe: async (email: string) => {
      return requestJson<{ message: string }>(API_PATHS.newsletterUnsubscribe, {
        method: 'POST',
        headers: JSON_HEADERS,
        body: JSON.stringify({ email }),
      });
    },

    list: async <T = NewsletterSubscriberRecord>(query = '') => {
      const suffix = query ? `?${query}` : '';
      return requestJson<PaginatedResponse<T>>(`${API_PATHS.newsletterSubscribe}${suffix}`);
    },

    get: async <T = NewsletterSubscriberRecord>(id: number) => {
      return requestJson<T>(`${API_PATHS.newsletterSubscribe}${id}/`);
    },
  },

  testimonials: {
    submit: async (data: TestimonialSubmission) => {
      return requestJson<{ message: string }>(API_PATHS.testimonials, {
        method: 'POST',
        headers: JSON_HEADERS,
        body: JSON.stringify(data),
      });
    },

    listApproved: async () => {
      return requestJson<PaginatedResponse<{
        id: number;
        name: string;
        display_role: string;
        text: string;
        approved_at: string;
      }>>(API_PATHS.testimonials);
    },

    listPending: async <T = AdminTestimonial>(query = '') => {
      const suffix = query ? `?${query}` : '';
      return requestJson<PaginatedResponse<T>>(`${API_PATHS.testimonials}pending/${suffix}`);
    },

    get: async <T = AdminTestimonial>(id: number) => {
      return requestJson<T>(`${API_PATHS.testimonials}${id}/`);
    },

    approve: async (id: number) => {
      return requestJson<UnknownRecord>(`${API_PATHS.testimonials}${id}/approve/`, {
        method: 'PATCH',
        headers: JSON_HEADERS,
      });
    },

    reject: async (id: number, notes?: string) => {
      return requestJson<UnknownRecord>(`${API_PATHS.testimonials}${id}/reject/`, {
        method: 'PATCH',
        headers: JSON_HEADERS,
        body: JSON.stringify({ notes }),
      });
    },
  },

  // Sponsorships API (Future)
  sponsorships: {
    /**
     * Get list of children available for sponsorship
     */
    getChildren: async () => {
      return requestJson<UnknownRecord[]>(API_PATHS.sponsorshipChildren);
    },

    /**
     * Get specific child details
     */
    getChild: async (id: number) => {
      return requestJson<UnknownRecord>(`${API_PATHS.sponsorshipChildren}${id}/`);
    },

    listSponsors: async <T = SponsorRecord>(query = '') => {
      const suffix = query ? `?${query}` : '';
      return requestJson<PaginatedResponse<T>>(`${API_PATHS.sponsorships}sponsors/${suffix}`);
    },

    getSponsor: async <T = SponsorRecord>(id: number) => {
      return requestJson<T>(`${API_PATHS.sponsorships}sponsors/${id}/`);
    },

    createSponsor: async <T = SponsorRecord>(data: UnknownRecord) => {
      return requestJson<T>(`${API_PATHS.sponsorships}sponsors/`, {
        method: 'POST',
        headers: JSON_HEADERS,
        body: JSON.stringify(data),
      });
    },

    updateSponsor: async <T = SponsorRecord>(id: number, data: UnknownRecord, method: 'PUT' | 'PATCH' = 'PATCH') => {
      return requestJson<T>(`${API_PATHS.sponsorships}sponsors/${id}/`, {
        method,
        headers: JSON_HEADERS,
        body: JSON.stringify(data),
      });
    },

    deleteSponsor: async (id: number) => {
      return requestJson<UnknownRecord>(`${API_PATHS.sponsorships}sponsors/${id}/`, {
        method: 'DELETE',
        headers: JSON_HEADERS,
      });
    },

    listSponsorships: async <T = SponsorshipRecord>(query = '') => {
      const suffix = query ? `?${query}` : '';
      return requestJson<PaginatedResponse<T>>(`${API_PATHS.sponsorships}sponsorships/${suffix}`);
    },

    getSponsorship: async <T = SponsorshipRecord>(id: number) => {
      return requestJson<T>(`${API_PATHS.sponsorships}sponsorships/${id}/`);
    },

    createSponsorship: async <T = SponsorshipRecord>(data: UnknownRecord) => {
      return requestJson<T>(`${API_PATHS.sponsorships}sponsorships/`, {
        method: 'POST',
        headers: JSON_HEADERS,
        body: JSON.stringify(data),
      });
    },

    updateSponsorship: async <T = SponsorshipRecord>(id: number, data: UnknownRecord, method: 'PUT' | 'PATCH' = 'PATCH') => {
      return requestJson<T>(`${API_PATHS.sponsorships}sponsorships/${id}/`, {
        method,
        headers: JSON_HEADERS,
        body: JSON.stringify(data),
      });
    },

    deleteSponsorship: async (id: number) => {
      return requestJson<UnknownRecord>(`${API_PATHS.sponsorships}sponsorships/${id}/`, {
        method: 'DELETE',
        headers: JSON_HEADERS,
      });
    },

    submitInterest: async (data: SponsorshipInterest) => {
      return requestJson<ApiEnvelope<SponsorshipInterest>>(API_PATHS.sponsorshipInterest, {
        method: 'POST',
        headers: JSON_HEADERS,
        body: JSON.stringify(data),
      });
    },
  },

  gallery: {
    listCategories: async () => {
      return requestJson<GalleryCategory[]>(API_PATHS.galleryCategories);
    },

    listPhotos: async (query = '') => {
      const suffix = query ? `?${query}` : '';
      return requestJson<PaginatedResponse<GalleryPhoto>>(`${API_PATHS.galleryPhotos}${suffix}`);
    },

    listFeaturedPhotos: async () => {
      return requestJson<GalleryPhoto[]>(API_PATHS.galleryFeaturedPhotos);
    },

    listRandomPhotos: async (count = 30) => {
      const safeCount = Math.max(1, Math.min(100, count));
      return requestJson<GalleryPhoto[]>(`${API_PATHS.galleryRandomPhotos}?count=${safeCount}`);
    },

    getCategory: async <T = GalleryCategory>(slug: string) => {
      return requestJson<T>(`${API_PATHS.galleryCategories}${slug}/`);
    },

    getPhoto: async <T = GalleryPhoto>(id: number) => {
      return requestJson<T>(`${API_PATHS.galleryPhotos}${id}/`);
    },
  },

  admin: {
    overview: async <T = UnknownRecord>() => {
      return requestJson<T>(API_PATHS.adminOverview);
    },

    auditEvents: {
      list: async <T = AdminAuditEventRecord>(query = '') => {
        const suffix = query ? `?${query}` : '';
        return requestJson<PaginatedResponse<T>>(`${API_PATHS.adminAuditEvents}${suffix}`);
      },
    },

    backgroundJobs: {
      list: async <T = AdminBackgroundJobRecord>(query = '') => {
        const suffix = query ? `?${query}` : '';
        return requestJson<PaginatedResponse<T>>(`${API_PATHS.adminBackgroundJobs}${suffix}`);
      },
      get: async <T = AdminBackgroundJobRecord>(id: number) => {
        return requestJson<T>(`${API_PATHS.adminBackgroundJobs}${id}/`);
      },
      retry: async (id: number) => {
        return requestJson<UnknownRecord>(`${API_PATHS.adminBackgroundJobs}${id}/retry/`, {
          method: 'POST',
          headers: JSON_HEADERS,
        });
      },
    },

    siteSettings: {
      get: async <T = AdminSiteSettingsRecord>() => {
        return requestJson<T>(API_PATHS.adminSiteSettings);
      },
      update: async <T = AdminSiteSettingsRecord>(data: UnknownRecord, method: 'PUT' | 'PATCH' = 'PATCH') => {
        return requestJson<T>(API_PATHS.adminSiteSettings, {
          method,
          headers: JSON_HEADERS,
          body: JSON.stringify(data),
        });
      },
    },

    pages: {
      list: async <T = AdminPageRecord>(query = '') => {
        const suffix = query ? `?${query}` : '';
        return requestJson<PaginatedResponse<T>>(`${API_PATHS.adminPages}${suffix}`);
      },
      get: async <T = AdminPageRecord>(id: number) => {
        return requestJson<T>(`${API_PATHS.adminPages}${id}/`);
      },
      create: async <T = AdminPageRecord>(data: UnknownRecord) => {
        return requestJson<T>(API_PATHS.adminPages, {
          method: 'POST',
          headers: JSON_HEADERS,
          body: JSON.stringify(data),
        });
      },
      update: async <T = AdminPageRecord>(id: number, data: UnknownRecord, method: 'PUT' | 'PATCH' = 'PATCH') => {
        return requestJson<T>(`${API_PATHS.adminPages}${id}/`, {
          method,
          headers: JSON_HEADERS,
          body: JSON.stringify(data),
        });
      },
      publish: async (id: number) => {
        return requestJson<UnknownRecord>(`${API_PATHS.adminPages}${id}/publish/`, {
          method: 'POST',
          headers: JSON_HEADERS,
        });
      },
      archive: async (id: number) => {
        return requestJson<UnknownRecord>(`${API_PATHS.adminPages}${id}/archive/`, {
          method: 'POST',
          headers: JSON_HEADERS,
        });
      },
      schedule: async (id: number, scheduled_for: string) => {
        return requestJson<UnknownRecord>(`${API_PATHS.adminPages}${id}/schedule/`, {
          method: 'POST',
          headers: JSON_HEADERS,
          body: JSON.stringify({ scheduled_for }),
        });
      },
      preview: async <T = UnknownRecord>(id: number) => {
        return requestJson<T>(`${API_PATHS.adminPages}${id}/preview/`);
      },
    },

    pageSections: {
      list: async <T = UnknownRecord>(query = '') => {
        const suffix = query ? `?${query}` : '';
        return requestJson<PaginatedResponse<T>>(`${API_PATHS.adminPageSections}${suffix}`);
      },
      get: async <T = UnknownRecord>(id: number) => {
        return requestJson<T>(`${API_PATHS.adminPageSections}${id}/`);
      },
    },

    navigationMenus: {
      list: async <T = AdminNavigationMenuRecord>(query = '') => {
        const suffix = query ? `?${query}` : '';
        return requestJson<PaginatedResponse<T>>(`${API_PATHS.adminNavigationMenus}${suffix}`);
      },
      get: async <T = AdminNavigationMenuRecord>(id: number) => {
        return requestJson<T>(`${API_PATHS.adminNavigationMenus}${id}/`);
      },
    },

    navigationItems: {
      list: async <T = AdminNavigationItemRecord>(query = '') => {
        const suffix = query ? `?${query}` : '';
        return requestJson<PaginatedResponse<T>>(`${API_PATHS.adminNavigationItems}${suffix}`);
      },
      get: async <T = AdminNavigationItemRecord>(id: number) => {
        return requestJson<T>(`${API_PATHS.adminNavigationItems}${id}/`);
      },
    },

    banners: {
      list: async <T = AdminBannerRecord>(query = '') => {
        const suffix = query ? `?${query}` : '';
        return requestJson<PaginatedResponse<T>>(`${API_PATHS.adminBanners}${suffix}`);
      },
      get: async <T = AdminBannerRecord>(id: number) => {
        return requestJson<T>(`${API_PATHS.adminBanners}${id}/`);
      },
    },

    redirectRules: {
      list: async <T = AdminRedirectRuleRecord>(query = '') => {
        const suffix = query ? `?${query}` : '';
        return requestJson<PaginatedResponse<T>>(`${API_PATHS.adminRedirectRules}${suffix}`);
      },
      get: async <T = AdminRedirectRuleRecord>(id: number) => {
        return requestJson<T>(`${API_PATHS.adminRedirectRules}${id}/`);
      },
    },

    mediaAssets: {
      list: async <T = AdminMediaAssetRecord>(query = '') => {
        const suffix = query ? `?${query}` : '';
        return requestJson<PaginatedResponse<T>>(`${API_PATHS.adminMediaAssets}${suffix}`);
      },
      get: async <T = AdminMediaAssetRecord>(id: number) => {
        return requestJson<T>(`${API_PATHS.adminMediaAssets}${id}/`);
      },
    },

    contentRevisions: {
      list: async <T = AdminContentRevisionRecord>(query = '') => {
        const suffix = query ? `?${query}` : '';
        return requestJson<PaginatedResponse<T>>(`${API_PATHS.adminContentRevisions}${suffix}`);
      },
      get: async <T = AdminContentRevisionRecord>(id: number) => {
        return requestJson<T>(`${API_PATHS.adminContentRevisions}${id}/`);
      },
    },

    galleryCategories: {
      list: async <T = GalleryCategory>(query = '') => {
        const suffix = query ? `?${query}` : '';
        return requestJson<PaginatedResponse<T>>(`${API_PATHS.adminGalleryCategories}${suffix}`);
      },
      get: async <T = GalleryCategory>(id: number) => {
        return requestJson<T>(`${API_PATHS.adminGalleryCategories}${id}/`);
      },
    },

    galleryPhotos: {
      list: async <T = GalleryPhoto>(query = '') => {
        const suffix = query ? `?${query}` : '';
        return requestJson<PaginatedResponse<T>>(`${API_PATHS.adminGalleryPhotos}${suffix}`);
      },
      get: async <T = GalleryPhoto>(id: number) => {
        return requestJson<T>(`${API_PATHS.adminGalleryPhotos}${id}/`);
      },
    },
  },

  diagnostics: {
    health: async () => {
      return requestJson<HealthResponse>(API_PATHS.health);
    },

    ready: async () => {
      return requestJson<ReadinessResponse>(API_PATHS.ready);
    },
  },
};

// Export API URL for use in other files
export { API_BASE_URL };
