// HomePage.jsx
import { Suspense, lazy } from 'react';
import HeroSection from './HeroSection';
import StatsSection from './StatsSection';
import VisionMissionSection from './VisionMissionSection';
import ProgramsSection from './ProgramsSection';
import CallToAction from './CallToAction';
import { SEO } from '@/components/SEO';

const StoriesOfHopeSection = lazy(() => import('./StoriesOfHopeSection'));
const RecentActivitiesSection = lazy(() => import('./RecentActivitiesSection'));
const TestimonialsSection = lazy(() => import('./TestimonialsSection'));

function SectionFallback() {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-6 w-48 bg-gray-200 rounded animate-pulse mb-4" />
        <div className="h-4 w-full max-w-2xl bg-gray-100 rounded animate-pulse" />
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <div className="w-full">
      <SEO
        title="Home"
        description="Jambo Rafiki Children Orphanage and Church Centre in Oyugis, Kenya. Building resilience and restoring hope for orphaned and vulnerable children."
        path="/"
      />
      <HeroSection />
      <StatsSection />
      <Suspense fallback={<SectionFallback />}>
        <StoriesOfHopeSection />
      </Suspense>
      <VisionMissionSection />
      <ProgramsSection />
      <Suspense fallback={<SectionFallback />}>
        <RecentActivitiesSection />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <TestimonialsSection />
      </Suspense>
      <CallToAction />
    </div>
  );
}
