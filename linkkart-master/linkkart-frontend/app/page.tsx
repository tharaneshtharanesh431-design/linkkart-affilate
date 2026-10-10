import { Navbar } from '@/components/landing-redesign/Navbar';
import { HeroSection } from '@/components/landing-redesign/HeroSection';
import { ProblemSection } from '@/components/landing-redesign/ProblemSection';
import { SolutionSection } from '@/components/landing-redesign/SolutionSection';
import { FeatureGrid } from '@/components/landing-redesign/FeatureGrid';
import { Showcases } from '@/components/landing-redesign/Showcases';
import { AffiliateExperience } from '@/components/landing-redesign/AffiliateExperience';
import { 
  HowItWorks, 
  BenefitsSection, 
  SecuritySection, 
  FAQSection, 
  FinalCTA, 
  Footer 
} from '@/components/landing-redesign/BottomSections';
import { SectionAnimator } from '@/components/page-animator';

export default function Home() {
  return (
    <div className="min-h-screen relative bg-[var(--page-bg)] selection:bg-[var(--primary-brand)] selection:text-white">
      {/* Live Breathing Background Elements */}
      <div className="absolute top-0 left-0 right-0 h-[1000px] overflow-hidden -z-20 pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[800px] h-[800px] bg-sky-200/40 rounded-full blur-[140px] animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute top-[10%] -right-[10%] w-[600px] h-[600px] bg-sky-100/40 rounded-full blur-[140px] animate-pulse" style={{ animationDuration: '12s', animationDelay: '2s' }} />
      </div>

      <Navbar />
      
      <main className="relative z-10 w-full">
        <HeroSection />
        
        <SectionAnimator delay={0.1}>
          <ProblemSection />
        </SectionAnimator>
        
        <SectionAnimator delay={0.1}>
          <SolutionSection />
        </SectionAnimator>
        
        <SectionAnimator delay={0.1}>
          <FeatureGrid />
        </SectionAnimator>
        
        <SectionAnimator delay={0.1}>
          <Showcases />
        </SectionAnimator>
        
        <SectionAnimator delay={0.1}>
          <AffiliateExperience />
        </SectionAnimator>
        
        <SectionAnimator delay={0.1}>
          <HowItWorks />
        </SectionAnimator>
        
        <SectionAnimator delay={0.1}>
          <BenefitsSection />
        </SectionAnimator>
        
        <SectionAnimator delay={0.1}>
          <SecuritySection />
        </SectionAnimator>
        
        <SectionAnimator delay={0.1}>
          <FAQSection />
        </SectionAnimator>
        
        <SectionAnimator delay={0.1}>
          <FinalCTA />
        </SectionAnimator>
      </main>
      
      <Footer />
    </div>
  );
}
