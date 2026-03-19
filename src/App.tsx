
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ProblemSection } from './components/ProblemSection';
import { SolutionSection } from './components/SolutionSection';
import { HowItWorksSection } from './components/HowItWorksSection';
import { FeaturesSection } from './components/FeaturesSection';
import { DashboardPreview } from './components/DashboardPreview';
import { ComparisonTable } from './components/ComparisonTable';
import { ImpactStats } from './components/ImpactStats';
import { FinalCTA } from './components/FinalCTA';
import { Footer } from './components/Footer';

function App() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <HeroSection />
        <ProblemSection />
        <SolutionSection />
        <HowItWorksSection />
        <FeaturesSection />
        <DashboardPreview />
        <ComparisonTable />
        <ImpactStats />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}

export default App;
