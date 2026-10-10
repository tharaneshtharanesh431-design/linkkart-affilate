'use client';
import { ArrowRight, Activity, Users, Target } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export function HeroSection() {
  return (
    <section className="relative pt-[200px] pb-[100px] overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 hero-gradient -z-10" />

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="text-[52px] md:text-[64px] lg:text-[76px] font-[800] leading-[1.05] tracking-tight text-text-heading mb-6"
          >
            Build Better Partnerships.<br />
            Grow Beyond Your Reach.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
            className="text-[17px] md:text-[19px] font-[400] text-text-body leading-[1.65] max-w-[720px] mx-auto mb-10"
          >
            LinkKart brings businesses and affiliates together in one platform to launch campaigns, manage partnerships, track performance, and turn collaboration into measurable growth.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="/register"
              className="btn-primary flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              Get Started Free <ArrowRight size={18} />
            </Link>
            <Link
              href="#platform"
              className="btn-secondary flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              Explore Platform
            </Link>
          </motion.div>
        </div>

        {/* Product Visual Mockup */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
          className="relative max-w-5xl mx-auto mt-16"
        >
          {/* Main Dashboard Mockup */}
          <div className="bg-surface rounded-[28px] border border-border-light card-shadow-lg overflow-hidden">
            <div className="h-12 border-b border-border-light bg-[#FAFAFA] flex items-center px-4 gap-2">
              <div className="w-3 h-3 rounded-full bg-[#E5E5E5]" />
              <div className="w-3 h-3 rounded-full bg-[#E5E5E5]" />
              <div className="w-3 h-3 rounded-full bg-[#E5E5E5]" />
            </div>
            <div className="p-8 bg-page">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-[22px] font-[700] text-text-heading">Overview</h3>
                  <p className="text-[14px] text-text-body">Your partnership performance for the last 30 days.</p>
                </div>
                <div className="px-4 py-2 bg-white rounded-lg border border-border-light text-[14px] font-[600] text-text-heading shadow-sm">
                  Last 30 Days ▾
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-[20px] border border-border-light card-shadow-sm">
                  <p className="text-[14px] font-[600] text-text-body mb-2">Revenue Generated</p>
                  <p className="text-[32px] font-[800] text-text-heading">₹48,240</p>
                  <p className="text-[13px] font-[600] text-accent-green mt-2 flex items-center gap-1">↑ 12.5% vs last month</p>
                </div>
                <div className="bg-white p-6 rounded-[20px] border border-border-light card-shadow-sm">
                  <p className="text-[14px] font-[600] text-text-body mb-2">Active Campaigns</p>
                  <p className="text-[32px] font-[800] text-text-heading">24</p>
                  <p className="text-[13px] font-[600] text-accent-blue mt-2 flex items-center gap-1">↑ 3 new campaigns</p>
                </div>
                <div className="bg-white p-6 rounded-[20px] border border-border-light card-shadow-sm">
                  <p className="text-[14px] font-[600] text-text-body mb-2">Partner Affiliates</p>
                  <p className="text-[32px] font-[800] text-text-heading">186</p>
                  <p className="text-[13px] font-[600] text-accent-green mt-2 flex items-center gap-1">↑ 42 joined this week</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 bg-white p-6 rounded-[20px] border border-border-light card-shadow-sm h-[240px] flex flex-col justify-between">
                  <div className="flex justify-between items-center mb-4">
                    <p className="text-[16px] font-[700] text-text-heading">Conversion Trend</p>
                    <p className="text-[14px] font-[600] text-text-body">Conversions: <span className="text-text-heading">842</span> <span className="text-accent-green">(6.8% rate)</span></p>
                  </div>
                  <div className="w-full flex items-end gap-2 h-[140px] border-b border-border-light pb-2">
                    {[40, 60, 45, 80, 55, 90, 75, 110, 85, 120, 100, 140, 110, 130].map((h, i) => (
                      <div key={i} className="flex-1 bg-secondary-purple rounded-t-md opacity-80 hover:opacity-100 transition-opacity" style={{ height: `${(h/140)*100}%` }} />
                    ))}
                  </div>
                </div>
                <div className="bg-white p-6 rounded-[20px] border border-border-light card-shadow-sm h-[240px] flex flex-col">
                  <p className="text-[16px] font-[700] text-text-heading mb-4">Top Campaigns</p>
                  <div className="flex flex-col gap-4 flex-1 justify-center">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-accent-blue/10 flex items-center justify-center text-accent-blue text-[12px] font-bold">Q3</div>
                        <p className="text-[14px] font-[600] text-text-heading">Summer Promo</p>
                      </div>
                      <p className="text-[14px] font-[700] text-text-heading">₹12.4K</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-accent-sky/10 flex items-center justify-center text-accent-sky text-[12px] font-bold">BF</div>
                        <p className="text-[14px] font-[600] text-text-heading">Black Friday</p>
                      </div>
                      <p className="text-[14px] font-[700] text-text-heading">₹8.9K</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-accent-green/10 flex items-center justify-center text-accent-green text-[12px] font-bold">NW</div>
                        <p className="text-[14px] font-[600] text-text-heading">New Product</p>
                      </div>
                      <p className="text-[14px] font-[700] text-text-heading">₹5.2K</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Floating Elements */}
          <motion.div 
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -left-10 top-20 bg-white p-4 rounded-[16px] card-shadow-md border border-border-light flex items-center gap-4 hidden md:flex"
          >
            <div className="w-12 h-12 rounded-full bg-surface-lavender flex items-center justify-center text-primary-brand">
              <Users size={24} />
            </div>
            <div>
              <p className="text-[18px] font-[800] text-text-heading">186</p>
              <p className="text-[14px] font-[500] text-text-body">Active Affiliates</p>
            </div>
          </motion.div>

          <motion.div 
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute -right-8 top-40 bg-white p-4 rounded-[16px] card-shadow-md border border-border-light flex items-center gap-4 hidden md:flex"
          >
            <div className="w-12 h-12 rounded-full bg-accent-green/10 flex items-center justify-center text-accent-green">
              <Activity size={24} />
            </div>
            <div>
              <p className="text-[18px] font-[800] text-text-heading">+24.8%</p>
              <p className="text-[14px] font-[500] text-text-body">Growth this month</p>
            </div>
          </motion.div>

          <motion.div 
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute -bottom-6 left-1/4 bg-white p-4 rounded-[16px] card-shadow-md border border-border-light flex items-center gap-4 hidden md:flex"
          >
            <div className="w-12 h-12 rounded-full bg-surface-light-purple flex items-center justify-center text-secondary-purple">
              <Target size={24} />
            </div>
            <div>
              <p className="text-[18px] font-[800] text-text-heading">428</p>
              <p className="text-[14px] font-[500] text-text-body">Conversions Today</p>
            </div>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
}
