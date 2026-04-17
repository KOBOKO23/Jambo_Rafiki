import type { OrganizationConfig } from '@/services/api';

export const DEFAULT_ORGANIZATION_CONFIG: OrganizationConfig = {
  website: {
    domain: 'www.jamborafiki.org',
    url: 'https://www.jamborafiki.org',
  },
  contact: {
    email: 'hopenationsministries8@gmail.com',
    call_redirect_number: '',
    call_redirect_url: '',
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
