import { Package, Laptop, Shirt, Sparkles, Home, Gamepad2, Dumbbell, Tag } from 'lucide-react';

export interface Product {
  id: number;
  name: string;
  brand: string;
  category: string;
  commission: number;
  price: number;
  earnings: number;
  rating: number;
  reviews: number;
  image: string;
  verified: boolean;
}

export const categories = [
  { id: 'all', label: 'All Products', icon: Package },
  { id: 'electronics', label: 'Electronics', icon: Laptop },
  { id: 'fashion', label: 'Fashion', icon: Shirt },
  { id: 'beauty', label: 'Beauty', icon: Sparkles },
  { id: 'home & kitchen', label: 'Home & Kitchen', icon: Home },
  { id: 'fitness', label: 'Fitness', icon: Dumbbell },
  { id: 'accessories', label: 'Accessories', icon: Tag },
  { id: 'gaming', label: 'Gaming', icon: Gamepad2 },
  { id: 'software & services', label: 'Software & Services', icon: Package },
];

export const products: Product[] = [
  { id: 1, name: 'Sony WH-1000XM5 Wireless Headphones', brand: 'Sony', category: 'electronics', commission: 8, price: 349.99, earnings: 28.0, rating: 4.9, reviews: 12400, image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=500', verified: true },
  { id: 2, name: 'Apple MacBook Pro 14" M3 Chip', brand: 'Apple', category: 'electronics', commission: 3, price: 1999, earnings: 59.97, rating: 4.9, reviews: 9600, image: 'https://images.pexels.com/photos/812264/pexels-photo-812264.jpeg?auto=compress&cs=tinysrgb&w=500', verified: true },
  { id: 3, name: 'Samsung 65" QLED 4K Smart TV', brand: 'Samsung', category: 'electronics', commission: 5, price: 1749, earnings: 87.45, rating: 4.8, reviews: 4200, image: 'https://images.pexels.com/photos/6976094/pexels-photo-6976094.jpeg?auto=compress&cs=tinysrgb&w=500', verified: true },
  { id: 4, name: 'Canon EOS R6 Mark II Mirrorless Camera', brand: 'Canon', category: 'electronics', commission: 4, price: 2499, earnings: 99.96, rating: 4.8, reviews: 2800, image: 'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=500', verified: true },
  { id: 5, name: 'Bose QuietComfort 45 Headphones', brand: 'Bose', category: 'electronics', commission: 7, price: 279, earnings: 19.53, rating: 4.7, reviews: 8900, image: 'https://images.pexels.com/photos/3394666/pexels-photo-3394666.jpeg?auto=compress&cs=tinysrgb&w=500', verified: true },
  { id: 6, name: 'Nike Air Max 270 React Running Shoes', brand: 'Nike', category: 'fashion', commission: 12, price: 120, earnings: 14.4, rating: 4.8, reviews: 8200, image: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=500', verified: true },
  { id: 7, name: "Levi's 511 Slim Fit Stretch Jeans", brand: "Levi's", category: 'fashion', commission: 15, price: 69.5, earnings: 10.43, rating: 4.6, reviews: 18400, image: 'https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg?auto=compress&cs=tinysrgb&w=500', verified: false },
  { id: 8, name: 'Adidas Ultraboost 23 Running Shoes', brand: 'Adidas', category: 'fashion', commission: 10, price: 180, earnings: 18.0, rating: 4.7, reviews: 6300, image: 'https://images.pexels.com/photos/1456706/pexels-photo-1456706.jpeg?auto=compress&cs=tinysrgb&w=500', verified: true },
  { id: 9, name: 'Ray-Ban Aviator Classic Sunglasses', brand: 'Ray-Ban', category: 'fashion', commission: 18, price: 150, earnings: 27.0, rating: 4.8, reviews: 11200, image: 'https://images.pexels.com/photos/701877/pexels-photo-701877.jpeg?auto=compress&cs=tinysrgb&w=500', verified: true },
  { id: 10, name: 'Charlotte Tilbury Hollywood Glow Kit', brand: 'Charlotte Tilbury', category: 'beauty', commission: 20, price: 75, earnings: 15.0, rating: 4.7, reviews: 6900, image: 'https://images.pexels.com/photos/2587370/pexels-photo-2587370.jpeg?auto=compress&cs=tinysrgb&w=500', verified: true },
  { id: 11, name: 'Dyson Airwrap Complete Multi-Styler', brand: 'Dyson', category: 'beauty', commission: 8, price: 599, earnings: 47.92, rating: 4.8, reviews: 4800, image: 'https://images.pexels.com/photos/3997379/pexels-photo-3997379.jpeg?auto=compress&cs=tinysrgb&w=500', verified: true },
  { id: 12, name: 'Fenty Beauty Pro Filt\'r Foundation', brand: 'Fenty Beauty', category: 'beauty', commission: 18, price: 60, earnings: 10.8, rating: 4.9, reviews: 15600, image: 'https://images.pexels.com/photos/2536965/pexels-photo-2536965.jpeg?auto=compress&cs=tinysrgb&w=500', verified: true },
  { id: 13, name: 'Dyson V15 Detect Absolute Vacuum', brand: 'Dyson', category: 'home', commission: 6, price: 699, earnings: 41.94, rating: 4.9, reviews: 3100, image: 'https://images.pexels.com/photos/4108715/pexels-photo-4108715.jpeg?auto=compress&cs=tinysrgb&w=500', verified: true },
  { id: 14, name: 'Instant Pot Duo 7-in-1 Electric Cooker', brand: 'Instant Brands', category: 'home', commission: 6, price: 99.95, earnings: 5.99, rating: 4.9, reviews: 20100, image: 'https://images.pexels.com/photos/4259707/pexels-photo-4259707.jpeg?auto=compress&cs=tinysrgb&w=500', verified: true },
  { id: 15, name: 'Philips Hue Smart Lighting Starter Kit', brand: 'Philips', category: 'home', commission: 8, price: 199.99, earnings: 15.99, rating: 4.7, reviews: 12600, image: 'https://images.pexels.com/photos/1125137/pexels-photo-1125137.jpeg?auto=compress&cs=tinysrgb&w=500', verified: true },
  { id: 16, name: 'PlayStation 5 Digital Edition Console', brand: 'Sony', category: 'gaming', commission: 4, price: 399, earnings: 15.96, rating: 4.9, reviews: 20800, image: 'https://images.pexels.com/photos/4792509/pexels-photo-4792509.jpeg?auto=compress&cs=tinysrgb&w=500', verified: true },
  { id: 17, name: 'Xbox Game Pass Ultimate 12 Month', brand: 'Microsoft', category: 'gaming', commission: 25, price: 139.99, earnings: 34.97, rating: 4.7, reviews: 9300, image: 'https://images.pexels.com/photos/1777761/pexels-photo-1777761.jpeg?auto=compress&cs=tinysrgb&w=500', verified: true },
  { id: 18, name: 'Razer BlackWidow V4 Pro Keyboard', brand: 'Razer', category: 'gaming', commission: 10, price: 199.99, earnings: 19.99, rating: 4.6, reviews: 5700, image: 'https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg?auto=compress&cs=tinysrgb&w=500', verified: true },
  { id: 19, name: 'The Complete Web Development Bootcamp', brand: 'Udemy', category: 'courses', commission: 40, price: 89.99, earnings: 36.0, rating: 4.8, reviews: 14200, image: 'https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=500', verified: true },
  { id: 20, name: 'Python for Data Science & ML', brand: 'Coursera', category: 'courses', commission: 35, price: 79.99, earnings: 27.99, rating: 4.7, reviews: 8600, image: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=500', verified: true },
  { id: 21, name: 'AWS Cloud Practitioner Prep Course', brand: 'A Cloud Guru', category: 'courses', commission: 35, price: 99.99, earnings: 34.97, rating: 4.8, reviews: 5300, image: 'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=500', verified: true },
  { id: 22, name: 'Peloton Bike+ Smart Exercise Bike', brand: 'Peloton', category: 'fitness', commission: 5, price: 2495, earnings: 124.75, rating: 4.6, reviews: 2400, image: 'https://images.pexels.com/photos/4162579/pexels-photo-4162579.jpeg?auto=compress&cs=tinysrgb&w=500', verified: true },
  { id: 23, name: 'Bowflex SelectTech 552 Dumbbells', brand: 'Bowflex', category: 'fitness', commission: 8, price: 449, earnings: 35.92, rating: 4.8, reviews: 8900, image: 'https://images.pexels.com/photos/416778/pexels-photo-416778.jpeg?auto=compress&cs=tinysrgb&w=500', verified: true },
  { id: 24, name: 'WHOOP 4.0 Fitness & Health Tracker', brand: 'WHOOP', category: 'fitness', commission: 20, price: 239, earnings: 47.8, rating: 4.5, reviews: 6100, image: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=500', verified: true },
  { id: 25, name: 'Adobe Creative Cloud All Apps', brand: 'Adobe', category: 'Adobe', commission: 30, price: 59.99, earnings: 18.0, rating: 4.7, reviews: 5800, image: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=500', verified: true },
  { id: 26, name: 'Shopify Business Annual Subscription', brand: 'Shopify', category: 'software', commission: 20, price: 299, earnings: 59.8, rating: 4.8, reviews: 11100, image: 'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=500', verified: true },
  { id: 27, name: 'NordVPN 2-Year Premium Plan', brand: 'NordVPN', category: 'software', commission: 40, price: 119, earnings: 47.6, rating: 4.6, reviews: 22000, image: 'https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg?auto=compress&cs=tinysrgb&w=500', verified: true },
  { id: 28, name: 'Notion Team Workspace Annual', brand: 'Notion', category: 'software', commission: 25, price: 50, earnings: 12.5, rating: 4.8, reviews: 9400, image: 'https://images.pexels.com/photos/6804068/pexels-photo-6804068.jpeg?auto=compress&cs=tinysrgb&w=500', verified: true },
];

export const sortOptions = [
  { value: 'default', label: 'Most Popular' },
  { value: 'commission_high', label: 'Highest Commission' },
  { value: 'earnings_high', label: 'Top Earnings' },
  { value: 'rating', label: 'Best Rated' },
  { value: 'price_low', label: 'Lowest Price' },
];

export function getProductById(id: number) {
  return products.find((product) => product.id === id);
}
