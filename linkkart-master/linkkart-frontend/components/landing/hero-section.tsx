'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { StaggerContainer, StaggerItem, FloatingElement } from '@/components/page-animator';

function useCountUp(target: number, duration: number = 2000, start: boolean = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
}

const stats = [
  { label: 'Active Affiliates', display: (n: number) => `${Math.floor(n / 1000)}K+`, target: 50000 },
  { label: 'Partner Brands', display: (n: number) => `${Math.floor(n / 1000)}K+`, target: 10000 },
  { label: 'Revenue Generated', display: (n: number) => `$${n}M+`, target: 100 },
  { label: 'Countries', display: (n: number) => `${n}+`, target: 120 },
];

export default function HeroSection() {
  const [animated, setAnimated] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"]
  });

  const counts = [
    useCountUp(50000, 2000, animated),
    useCountUp(10000, 2000, animated),
    useCountUp(100, 2000, animated),
    useCountUp(120, 2000, animated),
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setAnimated(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="relative overflow-hidden" ref={sectionRef}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24 relative z-10 text-center">
        
        <StaggerContainer>
          <StaggerItem>
            <div className="inline-flex items-center justify-center gap-2 bg-white rounded-full px-5 py-2 mb-8 shadow-sm border border-purple-100">
              <span className="w-2 h-2 rounded-full bg-violet-600 animate-pulse" />
              <span className="text-sm font-semibold text-violet-900 tracking-wide">Trusted by 50,000+ affiliates worldwide</span>
            </div>
          </StaggerItem>

          <StaggerItem>
            <h1 className="text-5xl lg:text-7xl font-extrabold text-indigo-950 leading-[1.15] mb-6 tracking-tight mx-auto max-w-4xl">
              Grow your business through <span className="text-violet-600">smart affiliate</span> partnerships
            </h1>
          </StaggerItem>

          <StaggerItem>
            <p className="text-xl text-slate-600 leading-relaxed mb-10 max-w-2xl mx-auto font-medium">
              Linkkart connects creators and brands. Track every click, earn on every sale, and scale your income with tools built for serious marketers.
            </p>
          </StaggerItem>

          <StaggerItem>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-14">
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-violet-600 text-white font-bold rounded-full hover:bg-violet-700 transition-all shadow-lg hover:shadow-violet-500/30 transform hover:-translate-y-1 text-base w-full sm:w-auto"
              >
                Start for free
                <ArrowRight size={18} />
              </Link>
              <Link
                href="/marketplace"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-violet-200 text-violet-900 font-bold rounded-full hover:bg-violet-50 transition-all text-base hover:border-violet-300 w-full sm:w-auto bg-white/50 backdrop-blur-sm"
              >
                Browse marketplace
              </Link>
            </div>
          </StaggerItem>
          
          <StaggerItem>
            <div className="flex justify-center items-center gap-6 text-sm font-semibold text-violet-800/70">
              <span className="flex items-center gap-1.5"><CheckCircle2 size={16} className="text-violet-500"/> No credit card required</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 size={16} className="text-violet-500"/> Free forever plan</span>
            </div>
          </StaggerItem>
        </StaggerContainer>

        {/* Stats Row */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-28 grid grid-cols-2 lg:grid-cols-4 gap-8 relative z-10 bg-white/60 backdrop-blur-xl rounded-3xl p-10 shadow-xl border border-white/80"
        >
          {stats.map((stat, i) => (
            <div key={stat.label}>
              <div className="text-4xl font-extrabold text-indigo-950 mb-2">{stat.display(counts[i])}</div>
              <div className="text-sm font-bold text-violet-600 uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
