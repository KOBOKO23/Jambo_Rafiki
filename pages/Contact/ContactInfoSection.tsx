import { User, Mail, MapPin, Phone } from "lucide-react";
import { CONTACT_INFO } from '@/config/contact';
import { useOrganizationConfig } from '@/hooks/useOrganizationConfig';

export default function ContactInfoSection() {
  const { organization } = useOrganizationConfig();
  const email = organization.contact.email;
  const callNumber = organization.contact.call_redirect_number;
  const callHref = organization.contact.call_redirect_url || (callNumber ? `tel:${callNumber}` : '');

  return (
    <div>
      <h2 className="text-3xl text-gray-900 mb-8">Get in Touch</h2>
      <div className="space-y-6 mb-8">
        {/* Contact Person */}
        <div className="flex items-start space-x-4 p-6 bg-gradient-to-r from-orange-50 to-pink-50 rounded-xl">
          <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-orange-400 to-pink-500 rounded-lg flex items-center justify-center">
            <User className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg text-gray-900 mb-1">Contact Person</h3>
            <p className="text-gray-700">{CONTACT_INFO.contactPerson}</p>
          </div>
        </div>

        {/* Email */}
        <div className="flex items-start space-x-4 p-6 bg-gradient-to-r from-orange-50 to-pink-50 rounded-xl">
          <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-orange-400 to-pink-500 rounded-lg flex items-center justify-center">
            <Mail className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg text-gray-900 mb-1">Email Address</h3>
            <a
              href={`mailto:${email}`}
              className="text-orange-600 hover:text-orange-700 break-all"
            >
              {email}
            </a>
          </div>
        </div>

        {callHref ? (
          <div className="flex items-start space-x-4 p-6 bg-gradient-to-r from-orange-50 to-pink-50 rounded-xl">
            <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-orange-400 to-pink-500 rounded-lg flex items-center justify-center">
              <Phone className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg text-gray-900 mb-1">Call Us</h3>
              <a href={callHref} className="text-orange-600 hover:text-orange-700 break-all">
                {callNumber || 'Open phone link'}
              </a>
            </div>
          </div>
        ) : null}

        {/* Postal Address */}
        <div className="flex items-start space-x-4 p-6 bg-gradient-to-r from-orange-50 to-pink-50 rounded-xl">
          <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-orange-400 to-pink-500 rounded-lg flex items-center justify-center">
            <MapPin className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg text-gray-900 mb-1">Postal Address</h3>
            <p className="text-gray-700">
              {CONTACT_INFO.postalAddressLines.map((line) => (
                <span key={line}>
                  {line}
                  <br />
                </span>
              ))}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl">
        <h3 className="text-xl text-gray-900 mb-3">Office Hours</h3>
        <p className="text-gray-700 mb-4">
          We welcome visitors and volunteers. Please contact us in advance to schedule a visit.
        </p>
        <p className="text-gray-600 text-sm">
          Note: For donations and support inquiries, we typically respond within 24-48 hours.
        </p>
      </div>
    </div>
  );
}
