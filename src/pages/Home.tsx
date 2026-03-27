import { HeroSection } from '../components/home/HeroSection';
import { ProblemSection } from '../components/home/ProblemSection';
import { SolutionSection } from '../components/home/SolutionSection';
import { HowItWorksSection } from '../components/home/HowItWorksSection';
import { FeaturesSection } from '../components/home/FeaturesSection';
import { DashboardPreview } from '../components/home/DashboardPreview';
import { ComparisonTable } from '../components/home/ComparisonTable';
import { ImpactStats } from '../components/home/ImpactStats';
import { FinalCTA } from '../components/home/FinalCTA';

export function Home() {
  return (
    <>
      <HeroSection />
      <HowItWorksSection />
      <ProblemSection />
      <SolutionSection />
      <FeaturesSection />
      <DashboardPreview />
      <ComparisonTable />
      <ImpactStats />
      <FinalCTA />
    </>
  );
}
