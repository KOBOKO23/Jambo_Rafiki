import type { OrganizationConfig } from '@/services/api';

export const DEFAULT_ORGANIZATION_CONFIG: OrganizationConfig = {
  website: {
    domain: 'www.jamborafiki.org',
    url: 'https://www.jamborafiki.org',
  },
  contact: {
    email: 'info@jamborafiki.org',
    call_redirect_number: '+254799616542',
    call_redirect_url: 'tel:+254799616542',
  },
  bank_account: {
    bank_code: '',
    branch_code: '',
    swift_code: '',
    account_name: '',
    account_number: '',
  },
  timestamp: '',
};
