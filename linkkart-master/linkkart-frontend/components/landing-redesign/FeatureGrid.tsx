'use client';
import { LayoutDashboard, Users, Box, BarChart2, TrendingUp, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { StaggerContainer, StaggerItem } from '@/components/page-animator';

export function FeatureGrid() {
  const features = [
    {
      icon: <LayoutDashboard size={24} />,
      title: 'Campaign Management',
      desc: 'Set up campaigns, track budgets, and manage partner approvals all from a unified dashboard.',
      color: 'text-primary-brand',
      bg: 'bg-surface-lavender'
    },
    {
      icon: <Users size={24} />,
      title: 'Affiliate Discovery',
      desc: 'Find the perfect partners for your brand based on niche, location, and audience metrics.',
      color: 'text-accent-blue',
      bg: 'bg-accent-blue/10'
    },
    {
      icon: <Box size={24} />,
      title: 'Product Management',
      desc: 'Organize your products, set specific commission rates, and generate custom tracking links.',
      color: 'text-accent-sky',
      bg: 'bg-accent-sky/10'
    },
    {
      icon: <BarChart2 size={24} />,
      title: 'Tracking & Attribution',
      desc: 'Rely on precise cookie and pixel-based tracking to accurately attribute every sale.',
      color: 'text-accent-coral',
      bg: 'bg-accent-coral/10'
    },
    {
      icon: <TrendingUp size={24} />,
      title: 'Performance Insights',
      desc: 'Analyze clicks, conversions, and ROI with beautiful, easy-to-understand visual reports.',
      color: 'text-accent-green',
      bg: 'bg-accent-green/10'
    }
  ];

  return (
    <section className="py-24 bg-white relative">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-[42px] md:text-[52px] font-[800] text-text-heading leading-[1.1] tracking-tight mb-6">
            Everything You Need to Scale Partnerships.
          </h2>
          <p className="text-[18px] font-[500] text-text-body leading-[1.65]">
            A complete suite of tools designed to remove the friction from growing your affiliate network.
          </p>
        </div>

        <StaggerContainer delay={0.2}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <StaggerItem key={i}>
                <div 
                  className="bg-white rounded-[24px] p-8 border border-border-light card-shadow-sm hover-lift group h-full"
                >
                  <div className={`w-14 h-14 rounded-[14px] ${feature.bg} ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-[20px] font-[700] text-text-heading mb-3">{feature.title}</h3>
                  <p className="text-[15px] font-[500] text-text-body leading-[1.6] mb-6">{feature.desc}</p>
                  <div className="flex items-center text-[14px] font-[700] text-primary-brand group-hover:text-primary-hover">
                    Explore <ArrowRight size={16} className="ml-2 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </StaggerItem>
            ))}
            
            <StaggerItem>
              <div className="bg-surface-strong rounded-[24px] p-8 border border-border-strong card-shadow-sm hover-lift flex flex-col justify-center items-center text-center h-full">
                <h3 className="text-[24px] font-[800] text-text-heading mb-3">And much more...</h3>
                <p className="text-[15px] font-[500] text-text-heading/80 leading-[1.6] mb-8">Discover all the tools LinkKart provides for seamless partnership growth.</p>
                <button className="btn-secondary">
                  Explore All Features
                </button>
              </div>
            </StaggerItem>
          </div>
        </StaggerContainer>
      </div>
    </section>
  );
}
