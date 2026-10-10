'use client';
import { motion } from 'framer-motion';
import { Users, Activity, Globe, Link as LinkIcon, Zap, BarChart3, Shield } from 'lucide-react';
import { StaggerContainer, StaggerItem } from '@/components/page-animator';

export function ProblemSection() {
  const problems = [
    {
      icon: <LinkIcon size={24} />,
      title: 'Scattered Workflows',
      desc: 'Managing affiliates through endless email threads and random spreadsheets is inefficient.',
      color: 'text-primary-brand',
      bg: 'bg-surface-lavender',
    },
    {
      icon: <Users size={24} />,
      title: 'Hard-to-Find Partners',
      desc: 'Finding quality affiliates that actually match your brand audience takes months.',
      color: 'text-accent-sky',
      bg: 'bg-accent-sky/10',
    },
    {
      icon: <BarChart3 size={24} />,
      title: 'Limited Visibility',
      desc: 'Blind spots in performance data make it impossible to know which campaigns truly work.',
      color: 'text-accent-blue',
      bg: 'bg-accent-blue/10',
    },
    {
      icon: <Zap size={24} />,
      title: 'Manual Tracking',
      desc: 'Tracking clicks and manually attributing sales creates errors and frustrated partners.',
      color: 'text-accent-coral',
      bg: 'bg-accent-coral/10',
    }
  ];

  return (
    <section className="py-24 bg-white relative">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Trust Strip */}
        <div className="mb-32">
          <p className="text-[18px] font-[600] text-text-muted mb-8 text-center">
            Everything you need to build and scale partnership-driven growth.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="flex items-center gap-4 bg-surface rounded-[16px] p-4 border border-border-light shadow-sm">
              <div className="w-12 h-12 rounded-full bg-surface-lavender text-secondary-purple flex items-center justify-center">
                <Shield size={24} />
              </div>
              <div className="font-[700] text-[18px] text-text-heading">Secure Access</div>
            </div>
            <div className="flex items-center gap-4 bg-surface rounded-[16px] p-4 border border-border-light shadow-sm">
              <div className="w-12 h-12 rounded-full bg-surface-lavender text-secondary-purple flex items-center justify-center">
                <Activity size={24} />
              </div>
              <div className="font-[700] text-[18px] text-text-heading">Smart Tracking</div>
            </div>
            <div className="flex items-center gap-4 bg-surface rounded-[16px] p-4 border border-border-light shadow-sm">
              <div className="w-12 h-12 rounded-full bg-surface-lavender text-secondary-purple flex items-center justify-center">
                <Globe size={24} />
              </div>
              <div className="font-[700] text-[18px] text-text-heading">Partner Growth</div>
            </div>
          </div>
        </div>

        {/* Problem Introduction */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-[42px] md:text-[52px] font-[800] text-text-heading leading-[1.1] tracking-tight mb-6">
            Partnership Growth Shouldn't Feel Complicated.
          </h2>
          <p className="text-[18px] font-[500] text-text-body leading-[1.65]">
            Many businesses struggle to scale their affiliate channels because the tools are disconnected, complex, or too manual.
          </p>
        </div>

        {/* Problem Cards */}
        <StaggerContainer>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {problems.map((prob, i) => (
              <StaggerItem key={i}>
                <motion.div 
                  className="bg-white rounded-[20px] p-8 border border-border-light card-shadow-sm hover-lift h-full"
                >
                  <div className={`w-14 h-14 rounded-[14px] ${prob.bg} ${prob.color} flex items-center justify-center mb-6`}>
                    {prob.icon}
                  </div>
                  <h3 className="text-[20px] font-[700] text-text-heading mb-3">{prob.title}</h3>
                  <p className="text-[15px] font-[500] text-text-body leading-[1.6]">{prob.desc}</p>
                </motion.div>
              </StaggerItem>
            ))}
          </div>
        </StaggerContainer>

      </div>
    </section>
  );
}
