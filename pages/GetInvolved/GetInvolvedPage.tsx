import { HeroSection, WaysToHelpSection, NeedsChallengesSection, CallToAction } from './index';
import { SEO } from '@/components/SEO';

export default function GetInvolvedPage() {
  return (
    <div className="w-full">
      <SEO
        title="Get Involved"
        description="Support Jambo Rafiki through donations, volunteering, prayer, partnerships, and sponsorship opportunities."
        path="/get-involved"
      />
      <HeroSection />
      <WaysToHelpSection />
      <NeedsChallengesSection />
      <CallToAction />
    </div>
  );
}
