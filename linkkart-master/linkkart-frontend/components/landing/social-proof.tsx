'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Star, ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';

const testimonials = [
  {
    name: 'Sarah Mitchell',
    role: 'Full-time affiliate marketer',
    avatar: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=150',
    text: "I went from $2,000 to over $18,000 a month in eight months. The AI recommendations genuinely work — they matched me with products my audience actually buys.",
    earnings: '$18K/month',
    rating: 5,
  },
  {
    name: 'Marcus Chen',
    role: 'Tech blogger & reviewer',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150',
    text: "The analytics dashboard is on another level. I can see exactly which products convert, adjust my content strategy same day, and the results show up within hours.",
    earnings: '$9.4K/month',
    rating: 5,
  },
  {
    name: 'Priya Sharma',
    role: 'Beauty & lifestyle creator',
    avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150',
    text: "Linkkart matched me with beauty brands that fit my niche perfectly — brands I genuinely love. My commission rates went up 35% in the first quarter.",
    earnings: '$12.6K/month',
    rating: 5,
  },
  {
    name: 'James Rodriguez',
    role: 'E-commerce entrepreneur',
    avatar: 'https://images.pexels.com/photos/1121796/pexels-photo-1121796.jpeg?auto=compress&cs=tinysrgb&w=150',
    text: "Managing my affiliate program as a merchant used to take hours. Now it's one clean dashboard. I can track affiliates, approve links, and pull reports in minutes.",
    earnings: '$31K/month',
    rating: 5,
  },
  {
    name: 'Emma Thompson',
    role: 'Fitness influencer',
    avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=150',
    text: "The QR code generator was a game changer for my offline promotions. I put codes in my workout guides and the conversions tracked automatically.",
    earnings: '$7.2K/month',
    rating: 5,
  },
  {
    name: 'David Park',
    role: 'Software review YouTuber',
    avatar: 'https://images.pexels.com/photos/1300402/pexels-photo-1300402.jpeg?auto=compress&cs=tinysrgb&w=150',
    text: "Software commissions on Linkkart go up to 40%. The reporting is transparent, every payout has been on time, and support actually responds in under an hour.",
    earnings: '$22K/month',
    rating: 5,
  },
];

const faqs = [
  {
    q: 'How does Linkkart work?',
    a: 'Linkkart connects affiliates with brands. Browse our marketplace, generate a tracking link for any product you want to promote, and earn a commission every time someone purchases through your link.',
  },
  {
    q: 'How much can I earn?',
    a: 'It depends on your niche, audience, and the products you promote. Commission rates range from 3% to 40%. Our top affiliates consistently earn $10K–$50K per month. Software and courses offer the highest rates.',
  },
  {
    q: 'When and how do I get paid?',
    a: 'We offer weekly, bi-weekly, and monthly payout schedules via bank transfer, PayPal, Stripe, or cryptocurrency. Minimum threshold is $50 and most payments process within 24–48 hours.',
  },
  {
    q: 'Is Linkkart free to join?',
    a: 'Yes. The free plan gives you full access to our marketplace and basic analytics. Pro and Enterprise plans unlock AI recommendations, advanced reporting, unlimited links, and priority support.',
  },
  {
    q: 'Can I promote products internationally?',
    a: 'Yes. Linkkart operates in 120+ countries with multi-currency support. Geo-targeting automatically directs visitors to the right product version for their region.',
  },
  {
    q: 'How does fraud protection work?',
    a: 'Our AI monitors all clicks and conversions in real-time, identifying suspicious patterns and bot traffic automatically. This protects your commissions and keeps our network clean.',
  },
];

export default function SocialProof() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <>
      {/* Testimonials */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl mb-14">
            <p className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-4">Success Stories</p>
            <h2 className="text-4xl font-bold text-gray-900 leading-tight">
              Real affiliates, real results
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col">
                <div className="flex gap-0.5 mb-4">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} size={13} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed flex-1 mb-6">"{t.text}"</p>
                <div className="flex items-center gap-3 pt-4 border-t border-gray-50">
                  <img src={t.avatar} alt={t.name} className="w-9 h-9 rounded-full object-cover" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                    <p className="text-xs text-gray-400">{t.role}</p>
                  </div>
                  <span className="text-sm font-bold text-emerald-600">{t.earnings}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-4">FAQ</p>
            <h2 className="text-4xl font-bold text-gray-900">Common questions</h2>
          </div>

          <div className="space-y-2">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
                <button
                  className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-gray-50/50 transition-colors"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="font-medium text-gray-900 text-sm pr-6">{faq.q}</span>
                  {openFaq === i
                    ? <ChevronUp size={16} className="text-gray-400 flex-shrink-0" />
                    : <ChevronDown size={16} className="text-gray-400 flex-shrink-0" />
                  }
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5 text-sm text-gray-500 leading-relaxed border-t border-gray-50 pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-900">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-5">
            Ready to start earning?
          </h2>
          <p className="text-lg text-gray-400 mb-10">
            Join 50,000+ affiliates building their financial independence on Linkkart. Free to start, no credit card needed.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white text-gray-900 font-semibold rounded-xl hover:bg-gray-100 transition-colors text-sm"
            >
              Create free account <ArrowRight size={16} />
            </Link>
            <Link
              href="/marketplace"
              className="inline-flex items-center justify-center px-7 py-3.5 border border-gray-700 text-gray-300 font-medium rounded-xl hover:border-gray-600 hover:text-white transition-colors text-sm"
            >
              Browse marketplace
            </Link>
          </div>
          <p className="text-gray-600 text-xs mt-6">No credit card required  ·  Free forever plan  ·  Setup in minutes</p>
        </div>
      </section>
    </>
  );
}
