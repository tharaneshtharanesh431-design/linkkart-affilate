'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, Menu, X } from 'lucide-react';

const navItems = [
  {
    label: 'Platform',
    children: [
      { label: 'Link Generator', href: '/features#platform', desc: 'Create tracking links instantly' },
      { label: 'Analytics', href: '/dashboard', desc: 'Real-time performance data' },
      { label: 'AI Recommendations', href: '/features#ai', desc: 'Smart product suggestions' },
      { label: 'Campaign Manager', href: '/features#campaigns', desc: 'End-to-end campaign control' },
    ],
  },
  {
    label: 'Solutions',
    children: [
      { label: 'For Affiliates', href: '/features#affiliates', desc: 'Monetize your audience' },
      { label: 'For Merchants', href: '/features#merchants', desc: 'Scale through partners' },
      { label: 'For Networks', href: '/features#networks', desc: 'Manage at enterprise scale' },
    ],
  },
  { label: 'Marketplace', href: '/marketplace' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'About', href: '/about' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [announcementVisible, setAnnouncementVisible] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const userStr = localStorage.getItem('user');
    if (token && userStr) {
      setIsLoggedIn(true);
      try {
        const user = JSON.parse(userStr);
        setUsername(user.username || 'User');
      } catch (_) {
        setUsername('User');
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    localStorage.removeItem('rememberMe');
    setIsLoggedIn(false);
    window.location.href = '/login';
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {announcementVisible && (
        <div className="bg-indigo-950 text-white text-sm py-2.5 px-4 text-center relative z-50">
          <span className="text-violet-200">AI-powered affiliate matching is now live —</span>
          <Link href="/register" className="ml-1.5 text-white font-semibold underline underline-offset-2 hover:text-violet-100 transition-colors">
            Try it free
          </Link>
          <button
            onClick={() => setAnnouncementVisible(false)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-violet-400 hover:text-white transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      )}

      <div className="px-4 sm:px-6 lg:px-8 mt-4 fixed top-8 w-full z-50 flex justify-center pointer-events-none">
        <nav
          className={`pointer-events-auto transition-all duration-300 ${
            scrolled ? 'shadow-lg bg-white/95 backdrop-blur-md' : 'shadow-md bg-white'
          } rounded-full border border-violet-100 max-w-5xl w-full mx-auto`}
        >
          <div className="flex items-center justify-between h-16 px-6">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-0 flex-shrink-0">
              <span className="text-xl font-extrabold tracking-tight text-indigo-950">Linkkart</span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-0.5">
              {navItems.map((item) =>
                item.children ? (
                  <div
                    key={item.label}
                    className="relative"
                    onMouseEnter={() => setActiveDropdown(item.label)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <button className="flex items-center gap-1 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-50 transition-colors">
                      {item.label}
                      <ChevronDown size={13} className={`transition-transform ${activeDropdown === item.label ? 'rotate-180' : ''}`} />
                    </button>
                    {activeDropdown === item.label && (
                      <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-xl shadow-lg border border-gray-100 p-1.5 z-50">
                        {item.children.map((child) => (
                          <Link
                            key={child.label}
                            href={child.href}
                            className="block px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            <div className="text-sm font-medium text-gray-800">{child.label}</div>
                            <div className="text-xs text-gray-400 mt-0.5">{child.desc}</div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    key={item.label}
                    href={item.href!}
                    className={`px-4 py-2 text-sm rounded-full transition-colors ${
                      pathname === item.href
                        ? 'text-violet-700 font-semibold bg-violet-50'
                        : 'text-slate-600 hover:text-indigo-950 hover:bg-violet-50/50'
                    }`}
                  >
                    {item.label}
                  </Link>
                )
              )}
            </div>

            {/* CTA Buttons */}
            <div className="hidden lg:flex items-center gap-3">
              {isLoggedIn ? (
                <>
                  <Link
                    href="/dashboard"
                    className="px-4 py-2 text-sm text-slate-600 hover:text-indigo-950 transition-colors font-semibold"
                  >
                    Dashboard ({username})
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="px-5 py-2 text-sm font-bold text-white bg-violet-600 rounded-full hover:bg-violet-700 transition-colors shadow-md shadow-violet-500/20"
                  >
                    Log out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="px-4 py-2 text-sm text-slate-600 hover:text-indigo-950 font-medium transition-colors"
                  >
                    Log in
                  </Link>
                  <Link
                    href="/register"
                    className="px-5 py-2 text-sm font-bold text-white bg-violet-600 rounded-full hover:bg-violet-700 transition-colors shadow-md shadow-violet-500/20"
                  >
                    Get started
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 rounded-full text-slate-600 hover:bg-violet-50 transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Menu Spacer */}
      <div className="h-20 hidden lg:block"></div>

      {/* Mobile Menu Dropdown */}
      <div className="relative z-40">
        {mobileOpen && (
          <div className="lg:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-1">
            {navItems.map((item) =>
              item.children ? (
                <div key={item.label}>
                  <div className="px-3 py-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">{item.label}</div>
                  {item.children.map((child) => (
                    <Link
                      key={child.label}
                      href={child.href}
                      className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
                      onClick={() => setMobileOpen(false)}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              ) : (
                <Link
                  key={item.label}
                  href={item.href!}
                  className="block px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
              )
            )}
            <div className="pt-3 border-t border-gray-100 flex flex-col gap-2 mt-2">
              {isLoggedIn ? (
                <>
                  <Link href="/dashboard" className="block text-center py-2.5 text-sm text-gray-700 border border-gray-200 rounded-xl" onClick={() => setMobileOpen(false)}>Dashboard</Link>
                  <button onClick={handleLogout} className="block text-center py-2.5 text-sm font-semibold text-white bg-gray-900 rounded-xl w-full">Log out</button>
                </>
              ) : (
                <>
                  <Link href="/login" className="block text-center py-2.5 text-sm text-gray-700 border border-gray-200 rounded-xl" onClick={() => setMobileOpen(false)}>Log in</Link>
                  <Link href="/register" className="block text-center py-2.5 text-sm font-semibold text-white bg-gray-900 rounded-xl" onClick={() => setMobileOpen(false)}>Get started</Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
