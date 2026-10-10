'use client';
import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ArrowRight } from 'lucide-react';
import { StaggerContainer, StaggerItem, FloatingElement } from '@/components/page-animator';

export function HowItWorks() {
  const steps = [
    { num: '01', title: 'Create', desc: 'Create your organization, products, and campaigns.' },
    { num: '02', title: 'Connect', desc: 'Discover and connect with relevant affiliates.' },
    { num: '03', title: 'Launch', desc: 'Start your partnership campaigns.' },
    { num: '04', title: 'Track', desc: 'Track clicks, attribution, and conversions.' },
    { num: '05', title: 'Grow', desc: 'Use performance data to build stronger partnerships.' }
  ];

  return (
    <section className="py-24 bg-surface-lavender relative" id="how-it-works">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-[42px] md:text-[52px] font-[800] text-text-heading leading-[1.1] tracking-tight mb-6">
            From Partnership to Performance.
          </h2>
          <p className="text-[18px] font-[500] text-text-body leading-[1.65]">
            A simple, connected workflow to get your affiliate program running smoothly.
          </p>
        </div>

        <div className="relative">
          {/* Dotted Line (desktop) */}
          <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-[2px] border-t-2 border-dashed border-border-strong" />
          
          <StaggerContainer delay={0.2}>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
              {steps.map((step, i) => (
                <StaggerItem key={i}>
                  <div className="relative z-10 flex flex-col items-center text-center h-full">
                    <div className="w-24 h-24 rounded-full bg-white border-2 border-border-strong card-shadow-sm flex items-center justify-center text-[28px] font-[800] text-primary-brand mb-6 relative">
                      {step.num}
                      <div className="absolute inset-0 rounded-full border border-white" />
                    </div>
                    <h3 className="text-[20px] font-[700] text-text-heading mb-3">{step.title}</h3>
                    <p className="text-[14px] font-[500] text-text-body leading-[1.6]">{step.desc}</p>
                  </div>
                </StaggerItem>
              ))}
            </div>
          </StaggerContainer>
        </div>
      </div>
    </section>
  );
}

export function BenefitsSection() {
  return (
    <section className="py-24 bg-surface-section border-y border-border-light relative" id="solutions">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-[42px] md:text-[52px] font-[800] text-text-heading leading-[1.1] tracking-tight mb-6">
            Built to Make Partnership Growth Simpler.
          </h2>
        </div>

        <StaggerContainer delay={0.2}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StaggerItem>
              <div className="bg-white rounded-[28px] p-10 border border-border-light card-shadow-sm hover-lift h-full">
                <div className="w-14 h-14 rounded-full bg-accent-yellow/20 flex items-center justify-center text-accent-yellow mb-6 text-[24px]">📈</div>
                <h3 className="text-[22px] font-[700] text-text-heading mb-4">For Growing Businesses</h3>
                <p className="text-[15px] font-[500] text-text-body leading-[1.65] mb-8">Discover partners, launch campaigns, and manage your partnership network.</p>
                <ul className="space-y-4">
                  <li className="flex items-center gap-3 text-[15px] font-[600] text-text-heading"><span className="text-primary-brand font-bold">✓</span> Centralized dashboard</li>
                  <li className="flex items-center gap-3 text-[15px] font-[600] text-text-heading"><span className="text-primary-brand font-bold">✓</span> Easy campaign setup</li>
                  <li className="flex items-center gap-3 text-[15px] font-[600] text-text-heading"><span className="text-primary-brand font-bold">✓</span> Partner discovery</li>
                </ul>
              </div>
            </StaggerItem>

            <StaggerItem>
              <div className="bg-white rounded-[28px] p-10 border border-border-light card-shadow-sm hover-lift h-full">
                <div className="w-14 h-14 rounded-full bg-accent-sky/20 flex items-center justify-center text-accent-sky mb-6 text-[24px]">🤝</div>
                <h3 className="text-[22px] font-[700] text-text-heading mb-4">Designed for Collaboration</h3>
                <p className="text-[15px] font-[500] text-text-body leading-[1.65] mb-8">Keep businesses and affiliates connected through structured workflows.</p>
                <ul className="space-y-4">
                  <li className="flex items-center gap-3 text-[15px] font-[600] text-text-heading"><span className="text-primary-brand font-bold">✓</span> Unified communication</li>
                  <li className="flex items-center gap-3 text-[15px] font-[600] text-text-heading"><span className="text-primary-brand font-bold">✓</span> Shared resources</li>
                  <li className="flex items-center gap-3 text-[15px] font-[600] text-text-heading"><span className="text-primary-brand font-bold">✓</span> Clear expectations</li>
                </ul>
              </div>
            </StaggerItem>

            <StaggerItem>
              <div className="bg-white rounded-[28px] p-10 border border-border-light card-shadow-sm hover-lift h-full">
                <div className="w-14 h-14 rounded-full bg-accent-blue/20 flex items-center justify-center text-accent-blue mb-6 text-[24px]">📊</div>
                <h3 className="text-[22px] font-[700] text-text-heading mb-4">Built Around Performance</h3>
                <p className="text-[15px] font-[500] text-text-body leading-[1.65] mb-8">Track activity and understand which partnerships are driving results.</p>
                <ul className="space-y-4">
                  <li className="flex items-center gap-3 text-[15px] font-[600] text-text-heading"><span className="text-primary-brand font-bold">✓</span> Real-time analytics</li>
                  <li className="flex items-center gap-3 text-[15px] font-[600] text-text-heading"><span className="text-primary-brand font-bold">✓</span> Accurate attribution</li>
                  <li className="flex items-center gap-3 text-[15px] font-[600] text-text-heading"><span className="text-primary-brand font-bold">✓</span> Transparent reporting</li>
                </ul>
              </div>
            </StaggerItem>
          </div>
        </StaggerContainer>
      </div>
    </section>
  );
}

export function SecuritySection() {
  return (
    <section className="py-24 bg-white relative">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-[32px] md:text-[42px] font-[800] text-text-heading leading-[1.1] tracking-tight mb-16">
          Built With Security at the Core.
        </h2>
        <StaggerContainer delay={0.2}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <StaggerItem>
              <div className="flex flex-col items-center">
                <FloatingElement delay={0}>
                  <div className="w-20 h-20 bg-surface-lavender rounded-[16px] flex items-center justify-center mb-6 text-primary-brand text-[28px] card-shadow-sm border border-border-light">🔒</div>
                </FloatingElement>
                <p className="text-[16px] font-[700] text-text-heading">Secure Authentication</p>
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="flex flex-col items-center">
                <FloatingElement delay={0.5}>
                  <div className="w-20 h-20 bg-surface-lavender rounded-[16px] flex items-center justify-center mb-6 text-primary-brand text-[28px] card-shadow-sm border border-border-light">🏢</div>
                </FloatingElement>
                <p className="text-[16px] font-[700] text-text-heading">Organization Isolation</p>
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="flex flex-col items-center">
                <FloatingElement delay={1}>
                  <div className="w-20 h-20 bg-surface-lavender rounded-[16px] flex items-center justify-center mb-6 text-primary-brand text-[28px] card-shadow-sm border border-border-light">🛡️</div>
                </FloatingElement>
                <p className="text-[16px] font-[700] text-text-heading">Role-Based Access</p>
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="flex flex-col items-center">
                <FloatingElement delay={1.5}>
                  <div className="w-20 h-20 bg-surface-lavender rounded-[16px] flex items-center justify-center mb-6 text-primary-brand text-[28px] card-shadow-sm border border-border-light">🔐</div>
                </FloatingElement>
                <p className="text-[16px] font-[700] text-text-heading">Protected Resources</p>
              </div>
            </StaggerItem>
          </div>
        </StaggerContainer>
      </div>
    </section>
  );
}

export function FAQSection() {
  const faqs = [
    { q: "What is LinkKart?", a: "LinkKart is a B2B platform that connects businesses with affiliates to run partnership campaigns, track conversions, and measure performance." },
    { q: "Who can use LinkKart?", a: "LinkKart is built for both businesses (looking to grow through affiliates) and affiliates (looking for products to promote)." },
    { q: "How are campaigns managed?", a: "Businesses can create campaigns, link specific products, set commissions, and invite affiliates directly through their dashboard." },
    { q: "Is LinkKart free to get started?", a: "Yes, you can register and explore the platform without any credit card required." }
  ];
  
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-24 bg-surface-lavender relative" id="resources">
      <div className="max-w-[800px] mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-[42px] font-[800] text-text-heading text-center mb-12">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white rounded-2xl border border-border-light overflow-hidden card-shadow-sm">
              <button 
                className="w-full px-6 py-6 text-left flex justify-between items-center focus:outline-none"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
              >
                <span className="text-[18px] font-[700] text-text-heading">{faq.q}</span>
                <ChevronDown className={`text-text-muted transition-transform ${openIndex === i ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 pt-0 text-[16px] font-[500] text-text-body leading-[1.65]">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FinalCTA() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 cta-gradient -z-10" />
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <h2 className="text-[42px] md:text-[56px] font-[800] text-text-heading leading-[1.1] tracking-tight mb-6 max-w-3xl mx-auto">
          Ready to Build Better Partnerships?
        </h2>
        <p className="text-[20px] font-[500] text-text-heading/80 leading-[1.65] max-w-2xl mx-auto mb-10">
          Bring your campaigns, affiliates, and partnership growth into one connected platform.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/register"
            className="h-[54px] px-10 flex items-center justify-center gap-2 text-[16px] font-[700] text-primary-hover bg-white rounded-full hover:bg-surface-lavender hover:-translate-y-1 transition-all shadow-[0_8px_20px_rgba(0,0,0,0.15)] w-full sm:w-auto"
          >
            Get Started Free <ArrowRight size={18} />
          </Link>
          <Link
            href="#platform"
            className="h-[54px] px-10 flex items-center justify-center text-[16px] font-[700] text-text-heading bg-transparent border border-text-heading/20 rounded-full hover:bg-white/10 hover:-translate-y-1 transition-all w-full sm:w-auto"
          >
            Explore LinkKart
          </Link>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="bg-[#291451] pt-20 pb-10">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-16">
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-xl bg-primary-brand flex items-center justify-center text-white font-bold text-lg">L</div>
              <span className="text-[1.25rem] font-[800] text-white">LinkKart</span>
            </Link>
            <p className="text-[15px] text-[#CFC3DF] font-[500] max-w-xs leading-[1.6]">
              The premium B2B affiliate and partnership SaaS platform for modern businesses.
            </p>
          </div>
          <div>
            <h4 className="font-[700] text-white mb-6">Platform</h4>
            <ul className="space-y-4">
              <li><Link href="#" className="text-[14px] text-[#CFC3DF] hover:text-[#D8B4FE] font-[500] transition-colors">Campaigns</Link></li>
              <li><Link href="#" className="text-[14px] text-[#CFC3DF] hover:text-[#D8B4FE] font-[500] transition-colors">Affiliates</Link></li>
              <li><Link href="#" className="text-[14px] text-[#CFC3DF] hover:text-[#D8B4FE] font-[500] transition-colors">Tracking</Link></li>
              <li><Link href="#" className="text-[14px] text-[#CFC3DF] hover:text-[#D8B4FE] font-[500] transition-colors">Performance</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-[700] text-white mb-6">Resources</h4>
            <ul className="space-y-4">
              <li><Link href="#" className="text-[14px] text-[#CFC3DF] hover:text-[#D8B4FE] font-[500] transition-colors">Documentation</Link></li>
              <li><Link href="#" className="text-[14px] text-[#CFC3DF] hover:text-[#D8B4FE] font-[500] transition-colors">Help</Link></li>
              <li><Link href="#" className="text-[14px] text-[#CFC3DF] hover:text-[#D8B4FE] font-[500] transition-colors">FAQ</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-[700] text-white mb-6">Company</h4>
            <ul className="space-y-4">
              <li><Link href="#" className="text-[14px] text-[#CFC3DF] hover:text-[#D8B4FE] font-[500] transition-colors">About</Link></li>
              <li><Link href="#" className="text-[14px] text-[#CFC3DF] hover:text-[#D8B4FE] font-[500] transition-colors">Privacy</Link></li>
              <li><Link href="#" className="text-[14px] text-[#CFC3DF] hover:text-[#D8B4FE] font-[500] transition-colors">Terms</Link></li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-white/10 text-center flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-[14px] text-[#CFC3DF] font-[500]">© 2026 LinkKart. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
