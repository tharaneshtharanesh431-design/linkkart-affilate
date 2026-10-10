'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

const navItems = [
  { label: 'Platform', href: '#platform' },
  { label: 'Solutions', href: '#solutions' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Resources', href: '#resources' },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed top-6 w-full z-50 flex justify-center px-4 sm:px-6 pointer-events-none transition-all duration-300">
      <nav
        className={`pointer-events-auto transition-all duration-500 max-w-[1180px] w-full mx-auto rounded-full ${
          scrolled 
            ? 'glass-panel py-3' 
            : 'bg-transparent py-4'
        }`}
      >
        <div className="flex items-center justify-between px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 rounded-xl bg-primary-brand flex items-center justify-center text-white font-bold text-lg shadow-sm">
              L
            </div>
            <span className="text-[1.25rem] font-[800] tracking-tight text-text-heading">LinkKart</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-[15px] font-[600] text-text-body hover:text-primary-brand transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/login"
              className="text-[15px] font-[600] text-text-heading hover:text-primary-brand transition-colors"
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="btn-primary flex items-center justify-center"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-full text-text-body hover:bg-surface-lavender transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 p-4 bg-white rounded-2xl shadow-xl border border-border-light flex flex-col gap-4 md:hidden">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="block px-4 py-3 text-[16px] font-[600] text-text-heading hover:bg-surface-lavender rounded-xl"
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="h-px w-full bg-border-light my-2" />
            <Link
              href="/login"
              className="block px-4 py-3 text-[16px] font-[600] text-center text-text-heading border border-border-light rounded-xl"
              onClick={() => setMobileOpen(false)}
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="block px-4 py-3 text-[16px] font-[700] text-center text-white bg-primary-brand rounded-xl"
              onClick={() => setMobileOpen(false)}
            >
              Get Started
            </Link>
          </div>
        )}
      </nav>
    </div>
  );
}
