import Link from 'next/link';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import { ArrowRight, Users, Globe, TrendingUp, Heart } from 'lucide-react';

const team = [
  { name: 'Arjun Patel', role: 'CEO & Co-Founder', bio: 'Former product lead at Shopify. Built affiliate programs for Fortune 500 brands for 8 years before founding Linkkart.', img: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=300' },
  { name: 'Sofia Rodriguez', role: 'CTO & Co-Founder', bio: 'Previously led engineering at Impact.com. Architected real-time attribution systems processing 500M+ events daily.', img: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=300' },
  { name: 'James Liu', role: 'Head of Product', bio: '10 years building SaaS products. Led growth at PartnerStack from Series A to $1B valuation. Obsessed with affiliate UX.', img: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=300' },
  { name: 'Emily Chen', role: 'Head of Partnerships', bio: 'Built and scaled affiliate partnerships for brands including Nike, Adobe, and Shopify. Personally manages our top 50 merchants.', img: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=300' },
  { name: 'David Okafor', role: 'Head of Growth', bio: 'Growth marketer who scaled Linkkart from 0 to 50,000 affiliates in 18 months using data-driven acquisition strategies.', img: 'https://images.pexels.com/photos/1300402/pexels-photo-1300402.jpeg?auto=compress&cs=tinysrgb&w=300' },
  { name: 'Priya Nair', role: 'Head of AI & Data', bio: 'PhD in ML from Stanford. Led recommendation systems at Amazon before joining to build Linkkart\'s AI matching engine.', img: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=300' },
];

const values = [
  { icon: Users, title: 'Affiliate-first', desc: 'We built Linkkart for affiliates. Every product decision starts with: does this help our affiliates earn more?' },
  { icon: TrendingUp, title: 'Transparency', desc: 'Clear commissions, honest reporting, real-time data. We believe you should always know exactly where your money comes from.' },
  { icon: Globe, title: 'Global by default', desc: 'Affiliate marketing is borderless. We\'re built for creators and brands in every timezone, currency, and market.' },
  { icon: Heart, title: 'Long-term thinking', desc: 'We optimise for affiliate lifetime value, not short-term clicks. Sustainable earnings for our partners is how we grow.' },
];

const milestones = [
  { year: '2020', event: 'Linkkart founded in San Francisco by Arjun Patel and Sofia Rodriguez with $2M in seed funding.' },
  { year: '2021', event: 'Launched publicly with 200 brands and 5,000 affiliates. Processed $1M in commissions in year one.' },
  { year: '2022', event: 'Raised $12M Series A. Launched AI recommendations engine and reached 15,000 active affiliates.' },
  { year: '2023', event: 'Expanded to 80+ countries. Crossed $50M in total affiliate commissions processed. Launched Campaign Manager.' },
  { year: '2024', event: 'Reached 50,000+ affiliates, 10,000+ brands, and $100M+ in total revenue generated across the network.' },
];

const openRoles = [
  { title: 'Senior Frontend Engineer', team: 'Engineering', type: 'Full-time · Remote' },
  { title: 'ML Engineer — Recommendations', team: 'AI & Data', type: 'Full-time · San Francisco or Remote' },
  { title: 'Affiliate Success Manager', team: 'Partnerships', type: 'Full-time · Remote' },
  { title: 'Product Marketing Manager', team: 'Marketing', type: 'Full-time · San Francisco' },
  { title: 'Senior Backend Engineer (Go)', team: 'Engineering', type: 'Full-time · Remote' },
  { title: 'Brand Partnerships Manager', team: 'Partnerships', type: 'Full-time · New York or Remote' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Mission */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 border-b border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">About Linkkart</p>
              <h1 className="text-5xl font-bold text-gray-900 leading-tight mb-6">
                We're building the affiliate platform we always wished existed
              </h1>
              <p className="text-xl text-gray-500 leading-relaxed mb-6">
                Linkkart was founded in 2020 by two affiliate marketers who were frustrated with outdated platforms, opaque reporting, and missed earnings.
              </p>
              <p className="text-lg text-gray-400 leading-relaxed">
                Today, we power over 50,000 affiliates and 10,000 brands across 120 countries, with a single mission: make affiliate marketing simple, transparent, and genuinely profitable for everyone in the chain.
              </p>
            </div>
            <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-xl">
              <img
                src="https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg?auto=compress&cs=tinysrgb&w=900"
                alt="Linkkart team"
                className="w-full h-[420px] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { value: '50K+', label: 'Active affiliates' },
              { value: '10K+', label: 'Partner brands' },
              { value: '$100M+', label: 'Revenue generated' },
              { value: '120+', label: 'Countries' },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-4xl font-bold text-gray-900 mb-2">{s.value}</div>
                <div className="text-sm text-gray-400">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl mb-14">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Our values</p>
            <h2 className="text-4xl font-bold text-gray-900">What drives everything we build</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v) => (
              <div key={v.title} className="border border-gray-100 rounded-2xl p-6 hover:shadow-md hover:-translate-y-0.5 transition-all">
                <div className="w-9 h-9 bg-gray-50 rounded-xl flex items-center justify-center mb-5">
                  <v.icon size={17} className="text-gray-600" />
                </div>
                <h3 className="text-sm font-bold text-gray-900 mb-2">{v.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl mb-14">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">The team</p>
            <h2 className="text-4xl font-bold text-gray-900">Built by people who've been affiliates</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {team.map((member) => (
              <div key={member.name} className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-md transition-all">
                <img
                  src={member.img}
                  alt={member.name}
                  className="w-full h-52 object-cover object-top"
                />
                <div className="p-5">
                  <h3 className="text-sm font-bold text-gray-900">{member.name}</h3>
                  <p className="text-xs text-gray-400 mb-3">{member.role}</p>
                  <p className="text-sm text-gray-500 leading-relaxed">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="mb-14">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Our story</p>
            <h2 className="text-4xl font-bold text-gray-900">From idea to industry platform</h2>
          </div>
          <div className="space-y-0">
            {milestones.map((m, i) => (
              <div key={m.year} className="flex gap-8">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {m.year.slice(2)}
                  </div>
                  {i < milestones.length - 1 && <div className="w-px flex-1 bg-gray-100 my-2" />}
                </div>
                <div className="pb-10">
                  <p className="text-xs font-semibold text-gray-400 mb-1">{m.year}</p>
                  <p className="text-sm text-gray-600 leading-relaxed">{m.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Careers */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Careers</p>
              <h2 className="text-4xl font-bold text-gray-900 mb-3">Join our team</h2>
              <p className="text-lg text-gray-500 max-w-xl">
                We're a remote-first company of 80+ people spread across 18 countries. If you want to build the future of affiliate marketing, we'd love to hear from you.
              </p>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">80+</div>
                <div className="text-gray-400 text-xs mt-0.5">Team members</div>
              </div>
              <div className="w-px h-8 bg-gray-200" />
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">18</div>
                <div className="text-gray-400 text-xs mt-0.5">Countries</div>
              </div>
              <div className="w-px h-8 bg-gray-200" />
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">100%</div>
                <div className="text-gray-400 text-xs mt-0.5">Remote-friendly</div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {openRoles.map((role) => (
              <div key={role.title} className="bg-white border border-gray-100 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all">
                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-1">{role.title}</h3>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-400">{role.team}</span>
                    <span className="text-gray-200">·</span>
                    <span className="text-xs text-gray-400">{role.type}</span>
                  </div>
                </div>
                <button className="sm:flex-shrink-0 inline-flex items-center gap-1.5 px-4 py-2 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
                  View role <ArrowRight size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to join 50,000+ affiliates?</h2>
          <p className="text-gray-400 mb-8">Create your free account and start earning today.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/register" className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white text-gray-900 font-semibold rounded-xl hover:bg-gray-100 transition-colors text-sm">
              Get started free <ArrowRight size={15} />
            </Link>
            <Link href="/features" className="inline-flex items-center justify-center px-7 py-3.5 border border-gray-700 text-gray-300 font-medium rounded-xl hover:border-gray-600 hover:text-white transition-colors text-sm">
              See all features
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
