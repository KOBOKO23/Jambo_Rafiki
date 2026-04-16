import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone, Globe, Landmark } from 'lucide-react';
import { CONTACT_INFO } from '@/config/contact';
import { useOrganizationConfig } from '@/hooks/useOrganizationConfig';

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.514c-1.491 0-1.956.93-1.956 1.874v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
    </svg>
  );
}

export function Footer() {
  const { organization } = useOrganizationConfig();

  const email = organization.contact.email || CONTACT_INFO.email;
  const callNumber = organization.contact.call_redirect_number;
  const callHref = organization.contact.call_redirect_url || (callNumber ? `tel:${callNumber}` : '');
  const bankAccount = organization.bank_account;

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* About */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <img
                src="/logo/IMG_0281.webp"
                alt="Jambo Rafiki Logo"
                className="h-20 w-20 object-cover rounded-lg"
              />
              <div>
                <div className="text-white">JAMBO RAFIKI</div>
                <div className="text-xs text-gray-400">Children Orphanage & Church Centre</div>
              </div>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              A Christian community-based organization dedicated to providing social protection to orphaned and vulnerable children, restoring their dignity and hope for the future.
            </p>
            <p className="text-sm text-orange-400 mb-5">Building Resilience • Restoring Hope</p>

            {/* Social */}
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-500 uppercase tracking-widest">Follow us</span>
              <a
                href={CONTACT_INFO.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Jambo Rafiki on Facebook"
                className="w-8 h-8 bg-gray-800 hover:bg-[#1877F2] rounded-lg flex items-center justify-center transition-colors duration-200 group"
              >
                <FacebookIcon className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              {[
                { to: '/about', label: 'About Us' },
                { to: '/programs', label: 'Our Programs' },
                { to: '/get-involved', label: 'Get Involved' },
                { to: '/contact', label: 'Contact Us' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="hover:text-orange-400 transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start space-x-2">
                <MapPin className="h-5 w-5 text-orange-400 flex-shrink-0 mt-0.5" />
                <span>P.O Box 311 – 40222<br />OYUGIS - KENYA</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="h-5 w-5 text-orange-400 flex-shrink-0" />
                <a
                  href={`mailto:${email}`}
                  className="hover:text-orange-400 transition-colors break-all"
                >
                  {email}
                </a>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-5 w-5 text-orange-400 flex-shrink-0" />
                {callHref ? (
                  <a href={callHref} className="hover:text-orange-400 transition-colors">
                    {callNumber || 'Call us'}
                  </a>
                ) : (
                  <span>{CONTACT_INFO.contactPerson}</span>
                )}
              </li>
              <li className="flex items-center space-x-2">
                <Globe className="h-5 w-5 text-orange-400 flex-shrink-0" />
                <a
                  href={organization.website.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-orange-400 transition-colors break-all"
                >
                  {organization.website.domain}
                </a>
              </li>
              {bankAccount.account_name || bankAccount.account_number ? (
                <li className="flex items-start space-x-2">
                  <Landmark className="h-5 w-5 text-orange-400 flex-shrink-0 mt-0.5" />
                  <span>
                    {bankAccount.account_name || 'Bank transfer details'}
                    {bankAccount.account_number ? <><br />A/C {bankAccount.account_number}</> : null}
                  </span>
                </li>
              ) : null}
              <li className="flex items-center space-x-2">
                <FacebookIcon className="h-5 w-5 text-orange-400 flex-shrink-0" />
                <a
                  href={CONTACT_INFO.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-orange-400 transition-colors"
                >
                  Follow us on Facebook
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p className="text-gray-400">
            © {new Date().getFullYear()} Jambo Rafiki Children Orphanage and Church Centre. All rights reserved.
          </p>
          <p className="text-gray-500 mt-2">
            Registered with the Government of Kenya - Department of Social Services, Culture and Sports
          </p>
        </div>
      </div>
    </footer>
  );
}