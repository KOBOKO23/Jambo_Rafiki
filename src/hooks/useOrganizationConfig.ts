import { useEffect, useState } from 'react';
import { api, type OrganizationConfig } from '@/services/api';
import { DEFAULT_ORGANIZATION_CONFIG } from '@/config/organization';

// Backend fields that are unset come back as empty strings; they must not wipe out the defaults.
function withoutEmpty<T extends object>(value: T | undefined | null): Partial<T> {
  if (!value || typeof value !== 'object') return {};
  return Object.fromEntries(
    Object.entries(value).filter(([, v]) => v !== '' && v !== null && v !== undefined)
  ) as Partial<T>;
}

// Only tel:/http(s) links are usable from the frontend (a relative API path would 404 here).
function usableCallUrl(url: string | undefined) {
  return url && /^(tel:|https?:\/\/)/i.test(url) ? url : '';
}

export function useOrganizationConfig() {
  const [organization, setOrganization] = useState<OrganizationConfig>(DEFAULT_ORGANIZATION_CONFIG);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function loadOrganization() {
      setLoading(true);
      setError('');

      try {
        const data = await api.organization.get<OrganizationConfig>();
        if (!active) return;
        const contact = { ...DEFAULT_ORGANIZATION_CONFIG.contact, ...withoutEmpty(data.contact) };
        contact.call_redirect_url =
          usableCallUrl(contact.call_redirect_url) || DEFAULT_ORGANIZATION_CONFIG.contact.call_redirect_url;
        setOrganization({
          ...DEFAULT_ORGANIZATION_CONFIG,
          ...data,
          website: { ...DEFAULT_ORGANIZATION_CONFIG.website, ...withoutEmpty(data.website) },
          contact,
          bank_account: { ...DEFAULT_ORGANIZATION_CONFIG.bank_account, ...data.bank_account },
        });
      } catch (loadError) {
        if (!active) return;
        setError(loadError instanceof Error ? loadError.message : 'Unable to load organization details.');
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadOrganization();
    return () => {
      active = false;
    };
  }, []);

  return { organization, loading, error };
}
