'use client';
import { motion } from 'framer-motion';

export function SolutionSection() {
  return (
    <section className="py-24 bg-surface-section relative overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <div className="order-2 lg:order-1">
            <h2 className="text-[42px] md:text-[52px] font-[800] text-text-heading leading-[1.1] tracking-tight mb-6">
              One Platform for Your Entire Partnership Journey.
            </h2>
            <p className="text-[18px] font-[500] text-text-body leading-[1.65] mb-8">
              LinkKart brings your products, campaigns, affiliates, tracking, and performance workflows together in one connected platform. Stop jumping between tools and start growing.
            </p>
            <ul className="space-y-4">
              {[
                'Centralized merchant and affiliate hubs',
                'Seamless tracking link generation',
                'Automated conversion tracking',
                'Real-time performance analytics'
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-[16px] font-[600] text-text-heading">
                  <div className="w-6 h-6 rounded-full bg-primary-brand text-white flex items-center justify-center text-[12px]">✓</div>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="order-1 lg:order-2 relative">
            <div className="bg-surface rounded-[28px] border border-border-light card-shadow-lg overflow-hidden">
              <div className="h-12 border-b border-border-light bg-[#FAFAFA] flex items-center px-4 gap-2">
                <div className="w-3 h-3 rounded-full bg-[#E5E5E5]" />
                <div className="w-3 h-3 rounded-full bg-[#E5E5E5]" />
                <div className="w-3 h-3 rounded-full bg-[#E5E5E5]" />
              </div>
              <div className="p-6 bg-page">
                <div className="flex gap-4">
                  {/* Sidebar mockup */}
                  <div className="w-48 hidden sm:block bg-white rounded-xl border border-border-light p-4 h-[300px] card-shadow-sm">
                    <div className="h-6 bg-surface-lavender rounded-md w-3/4 mb-4" />
                    <div className="h-8 bg-surface-lavender rounded-md w-full mb-3 flex items-center px-2 border border-border-light">
                      <div className="w-4 h-4 rounded bg-primary-brand/20 mr-2" />
                      <div className="h-2 w-16 bg-primary-brand/40 rounded" />
                    </div>
                    <div className="h-8 bg-surface-soft rounded-md w-full mb-3 flex items-center px-2">
                      <div className="w-4 h-4 rounded bg-border-strong mr-2" />
                      <div className="h-2 w-16 bg-border-strong rounded" />
                    </div>
                    <div className="h-8 bg-surface-soft rounded-md w-full mb-3 flex items-center px-2">
                      <div className="w-4 h-4 rounded bg-border-strong mr-2" />
                      <div className="h-2 w-20 bg-border-strong rounded" />
                    </div>
                  </div>
                  {/* Main content mockup */}
                  <div className="flex-1">
                    <div className="bg-white p-6 rounded-xl border border-border-light mb-4 card-shadow-sm">
                      <h4 className="text-[16px] font-[700] text-text-heading mb-4">Active Campaign: Summer Launch</h4>
                      <div className="flex items-center gap-4 mb-6">
                        <div className="flex-1 h-3 bg-surface-section rounded-full overflow-hidden">
                          <div className="h-full bg-primary-brand w-3/4" />
                        </div>
                        <span className="text-[14px] font-[700] text-primary-brand">75% to goal</span>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-surface-section rounded-lg p-4 border border-border-light">
                          <p className="text-[12px] text-text-body font-[600] mb-1">Clicks</p>
                          <p className="text-[20px] font-[800] text-text-heading">12,450</p>
                        </div>
                        <div className="bg-surface-light-purple rounded-lg p-4 border border-border-strong">
                          <p className="text-[12px] text-primary-brand font-[600] mb-1">Conversions</p>
                          <p className="text-[20px] font-[800] text-primary-hover">842</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
