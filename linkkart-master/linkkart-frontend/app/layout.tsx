import './globals.css';
import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import Providers from './providers';

const jakarta = Plus_Jakarta_Sans({ 
  subsets: ['latin'],
  style: ['normal', 'italic']
});

export const metadata: Metadata = {
  title: 'LinkKart - Premium Affiliate Marketing Platform',
  description: 'Grow your business through smart affiliate partnerships. Join thousands of affiliates and brands on LinkKart.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${jakarta.className} italic antialiased text-[#675F78] bg-[#FBF9FF]`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
