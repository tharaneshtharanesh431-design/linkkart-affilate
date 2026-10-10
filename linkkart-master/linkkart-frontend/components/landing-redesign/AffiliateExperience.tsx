'use client';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

export function AffiliateExperience() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-[42px] md:text-[52px] font-[800] text-text-heading leading-[1.1] tracking-tight mb-6">
            Built for Affiliates, Too.
          </h2>
          <p className="text-[18px] font-[500] text-text-body leading-[1.65]">
            LinkKart is a two-sided platform. While businesses manage campaigns, affiliates get powerful tools to find products, track their performance, and maximize their earnings.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Business Column */}
          <div className="bg-surface-section rounded-[32px] p-10 border border-border-light hover-lift">
            <div className="w-16 h-16 rounded-[16px] bg-white flex items-center justify-center text-primary-brand text-[28px] font-bold mb-6 card-shadow-sm border border-border-light">
              🏢
            </div>
            <h3 className="text-[28px] font-[800] text-text-heading mb-6">For Businesses</h3>
            <ul className="space-y-4">
              {['Create campaigns', 'Manage products', 'Discover affiliates', 'Track conversions', 'Manage partnerships'].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-[16px] font-[600] text-text-body">
                  <CheckCircle2 size={20} className="text-primary-brand" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Affiliate Column */}
          <div className="bg-primary-brand rounded-[32px] p-10 card-shadow-lg hover-lift">
            <div className="w-16 h-16 rounded-[16px] bg-white/20 flex items-center justify-center text-white text-[28px] font-bold mb-6 border border-white/10 backdrop-blur-sm">
              🚀
            </div>
            <h3 className="text-[28px] font-[800] text-white mb-6">For Affiliates</h3>
            <ul className="space-y-4">
              {['Build a professional profile', 'Discover campaigns', 'Apply to campaigns', 'Generate tracking links', 'Track performance'].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-[16px] font-[600] text-white/90">
                  <CheckCircle2 size={20} className="text-surface-light-purple" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
