import {
  Zap,
  BarChart3,
  Link2,
  Shield,
  Globe,
  Award,
  Clock,
  Headphones,
} from 'lucide-react';

const brands = [
  'Samsung', 'Nike', 'Apple', 'Shopify', 'Adobe', 'Walmart',
  'Amazon', 'Microsoft', 'Spotify', 'Netflix', 'Airbnb', 'Uber',
  'Samsung', 'Nike', 'Apple', 'Shopify', 'Adobe', 'Walmart',
  'Amazon', 'Microsoft', 'Spotify', 'Netflix', 'Airbnb', 'Uber',
];

const whyItems = [
  { icon: Zap, title: 'AI-Powered Matching', desc: 'Our engine recommends products that convert best for your specific audience, boosting your earnings from day one.' },
  { icon: BarChart3, title: 'Real-Time Analytics', desc: 'Every click, conversion, and commission tracked live. Make informed decisions with clear, actionable data.' },
  { icon: Link2, title: 'Smart Link Generator', desc: 'Create, brand, and track affiliate links in seconds. QR codes, deep links, and short URLs included.' },
  { icon: Shield, title: 'Fraud Protection', desc: 'AI monitors every click and conversion to block fraud, so your commissions and brand budgets stay protected.' },
  { icon: Globe, title: 'Global Reach', desc: 'Access brands across 120+ countries with multi-currency payouts and geo-targeted links built in.' },
  { icon: Award, title: 'Performance Rewards', desc: 'Climb the leaderboard and unlock higher commission tiers, exclusive partnerships, and bonus payouts.' },
  { icon: Clock, title: 'Flexible Payouts', desc: 'Get paid weekly, bi-weekly, or monthly via bank transfer, PayPal, or crypto — always on time.' },
  { icon: Headphones, title: '24/7 Support', desc: 'Dedicated affiliate managers, live chat, and a full knowledge base. Real help from real people.' },
];

export default function BrandsSection() {
  return (
    <>
      {/* Trusted Brands */}
      <section className="border-y border-gray-100 py-12 bg-white overflow-hidden">
        <p className="text-center text-xs font-semibold text-gray-400 uppercase tracking-widest mb-8">
          Trusted by leading brands worldwide
        </p>
        <div className="marquee-container">
          <div className="marquee-content">
            {brands.map((brand, i) => (
              <span
                key={`${brand}-${i}`}
                className="inline-block mx-10 text-xl font-bold text-gray-200 select-none"
              >
                {brand}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Why Linkkart */}
      <section className="bg-gray-50 py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl mb-16">
            <p className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-4">Why Linkkart</p>
            <h2 className="text-4xl font-bold text-gray-900 mb-5 leading-tight">
              Everything you need to build a real affiliate business
            </h2>
            <p className="text-lg text-gray-500 leading-relaxed">
              From your first link to your first $10,000 month — Linkkart gives you the tools that actually move the needle.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyItems.map((item) => (
              <div key={item.title} className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-md hover:-translate-y-0.5 transition-all">
                <div className="w-9 h-9 bg-gray-50 rounded-xl flex items-center justify-center mb-5">
                  <item.icon size={18} className="text-gray-600" />
                </div>
                <h3 className="text-sm font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
