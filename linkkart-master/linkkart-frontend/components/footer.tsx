import Link from 'next/link';
import { Twitter, Linkedin, Github, Youtube, Mail } from 'lucide-react';

const footerLinks = {
  Platform: [
    { label: 'Link Generator', href: '/features' },
    { label: 'Analytics Dashboard', href: '/dashboard' },
    { label: 'AI Recommendations', href: '/features' },
    { label: 'Campaign Manager', href: '/features' },
    { label: 'QR Code Generator', href: '/features' },
  ],
  Solutions: [
    { label: 'For Affiliates', href: '/features' },
    { label: 'For Merchants', href: '/features' },
    { label: 'For Networks', href: '/features' },
    { label: 'Marketplace', href: '/marketplace' },
    { label: 'Pricing', href: '/pricing' },
  ],
  Company: [
    { label: 'About Us', href: '/about' },
    { label: 'Careers', href: '/about' },
    { label: 'Blog', href: '/about' },
    { label: 'Press', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '/' },
    { label: 'Terms of Service', href: '/' },
    { label: 'Cookie Policy', href: '/' },
    { label: 'GDPR', href: '/' },
  ],
};

const socials = [
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
  { icon: Github, href: '#', label: 'GitHub' },
  { icon: Youtube, href: '#', label: 'YouTube' },
];

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* CTA Strip */}
        <div className="py-12 border-b border-gray-800 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-bold text-white">Ready to grow your revenue?</h3>
            <p className="text-gray-500 text-sm mt-1">Join 50,000+ affiliates and 10,000+ brands on Linkkart.</p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/register"
              className="px-5 py-2.5 bg-white text-gray-900 text-sm font-semibold rounded-xl hover:bg-gray-100 transition-colors"
            >
              Start free today
            </Link>
            <Link
              href="/contact"
              className="px-5 py-2.5 border border-gray-700 text-gray-300 text-sm font-medium rounded-xl hover:border-gray-600 hover:text-white transition-colors flex items-center gap-2"
            >
              <Mail size={14} />
              Talk to sales
            </Link>
          </div>
        </div>

        {/* Links */}
        <div className="py-12 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <Link href="/" className="text-xl font-bold text-white mb-4 block">
              Linkkart
            </Link>
            <p className="text-sm text-gray-500 leading-relaxed mb-6">
              The world's most powerful affiliate marketing platform.
            </p>
            <div className="flex gap-2">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition-colors"
                >
                  <s.icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-xs font-semibold text-gray-300 uppercase tracking-wider mb-4">{title}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm text-gray-500 hover:text-gray-300 transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="py-5 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-600">2024 Linkkart Inc. All rights reserved.</p>
          <div className="flex items-center gap-5 text-xs text-gray-600">
            <span>120+ Countries</span>
            <span>$100M+ Revenue Generated</span>
            <span>SOC 2 Certified</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
