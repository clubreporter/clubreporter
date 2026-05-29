import { useEffect } from 'react';
import MarketingNav from '@/components/marketing/MarketingNav';
import MarketingFooter from '@/components/marketing/MarketingFooter';
import HeroSection from '@/components/marketing/home/HeroSection';
import SportSelection from '@/components/marketing/home/SportSelection';
import ProblemSolution from '@/components/marketing/home/ProblemSolution';
import FeaturesSection from '@/components/marketing/home/FeaturesSection';
import TrustAccounts from '@/components/marketing/home/TrustAccounts';
import SampleReport from '@/components/marketing/home/SampleReport';
import PricingPreview from '@/components/marketing/home/PricingPreview';
import FinalCTA from '@/components/marketing/home/FinalCTA';
import { PAGE_TITLE } from '@/lib/homeLandingData';

export default function Landing() {
  useEffect(() => {
    document.title = PAGE_TITLE;
    return () => {
      document.title = PAGE_TITLE;
    };
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans text-gray-600 antialiased">
      <MarketingNav />
      <main>
        <HeroSection />
        <SportSelection />
        <ProblemSolution />
        <FeaturesSection />
        <TrustAccounts />
        <SampleReport />
        <PricingPreview />
        <FinalCTA />
      </main>
      <MarketingFooter />
    </div>
  );
}
