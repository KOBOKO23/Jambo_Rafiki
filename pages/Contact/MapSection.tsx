import { MapPin } from "lucide-react";
import { CONTACT_INFO } from '@/config/contact';

export default function MapSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-orange-50 to-pink-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl text-gray-900 mb-4">Visit Us</h2>
          <p className="text-xl text-gray-600">Located in {CONTACT_INFO.locationLabel}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Responsive Map Container */}
          <div className="aspect-video">
            <iframe
              src={CONTACT_INFO.mapsEmbedUrl}
              title={`Map of ${CONTACT_INFO.locationLabel}`}
              width="100%"
              height="100%"
              className="border-0"
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>

          <div className="p-6 text-center">
            <MapPin className="h-8 w-8 text-orange-500 mx-auto mb-2" />
            <p className="text-gray-900 font-medium">{CONTACT_INFO.postalAddressLines.join(', ')}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
