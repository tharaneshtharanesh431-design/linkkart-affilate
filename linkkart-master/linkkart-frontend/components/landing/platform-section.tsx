'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Star, Link2, ArrowRight, Laptop, Shirt, Dumbbell, Home, Gamepad2, BookOpen, Sparkles, Package } from 'lucide-react';

const categories = [
  { id: 'electronics', label: 'Electronics', icon: Laptop },
  { id: 'fashion', label: 'Fashion', icon: Shirt },
  { id: 'software', label: 'Software', icon: Package },
  { id: 'courses', label: 'Courses', icon: BookOpen },
  { id: 'beauty', label: 'Beauty', icon: Sparkles },
  { id: 'fitness', label: 'Fitness', icon: Dumbbell },
  { id: 'gaming', label: 'Gaming', icon: Gamepad2 },
  { id: 'home', label: 'Home', icon: Home },
];

const products: Record<string, { name: string; brand: string; commission: number; earnings: number; rating: number; reviews: string; image: string }[]> = {
  electronics: [
    { name: 'Sony WH-1000XM5 Headphones', brand: 'Sony', commission: 8, earnings: 28.0, rating: 4.9, reviews: '12.4K', image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { name: 'Apple MacBook Pro 14" M3', brand: 'Apple', commission: 3, earnings: 59.97, rating: 4.9, reviews: '9.6K', image: 'https://images.pexels.com/photos/812264/pexels-photo-812264.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { name: 'Samsung 65" QLED 4K TV', brand: 'Samsung', commission: 5, earnings: 87.5, rating: 4.8, reviews: '4.2K', image: 'https://images.pexels.com/photos/6976094/pexels-photo-6976094.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { name: 'Canon EOS R6 Mark II Camera', brand: 'Canon', commission: 4, earnings: 99.96, rating: 4.8, reviews: '2.8K', image: 'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=400' },
  ],
  fashion: [
    { name: 'Nike Air Max 270 React', brand: 'Nike', commission: 12, earnings: 14.4, rating: 4.8, reviews: '8.2K', image: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { name: "Levi's 511 Slim Fit Jeans", brand: "Levi's", commission: 15, earnings: 10.43, rating: 4.6, reviews: '18.4K', image: 'https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { name: 'Adidas Ultraboost 23', brand: 'Adidas', commission: 10, earnings: 18.0, rating: 4.7, reviews: '6.3K', image: 'https://images.pexels.com/photos/1456706/pexels-photo-1456706.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { name: 'Ray-Ban Aviator Classic', brand: 'Ray-Ban', commission: 18, earnings: 27.0, rating: 4.8, reviews: '11.2K', image: 'https://images.pexels.com/photos/701877/pexels-photo-701877.jpeg?auto=compress&cs=tinysrgb&w=400' },
  ],
  software: [
    { name: 'Adobe Creative Cloud All Apps', brand: 'Adobe', commission: 30, earnings: 18.0, rating: 4.7, reviews: '5.8K', image: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { name: 'Shopify Business Annual', brand: 'Shopify', commission: 20, earnings: 59.8, rating: 4.8, reviews: '11.1K', image: 'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { name: 'NordVPN 2-Year Plan', brand: 'NordVPN', commission: 40, earnings: 47.6, rating: 4.6, reviews: '22K', image: 'https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { name: 'Notion Team Plan', brand: 'Notion', commission: 25, earnings: 12.5, rating: 4.8, reviews: '9.4K', image: 'https://images.pexels.com/photos/6804068/pexels-photo-6804068.jpeg?auto=compress&cs=tinysrgb&w=400' },
  ],
  courses: [
    { name: 'Complete Web Dev Bootcamp', brand: 'Udemy', commission: 40, earnings: 36.0, rating: 4.8, reviews: '14.2K', image: 'https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { name: 'Python for Data Science', brand: 'Coursera', commission: 35, earnings: 28.0, rating: 4.7, reviews: '8.6K', image: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { name: 'Digital Marketing Masterclass', brand: 'Skillshare', commission: 30, earnings: 18.0, rating: 4.6, reviews: '7.1K', image: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { name: 'AWS Cloud Practitioner Prep', brand: 'A Cloud Guru', commission: 35, earnings: 34.97, rating: 4.8, reviews: '5.3K', image: 'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=400' },
  ],
  beauty: [
    { name: 'Charlotte Tilbury Glow Kit', brand: 'Charlotte Tilbury', commission: 20, earnings: 15.0, rating: 4.7, reviews: '6.9K', image: 'https://images.pexels.com/photos/2587370/pexels-photo-2587370.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { name: 'Dyson Airwrap Multi-Styler', brand: 'Dyson', commission: 8, earnings: 47.92, rating: 4.8, reviews: '4.8K', image: 'https://images.pexels.com/photos/3997379/pexels-photo-3997379.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { name: 'La Mer Moisturizing Cream', brand: 'La Mer', commission: 15, earnings: 52.5, rating: 4.6, reviews: '3.2K', image: 'https://images.pexels.com/photos/3373745/pexels-photo-3373745.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { name: 'Fenty Beauty Pro Foundation', brand: 'Fenty Beauty', commission: 18, earnings: 10.8, rating: 4.9, reviews: '15.6K', image: 'https://images.pexels.com/photos/2536965/pexels-photo-2536965.jpeg?auto=compress&cs=tinysrgb&w=400' },
  ],
  fitness: [
    { name: 'Peloton Bike+ Smart Exercise', brand: 'Peloton', commission: 5, earnings: 124.75, rating: 4.6, reviews: '2.4K', image: 'https://images.pexels.com/photos/4162579/pexels-photo-4162579.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { name: 'Whoop 4.0 Fitness Band', brand: 'WHOOP', commission: 20, earnings: 47.8, rating: 4.5, reviews: '6.1K', image: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { name: 'Bowflex SelectTech Dumbbells', brand: 'Bowflex', commission: 8, earnings: 35.92, rating: 4.8, reviews: '8.9K', image: 'https://images.pexels.com/photos/416778/pexels-photo-416778.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { name: 'MyFitnessPal Premium Annual', brand: 'MyFitnessPal', commission: 30, earnings: 14.97, rating: 4.4, reviews: '18.2K', image: 'https://images.pexels.com/photos/4753885/pexels-photo-4753885.jpeg?auto=compress&cs=tinysrgb&w=400' },
  ],
  gaming: [
    { name: 'PlayStation 5 Digital Edition', brand: 'Sony', commission: 4, earnings: 15.96, rating: 4.9, reviews: '20.8K', image: 'https://images.pexels.com/photos/4792509/pexels-photo-4792509.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { name: 'Xbox Game Pass Ultimate 12M', brand: 'Microsoft', commission: 25, earnings: 34.97, rating: 4.7, reviews: '9.3K', image: 'https://images.pexels.com/photos/1777761/pexels-photo-1777761.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { name: 'Razer BlackWidow V4 Keyboard', brand: 'Razer', commission: 10, earnings: 19.99, rating: 4.6, reviews: '5.7K', image: 'https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { name: 'Steam Deck OLED 512GB', brand: 'Valve', commission: 3, earnings: 16.49, rating: 4.8, reviews: '7.4K', image: 'https://images.pexels.com/photos/7915437/pexels-photo-7915437.jpeg?auto=compress&cs=tinysrgb&w=400' },
  ],
  home: [
    { name: 'Dyson V15 Detect Vacuum', brand: 'Dyson', commission: 6, earnings: 41.94, rating: 4.9, reviews: '3.1K', image: 'https://images.pexels.com/photos/4108715/pexels-photo-4108715.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { name: 'Instant Pot Duo 7-in-1 Cooker', brand: 'Instant Brands', commission: 6, earnings: 5.99, rating: 4.9, reviews: '20.1K', image: 'https://images.pexels.com/photos/4259707/pexels-photo-4259707.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { name: 'Philips Hue Smart Lighting Kit', brand: 'Philips', commission: 8, earnings: 15.99, rating: 4.7, reviews: '12.6K', image: 'https://images.pexels.com/photos/1125137/pexels-photo-1125137.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { name: 'Roomba j9+ Self-Emptying Robot', brand: 'iRobot', commission: 5, earnings: 39.98, rating: 4.6, reviews: '4.8K', image: 'https://images.pexels.com/photos/4107277/pexels-photo-4107277.jpeg?auto=compress&cs=tinysrgb&w=400' },
  ],
};

export default function PlatformSection() {
  const [active, setActive] = useState('electronics');
  const list = products[active] || [];

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Platform — Product Marketplace</p>
            <h2 className="text-4xl font-bold text-gray-900 leading-tight">
              Browse products by category
            </h2>
            <p className="text-gray-500 mt-3 text-lg max-w-xl">
              Pick a niche, find the right products, and generate your affiliate link in one click.
            </p>
          </div>
          <Link
            href="/marketplace"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-gray-800 transition-colors whitespace-nowrap self-start lg:self-auto"
          >
            View full marketplace <ArrowRight size={15} />
          </Link>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 flex-wrap mb-8">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActive(cat.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors border ${
                active === cat.id
                  ? 'bg-gray-900 text-white border-gray-900'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:text-gray-900'
              }`}
            >
              <cat.icon size={14} />
              {cat.label}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {list.map((product) => (
            <div key={product.name} className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all group">
              <div className="h-44 overflow-hidden bg-gray-50">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                />
              </div>
              <div className="p-5">
                <p className="text-xs text-gray-400 mb-1">{product.brand}</p>
                <h3 className="text-sm font-semibold text-gray-900 leading-snug mb-3 h-10 line-clamp-2">{product.name}</h3>
                <div className="flex items-center gap-1 mb-4">
                  <Star size={11} className="text-amber-400 fill-amber-400" />
                  <span className="text-xs font-medium text-gray-700">{product.rating}</span>
                  <span className="text-xs text-gray-400">({product.reviews})</span>
                </div>
                <div className="flex items-end justify-between pt-3 border-t border-gray-50 mb-4">
                  <div>
                    <p className="text-xs text-gray-400">Commission</p>
                    <p className="text-base font-bold text-gray-900">{product.commission}%</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400">Per sale</p>
                    <p className="text-base font-bold text-emerald-600">${product.earnings.toFixed(2)}</p>
                  </div>
                </div>
                <button className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-gray-900 text-white text-xs font-semibold rounded-xl hover:bg-gray-800 transition-colors">
                  <Link2 size={12} />
                  Get Affiliate Link
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
