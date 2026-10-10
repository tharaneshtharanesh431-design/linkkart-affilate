import Link from 'next/link';
import { ArrowRight, Star, Laptop, Shirt, Dumbbell, Home, Gamepad2, BookOpen, Sparkles, Package } from 'lucide-react';

const categories = [
  { icon: Laptop, label: 'Electronics', sub: 'Up to 12%' },
  { icon: Shirt, label: 'Fashion', sub: 'Up to 18%' },
  { icon: Sparkles, label: 'Beauty', sub: 'Up to 22%' },
  { icon: Home, label: 'Home & Living', sub: 'Up to 15%' },
  { icon: Gamepad2, label: 'Gaming', sub: 'Up to 10%' },
  { icon: BookOpen, label: 'Courses', sub: 'Up to 40%' },
  { icon: Dumbbell, label: 'Fitness', sub: 'Up to 20%' },
  { icon: Package, label: 'Software', sub: 'Up to 35%' },
];

const trendingProducts = [
  { name: 'Sony WH-1000XM5 Headphones', brand: 'Sony', commission: '8%', earnings: '$28.00', rating: 4.9, reviews: '12.4K', image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { name: 'Nike Air Max 270', brand: 'Nike', commission: '12%', earnings: '$14.40', rating: 4.8, reviews: '8.2K', image: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { name: 'Adobe Creative Cloud', brand: 'Adobe', commission: '30%', earnings: '$18.00', rating: 4.7, reviews: '5.8K', image: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { name: 'Instant Pot Duo 7-in-1', brand: 'Instant Brands', commission: '6%', earnings: '$5.99', rating: 4.9, reviews: '20.1K', image: 'https://images.pexels.com/photos/4259707/pexels-photo-4259707.jpeg?auto=compress&cs=tinysrgb&w=400' },
];

export default function MarketplacePreview() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-14 gap-6">
          <div>
            <p className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-4">Marketplace</p>
            <h2 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
              10,000+ products. One dashboard.
            </h2>
            <p className="text-lg text-gray-500 max-w-xl">
              Browse by category, filter by commission rate, and get your affiliate link in one click.
            </p>
          </div>
          <Link
            href="/marketplace"
            className="inline-flex items-center gap-2 px-5 py-2.5 border border-gray-300 text-gray-800 font-medium rounded-xl hover:bg-gray-50 transition-colors text-sm whitespace-nowrap self-start lg:self-auto"
          >
            View all products <ArrowRight size={15} />
          </Link>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5 mb-14">
          {categories.map((cat) => (
            <Link
              key={cat.label}
              href="/marketplace"
              className="flex flex-col items-center p-4 rounded-2xl border border-gray-100 bg-gray-50 hover:bg-white hover:border-gray-200 hover:shadow-sm transition-all text-center group"
            >
              <cat.icon size={20} className="text-gray-500 mb-2.5 group-hover:text-gray-700 transition-colors" />
              <span className="text-xs font-semibold text-gray-800 mb-1">{cat.label}</span>
              <span className="text-xs text-gray-400">{cat.sub}</span>
            </Link>
          ))}
        </div>

        {/* Product Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {trendingProducts.map((product) => (
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
                <h4 className="text-sm font-semibold text-gray-900 leading-snug mb-3 line-clamp-2">{product.name}</h4>
                <div className="flex items-center gap-1 mb-4">
                  <Star size={12} className="text-amber-400 fill-amber-400" />
                  <span className="text-xs font-medium text-gray-700">{product.rating}</span>
                  <span className="text-xs text-gray-400">({product.reviews})</span>
                </div>
                <div className="flex items-end justify-between pt-3 border-t border-gray-50">
                  <div>
                    <p className="text-xs text-gray-400">Commission</p>
                    <p className="text-base font-bold text-gray-900">{product.commission}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400">Per sale</p>
                    <p className="text-base font-bold text-emerald-600">{product.earnings}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
