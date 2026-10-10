import Link from 'next/link';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import {
  Zap, BarChart3, Link2, QrCode, Target, TrendingUp,
  ArrowRight, Check, Users, ShoppingBag, Globe,
  Brain, LineChart, Layers, Bell, Shield, Clock,
} from 'lucide-react';

const aiFeatures = [
  { title: 'Audience Intelligence', desc: 'Our AI analyzes your content, audience demographics, and past performance to understand exactly what your followers respond to.' },
  { title: 'Smart Product Matching', desc: 'Products are matched to your niche using 200+ signals including conversion history, seasonal trends, and competitor data.' },
  { title: 'Auto-Optimization', desc: 'The system continuously learns which links perform best for your audience and adjusts recommendations automatically.' },
  { title: 'Trend Detection', desc: 'Spot trending products before they peak. Get notified when emerging products align with your niche.' },
];

const campaignFeatures = [
  { icon: Layers, title: 'Multi-Channel Campaigns', desc: 'Run campaigns across social, email, blog, and video from a single dashboard with unified reporting.' },
  { icon: Target, title: 'A/B Testing', desc: 'Test different link placements, copy, and creatives. Let data decide what works best for your audience.' },
  { icon: LineChart, title: 'Budget Controls', desc: 'Set spending caps, conversion targets, and auto-pause rules to keep campaigns on track.' },
  { icon: Bell, title: 'Automated Alerts', desc: 'Get notified when a campaign hits a milestone, underperforms, or needs attention.' },
  { icon: Clock, title: 'Scheduling', desc: 'Schedule campaigns to launch at optimal times based on your audience activity patterns.' },
  { icon: Shield, title: 'Fraud Prevention', desc: 'AI monitors every campaign click in real-time and automatically filters invalid traffic.' },
];

const platformFeatures = [
  { icon: Link2, title: 'Link Generator', desc: 'Create short, branded tracking links with custom slugs, UTM parameters, and expiry dates in seconds.' },
  { icon: QrCode, title: 'QR Code Generator', desc: 'Generate scannable QR codes for any affiliate link. Perfect for offline promotions and print materials.' },
  { icon: BarChart3, title: 'Real-Time Analytics', desc: 'Live dashboards showing every click, conversion, and commission as it happens.' },
  { icon: TrendingUp, title: 'Performance Tracking', desc: 'Revenue, ROAS, EPC, conversion rates, and 40+ custom KPI metrics in one view.' },
  { icon: Bell, title: 'Smart Notifications', desc: 'Instant alerts for commission earned, new brand offers, and payment confirmations.' },
  { icon: Shield, title: 'Fraud Detection', desc: 'AI-powered system that blocks bot traffic and click fraud automatically.' },
];

const affiliateBenefits = [
  'Access to 10,000+ verified products across 8 niches',
  'AI-matched product recommendations for your audience',
  'Instant link and QR code generation',
  'Real-time earnings dashboard and analytics',
  'Weekly, bi-weekly, or monthly payouts',
  'Achievement badges and leaderboard rankings',
  'Dedicated affiliate success manager',
  'Referral program — earn 5% from affiliates you refer',
];

const merchantBenefits = [
  'List unlimited products with custom commission structures',
  'Recruit and manage affiliates from one dashboard',
  'Real-time sales and affiliate performance reports',
  'Fraud detection protecting your ad spend',
  'Custom approval workflows for affiliate applications',
  'API access for direct platform integration',
  'Multi-currency and global payout support',
  'White-label options for enterprise clients',
];

const networkBenefits = [
  'Multi-advertiser campaign management at scale',
  'Custom commission tiers and override rules',
  'Consolidated billing and payout management',
  'Advanced fraud scoring and traffic quality tools',
  'White-label dashboard and custom domain',
  'API-first architecture for deep integration',
  'Dedicated account manager and SLA guarantees',
  'Enterprise-grade security and SOC 2 compliance',
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Platform & Solutions</p>
            <h1 className="text-5xl font-bold text-gray-900 leading-tight mb-6">
              Every tool you need to build, track, and scale your affiliate business
            </h1>
            <p className="text-xl text-gray-500 leading-relaxed mb-8">
              From AI-powered recommendations to enterprise campaign management — Linkkart is the complete affiliate marketing platform.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/register" className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors text-sm">
                Get started free <ArrowRight size={15} />
              </Link>
              <Link href="/marketplace" className="inline-flex items-center gap-2 px-6 py-3 border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors text-sm">
                Browse marketplace
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Features */}
      <section id="platform" className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl mb-14">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Core Platform</p>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Everything built in</h2>
            <p className="text-lg text-gray-500">No integrations needed. Every essential tool is included from day one.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {platformFeatures.map((f) => (
              <div key={f.title} className="border border-gray-100 rounded-2xl p-6 hover:shadow-md hover:-translate-y-0.5 transition-all">
                <div className="w-9 h-9 bg-gray-50 rounded-xl flex items-center justify-center mb-5">
                  <f.icon size={17} className="text-gray-600" />
                </div>
                <h3 className="text-sm font-bold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Recommendations */}
      <section id="ai" className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-950">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-6">
                <Brain size={14} className="text-blue-300" />
                <span className="text-sm font-semibold text-blue-300">AI Recommendations</span>
              </div>
              <h2 className="text-4xl font-bold text-white mb-5 leading-tight">
                Products that actually convert for your audience
              </h2>
              <p className="text-gray-400 text-lg leading-relaxed mb-8">
                Our machine learning engine doesn't just show popular products — it learns your specific audience and surfaces products with the highest probability of converting for your unique readers and followers.
              </p>
              <div className="space-y-4 mb-10">
                {aiFeatures.map((f) => (
                  <div key={f.title} className="flex gap-4">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 flex-shrink-0" />
                    <div>
                      <p className="text-white font-semibold text-sm mb-1">{f.title}</p>
                      <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/register" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-900 font-semibold rounded-xl hover:bg-gray-100 transition-colors text-sm">
                Try AI recommendations free <ArrowRight size={15} />
              </Link>
            </div>

            {/* AI preview card */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-5">
                <Zap size={16} className="text-blue-400" />
                <span className="text-sm font-semibold text-white">AI Picks for You</span>
                <span className="ml-auto text-xs text-gray-500">Updated now</span>
              </div>
              <div className="space-y-3">
                {[
                  { name: 'Adobe Creative Cloud', match: '97%', commission: '30%', earn: '$18.00' },
                  { name: 'Notion Team Plan', match: '94%', commission: '25%', earn: '$12.50' },
                  { name: 'Skillshare Premium', match: '91%', commission: '40%', earn: '$9.99' },
                  { name: 'Canva Pro Annual', match: '88%', commission: '35%', earn: '$41.97' },
                  { name: 'Grammarly Business', match: '86%', commission: '20%', earn: '$29.97' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-gray-800 border border-gray-700/60 rounded-xl">
                    <div className="w-8 h-8 bg-blue-900/40 border border-blue-800/60 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Brain size={14} className="text-blue-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{item.name}</p>
                      <p className="text-xs text-gray-500">{item.commission} commission</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-xs font-bold text-emerald-400">{item.earn}</p>
                      <p className="text-xs text-blue-400">{item.match} match</p>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-600 text-center mt-4">Based on your audience profile and past performance</p>
            </div>
          </div>
        </div>
      </section>

      {/* Campaign Manager */}
      <section id="campaigns" className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl mb-14">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Campaign Manager</p>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Launch and optimize affiliate campaigns at scale</h2>
            <p className="text-lg text-gray-500">
              Plan, execute, and measure affiliate campaigns across every channel from a single unified interface.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
            {campaignFeatures.map((f) => (
              <div key={f.title} className="border border-gray-100 rounded-2xl p-6 hover:shadow-md hover:-translate-y-0.5 transition-all">
                <div className="w-9 h-9 bg-gray-50 rounded-xl flex items-center justify-center mb-5">
                  <f.icon size={17} className="text-gray-600" />
                </div>
                <h3 className="text-sm font-bold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>

          {/* Campaign mock UI */}
          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-sm font-semibold text-gray-900">Active Campaigns</h3>
              <button className="text-xs font-medium text-gray-500 px-3 py-1.5 bg-white border border-gray-200 rounded-lg">+ New Campaign</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left text-xs text-gray-400 font-medium pb-3">Campaign</th>
                    <th className="text-right text-xs text-gray-400 font-medium pb-3">Clicks</th>
                    <th className="text-right text-xs text-gray-400 font-medium pb-3">Conv.</th>
                    <th className="text-right text-xs text-gray-400 font-medium pb-3">Revenue</th>
                    <th className="text-right text-xs text-gray-400 font-medium pb-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: 'Q4 Tech Review Push', clicks: '18,492', conv: '842', revenue: '$23,576', status: 'Active' },
                    { name: 'Black Friday Software', clicks: '12,081', conv: '691', revenue: '$18,342', status: 'Active' },
                    { name: 'Holiday Fashion Drop', clicks: '9,340', conv: '312', revenue: '$6,842', status: 'Paused' },
                    { name: 'New Year Fitness', clicks: '4,210', conv: '198', revenue: '$4,120', status: 'Draft' },
                  ].map((row, i) => (
                    <tr key={i} className={i < 3 ? 'border-b border-gray-50' : ''}>
                      <td className="py-3.5 font-medium text-gray-800 text-sm">{row.name}</td>
                      <td className="py-3.5 text-right text-xs text-gray-500">{row.clicks}</td>
                      <td className="py-3.5 text-right text-xs text-gray-500">{row.conv}</td>
                      <td className="py-3.5 text-right text-sm font-semibold text-gray-900">{row.revenue}</td>
                      <td className="py-3.5 text-right">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                          row.status === 'Active' ? 'bg-emerald-50 text-emerald-700' :
                          row.status === 'Paused' ? 'bg-amber-50 text-amber-700' :
                          'bg-gray-100 text-gray-500'
                        }`}>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Solutions — Affiliates */}
      <section id="affiliates" className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-1.5 mb-6">
                <Users size={13} className="text-gray-500" />
                <span className="text-sm font-semibold text-gray-700">For Affiliates</span>
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-5 leading-tight">
                Turn your audience into a steady income stream
              </h2>
              <p className="text-gray-500 text-lg leading-relaxed mb-8">
                Whether you're a blogger, YouTuber, or social media creator — Linkkart gives you the tools to monetize your audience with the right products at the right commission rates.
              </p>
              <ul className="space-y-3 mb-8">
                {affiliateBenefits.map((b) => (
                  <li key={b} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full border border-gray-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check size={10} className="text-emerald-500" />
                    </div>
                    <span className="text-sm text-gray-600">{b}</span>
                  </li>
                ))}
              </ul>
              <Link href="/register" className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors text-sm">
                Join as an affiliate <ArrowRight size={15} />
              </Link>
            </div>
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-5">Affiliate Earnings Snapshot</p>
              <div className="grid grid-cols-2 gap-4 mb-6">
                {[
                  { label: 'This Month', value: '$4,830' },
                  { label: 'Total Clicks', value: '28,492' },
                  { label: 'Conversions', value: '284' },
                  { label: 'Active Links', value: '18' },
                ].map((s) => (
                  <div key={s.label} className="border border-gray-100 rounded-xl p-4">
                    <p className="text-xs text-gray-400 mb-1">{s.label}</p>
                    <p className="text-xl font-bold text-gray-900">{s.value}</p>
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                {[
                  { product: 'Adobe Creative Cloud', earn: '$18.00', clicks: 412 },
                  { product: 'Shopify Annual Plan', earn: '$59.80', clicks: 318 },
                  { product: 'NordVPN 2-Year', earn: '$47.60', clicks: 271 },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <div>
                      <p className="text-sm font-medium text-gray-800">{item.product}</p>
                      <p className="text-xs text-gray-400">{item.clicks} clicks</p>
                    </div>
                    <p className="text-sm font-bold text-emerald-600">{item.earn}/sale</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Solutions — Merchants */}
      <section id="merchants" className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1 bg-gray-50 border border-gray-100 rounded-2xl p-6">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-5">Merchant Dashboard</p>
              <div className="space-y-3">
                {[
                  { name: 'Active Affiliates', value: '1,284', change: '+142 this month' },
                  { name: 'Total Sales Generated', value: '$142,830', change: '+22% vs last month' },
                  { name: 'Avg. Order Value', value: '$89.40', change: '+$12 vs benchmark' },
                  { name: 'Top Affiliate Commission', value: '$6,840', change: 'Sarah Mitchell' },
                ].map((s) => (
                  <div key={s.name} className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl">
                    <div>
                      <p className="text-xs text-gray-400">{s.name}</p>
                      <p className="text-lg font-bold text-gray-900">{s.value}</p>
                    </div>
                    <p className="text-xs text-emerald-600 font-medium text-right">{s.change}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full px-4 py-1.5 mb-6">
                <ShoppingBag size={13} className="text-gray-500" />
                <span className="text-sm font-semibold text-gray-700">For Merchants</span>
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-5 leading-tight">
                Scale your brand through thousands of affiliate partners
              </h2>
              <p className="text-gray-500 text-lg leading-relaxed mb-8">
                List your products, set your commission rates, and let Linkkart's network of 50,000+ affiliates drive qualified traffic and sales to your store.
              </p>
              <ul className="space-y-3 mb-8">
                {merchantBenefits.map((b) => (
                  <li key={b} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full border border-gray-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check size={10} className="text-emerald-500" />
                    </div>
                    <span className="text-sm text-gray-600">{b}</span>
                  </li>
                ))}
              </ul>
              <Link href="/register" className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors text-sm">
                List your products <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Solutions — Networks */}
      <section id="networks" className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-950">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-6">
                <Globe size={13} className="text-gray-300" />
                <span className="text-sm font-semibold text-gray-300">For Networks</span>
              </div>
              <h2 className="text-4xl font-bold text-white mb-5 leading-tight">
                Manage enterprise affiliate programs at scale
              </h2>
              <p className="text-gray-400 text-lg leading-relaxed mb-8">
                Built for affiliate networks managing multiple advertiser programs simultaneously. White-label, API-first, and designed for the complexity of running programs at enterprise scale.
              </p>
              <ul className="space-y-3 mb-8">
                {networkBenefits.map((b) => (
                  <li key={b} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full border border-gray-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check size={10} className="text-emerald-400" />
                    </div>
                    <span className="text-sm text-gray-400">{b}</span>
                  </li>
                ))}
              </ul>
              <Link href="/register" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-900 font-semibold rounded-xl hover:bg-gray-100 transition-colors text-sm">
                Talk to our team <ArrowRight size={15} />
              </Link>
            </div>
            <div className="space-y-4">
              {[
                { label: 'Advertisers managed', value: '240+', sub: 'Across 18 verticals' },
                { label: 'Monthly affiliate payouts', value: '$8.4M+', sub: 'Processed reliably' },
                { label: 'Network uptime SLA', value: '99.99%', sub: 'Guaranteed in enterprise plan' },
                { label: 'API calls per day', value: '180M+', sub: 'Handled at peak capacity' },
              ].map((s) => (
                <div key={s.label} className="bg-gray-900 border border-gray-800 rounded-2xl p-5 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">{s.label}</p>
                    <p className="text-xs text-gray-600">{s.sub}</p>
                  </div>
                  <p className="text-2xl font-bold text-white">{s.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white border-t border-gray-100">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to get started?</h2>
          <p className="text-gray-500 mb-8">Free to join. No credit card needed. Start earning today.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/register" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors text-sm">
              Create free account <ArrowRight size={15} />
            </Link>
            <Link href="/pricing" className="inline-flex items-center justify-center px-6 py-3 border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors text-sm">
              View pricing
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
