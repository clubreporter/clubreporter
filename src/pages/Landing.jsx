import MarketingNav from '@/components/marketing/MarketingNav';
import MarketingFooter from '@/components/marketing/MarketingFooter';
import HeroSection from '@/components/marketing/home/HeroSection';
import SportSelection from '@/components/marketing/home/SportSelection';
import BenefitsSection from '@/components/marketing/home/BenefitsSection';
import HowItWorks from '@/components/marketing/home/HowItWorks';
import FeatureShowcase from '@/components/marketing/home/FeatureShowcase';
import PricingSection from '@/components/marketing/home/PricingSection';
import FinalCTA from '@/components/marketing/home/FinalCTA';

export default function Landing() {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-600 antialiased">
      <MarketingNav />
      <HeroSection />
      <SportSelection />
      <BenefitsSection />
      <HowItWorks />
      <FeatureShowcase />
      <PricingSection />
      <FinalCTA />
      <MarketingFooter />
    </div>
  );
}
