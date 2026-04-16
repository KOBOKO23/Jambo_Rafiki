import {
  HeroSection,
  ContactSection,
  MapSection,
  CallToAction,
} from "./";
import { SEO } from '@/components/SEO';

export default function ContactPage() {
  return (
    <div className="w-full">
      <SEO
        title="Contact"
        description="Contact Jambo Rafiki Children Orphanage and Church Centre in Oyugis, Kenya for visits, donations, volunteer opportunities, and partnerships."
        path="/contact"
      />
      <HeroSection />
      {/* Keep Info + Form in same section for side-by-side */}
      <ContactSection />
      <MapSection />
      <CallToAction />
    </div>
  );
}
