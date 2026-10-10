import Link from 'next/link';
import { ArrowRight, Link2, QrCode, BarChart3, Zap, Target, TrendingUp, Bell, Award } from 'lucide-react';

const features = [
  { icon: Link2, title: 'Smart Link Generator', desc: 'Create branded short links, deep links, and tracking URLs in seconds. Customize UTM parameters automatically.' },
  { icon: QrCode, title: 'QR Code Generator', desc: 'Generate dynamic QR codes for any product — perfect for offline promotions, events, and print.' },
  { icon: BarChart3, title: 'Real-Time Analytics', desc: 'Clicks, conversions, and earnings in real-time. Filter by date, product, campaign, or traffic source.' },
  { icon: Zap, title: 'AI Recommendations', desc: 'Our AI analyzes your audience and surfaces products with the highest conversion potential for your niche.' },
  { icon: Target, title: 'Campaign Management', desc: 'Create, launch, and optimize campaigns with A/B testing, scheduling, and budget controls.' },
  { icon: TrendingUp, title: 'Performance Tracking', desc: 'Revenue, ROAS, conversion rates, EPC, and custom KPI dashboards — every metric that matters.' },
  { icon: Bell, title: 'Smart Notifications', desc: 'Real-time alerts for milestone earnings, new brand offers, commission changes, and payment updates.' },
  { icon: Award, title: 'Leaderboard & Badges', desc: 'Earn achievement badges, unlock exclusive perks, and climb to higher commission tiers.' },
];

const steps = [
  { step: '01', title: 'Create your account', desc: 'Sign up free in under 2 minutes. No credit card required.' },
  { step: '02', title: 'Browse & apply', desc: 'Find brands and products that match your audience.' },
  { step: '03', title: 'Generate your link', desc: 'Get unique tracking links and QR codes instantly.' },
  { step: '04', title: 'Earn & scale', desc: 'Share, track performance, and watch commissions grow.' },
];

export default function FeaturesSection() {
  return (
    <>
      {/* Features */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl mb-14">
            <p className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-4">Platform Features</p>
            <h2 className="text-4xl font-bold text-gray-900 mb-5 leading-tight">
              Built for the modern affiliate marketer
            </h2>
            <p className="text-lg text-gray-500">
              Every tool you need to build, track, and scale your affiliate business — all in one place.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
            {features.map((feature) => (
              <div key={feature.title} className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-md hover:-translate-y-0.5 transition-all">
                <div className="w-9 h-9 bg-gray-50 rounded-xl flex items-center justify-center mb-5">
                  <feature.icon size={17} className="text-gray-600" />
                </div>
                <h3 className="text-sm font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>

          <Link href="/features" className="inline-flex items-center gap-2 text-sm text-gray-600 font-medium hover:text-gray-900 transition-colors">
            See all features <ArrowRight size={15} />
          </Link>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-16">
            <p className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-4">How It Works</p>
            <h2 className="text-4xl font-bold text-gray-900">Start earning in 4 steps</h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <div key={step.step} className="relative">
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-6 left-full w-full h-px bg-gray-100 -translate-x-4 z-0" />
                )}
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-2xl bg-gray-900 text-white flex items-center justify-center text-sm font-bold mb-5">
                    {step.step}
                  </div>
                  <h3 className="text-base font-bold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
