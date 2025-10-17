import React, { useState } from 'react';
import { ShoppingCart, User, Search, Menu, ChevronDown, Star, Heart } from 'lucide-react';

const OveesEleganza = () => {
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { name: 'Platinum', image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=300&h=300&fit=crop' },
    { name: 'Golden Neckle', image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=300&h=300&fit=crop' },
    { name: 'Shosle', image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=300&h=300&fit=crop' },
    { name: 'Chatty', image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=300&h=300&fit=crop' },
    { name: 'Return', image: 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=300&h=300&fit=crop' },
    { name: 'Bride', image: 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=300&h=300&fit=crop' },
    { name: 'Necklace', image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=300&h=300&fit=crop' }
  ];

  const superSaverProducts = [
    { id: 1, name: 'B Natural Mixed Fruit Juice', price: 213, originalPrice: 999, discount: 52, image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop' },
    { id: 2, name: 'Han Fruit White Protein 80+1 legs', price: 215, originalPrice: 891, discount: 50, image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&h=400&fit=crop' },
    { id: 3, name: 'Daz Charline Shoes 200 g', price: 213, originalPrice: 999, discount: 30, image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=400&fit=crop' },
    { id: 4, name: 'Soap Pagal by Charitra 200 g', price: 81, originalPrice: 999, discount: 42, image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&h=400&fit=crop' },
    { id: 5, name: 'Aashirvaad Chocolate Thicker Syrup', price: 214, originalPrice: 1040, discount: 50, image: 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=400&h=400&fit=crop' }
  ];

  const necklaces = [
    { id: 1, name: 'Necklace 1', price: 201, originalPrice: 561, discount: 52, image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=400&fit=crop' },
    { id: 2, name: 'Necklace 2', price: 272, originalPrice: 951, discount: 50, image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&h=400&fit=crop' },
    { id: 3, name: 'Necklace 3', price: 218, originalPrice: 999, discount: 30, image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&h=400&fit=crop' },
    { id: 4, name: 'Necklace 4', price: 211, originalPrice: 999, discount: 30, image: 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=400&h=400&fit=crop' },
    { id: 5, name: 'Necklace 5', price: 213, originalPrice: 999, discount: 50, image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop' }
  ];

  const coldDrinks = [
    { id: 1, name: 'B Natural Mixed Fruit Juice', price: 213, originalPrice: 1040, discount: 52, image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=400&fit=crop' },
    { id: 2, name: 'Slazia 100% Tender Coconut Water', price: 118, originalPrice: 995, discount: 52, image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&h=400&fit=crop' },
    { id: 3, name: 'Basant Reshampatti Water 5 L', price: 71, discount: 52, image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&h=400&fit=crop' },
    { id: 4, name: 'Sting Energy Drink Pack of 2', price: 219, originalPrice: 999, discount: 52, image: 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=400&h=400&fit=crop' },
    { id: 5, name: 'Mission Manigo Drink 5 L', price: 212, originalPrice: 875, discount: 52, image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop' }
  ];

  const ProductCard = ({ product }) => (
    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="relative">
        <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
        <span className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded-md text-sm font-semibold">
          {product.discount}% OFF
        </span>
        <button className="absolute top-2 right-2 bg-white p-2 rounded-full hover:bg-red-50 transition">
          <Heart className="w-5 h-5 text-gray-600 hover:text-red-500" />
        </button>
      </div>
      <div className="p-4">
        <h3 className="text-gray-800 font-medium mb-2 h-12 line-clamp-2">{product.name}</h3>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xl font-bold text-gray-900">₹{product.price}</span>
          {product.originalPrice && (
            <span className="text-sm text-gray-500 line-through">₹{product.originalPrice}</span>
          )}
        </div>
        <button className="w-full bg-emerald-500 text-white py-2 rounded-md hover:bg-emerald-600 transition font-medium">
          ADD
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 px-4 text-center text-sm">
        Flatburg In 60 minutes!
      </div>

      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-teal-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">O</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold">
                  <span className="text-teal-500">OVEES</span>{' '}
                  <span className="text-orange-500">ELEGANZA</span>
                </h1>
              </div>
            </div>

            <div className="flex-1 max-w-2xl mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search items..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-6">
              <button className="flex items-center gap-2 text-gray-700 hover:text-teal-600 transition">
                <User className="w-5 h-5" />
                <span className="font-medium">Login</span>
              </button>
              <button className="flex items-center gap-2 text-gray-700 hover:text-teal-600 transition">
                <ShoppingCart className="w-5 h-5" />
                <span className="font-medium">Cart</span>
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex items-center gap-8 text-sm">
            <button className="flex items-center gap-1 text-gray-700 hover:text-teal-600 transition">
              Fancy Items <ChevronDown className="w-4 h-4" />
            </button>
            <button className="flex items-center gap-1 text-gray-700 hover:text-teal-600 transition">
              Rental Jewellery <ChevronDown className="w-4 h-4" />
            </button>
            <button className="flex items-center gap-1 text-gray-700 hover:text-teal-600 transition">
              Rings <ChevronDown className="w-4 h-4" />
            </button>
            <button className="flex items-center gap-1 text-gray-700 hover:text-teal-600 transition">
              Necklaces <ChevronDown className="w-4 h-4" />
            </button>
            <button className="flex items-center gap-1 text-gray-700 hover:text-teal-600 transition">
              Bangles <ChevronDown className="w-4 h-4" />
            </button>
            <button className="flex items-center gap-1 text-gray-700 hover:text-teal-600 transition">
              Ivy Delights <ChevronDown className="w-4 h-4" />
            </button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-96 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1920&h=600&fit=crop"
          alt="Hero"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent flex items-center">
          <div className="container mx-auto px-4">
            <h2 className="text-6xl font-bold text-white mb-4">ovees</h2>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        {/* Top Categories */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">
            Shop From <span className="text-teal-500">Top Categories</span>
          </h2>
          <div className="grid grid-cols-7 gap-4">
            {categories.map((cat, idx) => (
              <div key={idx} className="text-center cursor-pointer group">
                <div className="w-full aspect-square rounded-lg overflow-hidden mb-2 shadow-md group-hover:shadow-xl transition">
                  <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-300" />
                </div>
                <p className="text-sm font-medium text-gray-700">{cat.name}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Super Saver */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">
              Supersaver <span className="text-green-500">up to 50% off</span>
            </h2>
            <button className="text-teal-600 hover:text-teal-700 font-medium">View All →</button>
          </div>
          <div className="grid grid-cols-5 gap-6">
            {superSaverProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* Necklaces */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Necklaces</h2>
            <button className="text-teal-600 hover:text-teal-700 font-medium">View All →</button>
          </div>
          <div className="grid grid-cols-5 gap-6">
            {necklaces.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* Featured Brands */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Featured Brands</h2>
            <button className="text-teal-600 hover:text-teal-700 font-medium">View All →</button>
          </div>
          <div className="grid grid-cols-3 gap-6">
            <div className="rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition cursor-pointer">
              <img src="https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&h=400&fit=crop" alt="Brand 1" className="w-full h-48 object-cover" />
            </div>
            <div className="rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition cursor-pointer">
              <img src="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&h=400&fit=crop" alt="Brand 2" className="w-full h-48 object-cover" />
            </div>
            <div className="rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition cursor-pointer">
              <img src="https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=800&h=400&fit=crop" alt="Brand 3" className="w-full h-48 object-cover" />
            </div>
          </div>
        </section>

        {/* Cold Drinks & Juices */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Cold Drinks & Juices</h2>
            <button className="text-teal-600 hover:text-teal-700 font-medium">View All →</button>
          </div>
          <div className="grid grid-cols-5 gap-6">
            {coldDrinks.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">
                <span className="text-teal-400">OVEES</span>{' '}
                <span className="text-orange-400">ELEGANZA</span>
              </h3>
              <div className="space-y-2">
                <p className="flex items-center gap-2">
                  <span>📱 Whats App</span>
                </p>
                <p>+1 202-918-2132</p>
                <p className="flex items-center gap-2 mt-4">
                  <span>📞 Call Us</span>
                </p>
                <p>+1 202-918-2132</p>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Popular Categories</h4>
              <ul className="space-y-2 text-sm">
                <li className="hover:text-teal-400 cursor-pointer">Fruits & Vegetables</li>
                <li className="hover:text-teal-400 cursor-pointer">Dairy & Breakfasts</li>
                <li className="hover:text-teal-400 cursor-pointer">Egg, Meat & Fish</li>
                <li className="hover:text-teal-400 cursor-pointer">Bath & Body</li>
                <li className="hover:text-teal-400 cursor-pointer">Beauty & Health Juliesh</li>
                <li className="hover:text-teal-400 cursor-pointer">Snacks & Munchies</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Customer Services</h4>
              <ul className="space-y-2 text-sm">
                <li className="hover:text-teal-400 cursor-pointer">About Us</li>
                <li className="hover:text-teal-400 cursor-pointer">Terms & Conditions</li>
                <li className="hover:text-teal-400 cursor-pointer">FAQ</li>
                <li className="hover:text-teal-400 cursor-pointer">Privacy Policy</li>
                <li className="hover:text-teal-400 cursor-pointer">E-waste Policy</li>
                <li className="hover:text-teal-400 cursor-pointer">Cancellation & Return Policy</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Download App</h4>
              <div className="space-y-3">
                <div className="bg-black rounded-lg px-4 py-2 cursor-pointer hover:bg-gray-800 transition">
                  <p className="text-xs">Download on the</p>
                  <p className="font-semibold">App Store</p>
                </div>
                <div className="bg-black rounded-lg px-4 py-2 cursor-pointer hover:bg-gray-800 transition">
                  <p className="text-xs">GET IT ON</p>
                  <p className="font-semibold">Google Play</p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-6 text-center text-sm">
            <p>© 2025 All rights reserved, Ovees Eleganza</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default OveesEleganza;