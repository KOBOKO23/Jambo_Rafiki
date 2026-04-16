import { useEffect, useState } from 'react';
import { api, type OrganizationConfig } from '@/services/api';
import { DEFAULT_ORGANIZATION_CONFIG } from '@/config/organization';

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
        setOrganization({
          ...DEFAULT_ORGANIZATION_CONFIG,
          ...data,
          website: { ...DEFAULT_ORGANIZATION_CONFIG.website, ...data.website },
          contact: { ...DEFAULT_ORGANIZATION_CONFIG.contact, ...data.contact },
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
