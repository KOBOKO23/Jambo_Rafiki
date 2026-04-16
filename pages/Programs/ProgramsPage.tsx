import HeroSection from './HeroSection';
import ProgramsGrid from './ProgramsGrid';
import CoreActivities from './CoreActivities';
import ProgramsInAction from './ProgramsInAction';
import CallToAction from './CallToAction';
import { SEO } from '@/components/SEO';

export default function ProgramsPage() {
  return (
    <div className="w-full">
      <SEO
        title="Programs"
        description="Explore the core ministry programs at Jambo Rafiki, including spiritual development, education, health, food security, and community outreach."
        path="/programs"
      />
      <HeroSection />
      <ProgramsGrid />
      <CoreActivities />
      <ProgramsInAction />
      <CallToAction />
    </div>
  );
}
