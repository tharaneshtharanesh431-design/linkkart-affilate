'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import { Check, ArrowRight, Zap } from 'lucide-react';

const plans = [
  {
    name: 'Free',
    price: { monthly: 0, annual: 0 },
    desc: 'Perfect for getting started. No credit card needed.',
    cta: 'Get started free',
    href: '/register',
    featured: false,
    features: [
      'Access to marketplace (up to 100 products)',
      '5 affiliate links',
      'Basic click analytics',
      'Manual link generator',
      'Email support',
      'Weekly payout ($50 minimum)',
    ],
    limits: ['No AI recommendations', 'No QR code generator', 'No campaign manager'],
  },
  {
    name: 'Pro',
    price: { monthly: 29, annual: 19 },
    desc: 'For serious affiliates who want to grow fast.',
    cta: 'Start Pro free for 14 days',
    href: '/register',
    featured: true,
    features: [
      'Unlimited marketplace access',
      'Unlimited affiliate links',
      'Real-time analytics dashboard',
      'AI product recommendations',
      'QR code generator',
      'Campaign manager (3 active)',
      'Priority support',
      'Weekly payout ($10 minimum)',
      'Achievement badges & leaderboard',
      'Performance API access',
    ],
    limits: [],
  },
  {
    name: 'Business',
    price: { monthly: 79, annual: 59 },
    desc: 'For teams and high-volume affiliates and merchants.',
    cta: 'Start Business trial',
    href: '/register',
    featured: false,
    features: [
      'Everything in Pro',
      'Unlimited active campaigns',
      'Advanced A/B testing',
      'Custom branded short links',
      'Team member access (5 seats)',
      'Merchant dashboard & product listing',
      'API access & webhooks',
      'Dedicated affiliate manager',
      'Daily payouts available',
      'White-label reports',
    ],
    limits: [],
  },
  {
    name: 'Enterprise',
    price: { monthly: null, annual: null },
    desc: 'For networks and large organizations with custom needs.',
    cta: 'Contact sales',
    href: '/contact',
    featured: false,
    features: [
      'Everything in Business',
      'White-label platform',
      'Custom commission structures',
      'Unlimited team seats',
      'SSO and SAML integration',
      'SOC 2 compliance documentation',
      'SLA with 99.99% uptime guarantee',
      'Custom API rate limits',
      'Dedicated account manager',
      'Custom onboarding and training',
    ],
    limits: [],
  },
];

const faqs = [
  { q: 'Can I switch plans at any time?', a: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately and billing is prorated.' },
  { q: 'Is there a free trial?', a: 'Pro and Business plans include a 14-day free trial with full access. No credit card required to start.' },
  { q: 'What payment methods do you accept?', a: 'We accept all major credit cards, PayPal, and bank transfers for annual plans.' },
  { q: 'How do affiliate payouts work?', a: 'Free plan pays weekly with a $50 minimum. Pro and above have a $10 minimum. Business and Enterprise can unlock daily payouts.' },
  { q: 'Can I use Linkkart as a merchant?', a: 'Merchant features (product listing, affiliate management) are available on Business and Enterprise plans.' },
  { q: 'Is there a contract?', a: 'No contracts on monthly plans. Annual plans are billed once per year and are non-refundable after 30 days.' },
];

export default function PricingPage() {
  const [annual, setAnnual] = useState(true);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Header */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-b border-gray-100">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Pricing</p>
          <h1 className="text-5xl font-bold text-gray-900 mb-5">Simple, transparent pricing</h1>
          <p className="text-xl text-gray-500 mb-10">
            Start free. Upgrade when you're ready. No hidden fees.
          </p>

          {/* Annual / Monthly toggle */}
          <div className="inline-flex items-center gap-3 bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => setAnnual(false)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${!annual ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}
            >
              Monthly
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${annual ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}
            >
              Annual
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Save 35%</span>
            </button>
          </div>
        </div>
      </section>

      {/* Plans Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`bg-white rounded-2xl border flex flex-col ${
                  plan.featured
                    ? 'border-gray-900 shadow-xl ring-1 ring-gray-900/5'
                    : 'border-gray-100 shadow-sm'
                }`}
              >
                {plan.featured && (
                  <div className="bg-gray-900 text-white text-xs font-bold text-center py-2 rounded-t-2xl tracking-wider uppercase flex items-center justify-center gap-1.5">
                    <Zap size={11} /> Most Popular
                  </div>
                )}
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-base font-bold text-gray-900 mb-1">{plan.name}</h3>
                  <p className="text-xs text-gray-400 mb-5 leading-relaxed">{plan.desc}</p>

                  <div className="mb-6">
                    {plan.price.monthly === null ? (
                      <div className="text-3xl font-bold text-gray-900">Custom</div>
                    ) : plan.price.monthly === 0 ? (
                      <div className="text-3xl font-bold text-gray-900">Free</div>
                    ) : (
                      <div className="flex items-end gap-1">
                        <span className="text-3xl font-bold text-gray-900">
                          ${annual ? plan.price.annual : plan.price.monthly}
                        </span>
                        <span className="text-sm text-gray-400 mb-1">/month</span>
                      </div>
                    )}
                    {annual && plan.price.monthly && plan.price.monthly > 0 && (
                      <p className="text-xs text-gray-400 mt-1">Billed ${(plan.price.annual! * 12)} annually</p>
                    )}
                  </div>

                  <Link
                    href={plan.href}
                    className={`w-full text-center py-2.5 rounded-xl text-sm font-semibold transition-colors mb-6 ${
                      plan.featured
                        ? 'bg-gray-900 text-white hover:bg-gray-800'
                        : 'bg-gray-50 text-gray-900 border border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    {plan.cta}
                  </Link>

                  <div className="flex-1">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">What's included</p>
                    <ul className="space-y-2.5">
                      {plan.features.map((f) => (
                        <li key={f} className="flex items-start gap-2.5">
                          <Check size={13} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                          <span className="text-xs text-gray-600">{f}</span>
                        </li>
                      ))}
                      {plan.limits.map((l) => (
                        <li key={l} className="flex items-start gap-2.5 opacity-40">
                          <div className="w-3 h-px bg-gray-400 flex-shrink-0 mt-2" />
                          <span className="text-xs text-gray-500">{l}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison note */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">All plans include</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { title: 'SSL-secured links', desc: 'Every affiliate link is served over HTTPS automatically.' },
              { title: 'Fraud protection', desc: 'AI-powered bot and click fraud detection on all accounts.' },
              { title: '99.9% uptime SLA', desc: 'Reliable infrastructure with redundant global servers.' },
              { title: 'GDPR compliant', desc: 'Full data privacy controls and EU data residency options.' },
              { title: 'Multi-currency', desc: 'Track earnings in your local currency. Payout in 30+ currencies.' },
              { title: 'Mobile-friendly', desc: 'Full dashboard access from any device, any browser.' },
            ].map((item) => (
              <div key={item.title} className="flex gap-3">
                <Check size={15} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-gray-900">{item.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Pricing FAQ</h2>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <div key={faq.q} className="bg-white border border-gray-100 rounded-2xl p-5">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">{faq.q}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-900">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Start for free today</h2>
          <p className="text-gray-400 mb-8">No credit card. No commitment. Just results.</p>
          <Link href="/register" className="inline-flex items-center gap-2 px-7 py-3.5 bg-white text-gray-900 font-bold rounded-xl hover:bg-gray-100 transition-colors text-sm">
            Create free account <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
