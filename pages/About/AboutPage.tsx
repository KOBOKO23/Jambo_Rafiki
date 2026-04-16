import {
  HeroSection,
  DirectorSection,
  StorySection,
  VisionMissionSection,
  ObjectivesList,
  ValuesSection,
  StatusPlansSection
} from "./";
import { SEO } from '@/components/SEO';

export default function AboutPage() {
  return (
    <div className="w-full">
      <SEO
        title="About"
        description="Learn about Jambo Rafiki, its leadership, values, story, and plans to support orphaned and vulnerable children in Kenya."
        path="/about"
      />
      <HeroSection />
      <DirectorSection />
      <StorySection />
      <VisionMissionSection />
      <ObjectivesList />
      <ValuesSection />
      <StatusPlansSection />
    </div>
  );
}
