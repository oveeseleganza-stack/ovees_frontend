import React, { useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import HeroSection from '../components/Herosession'
import ProductCard from '../components/ProductCard'
import { ShoppingCart, User, Search, Menu, ChevronDown, Star, Heart } from 'lucide-react'

const Home = () => {
  const [activeCategory, setActiveCategory] = useState('all')

  const categories = [
    { name: 'Platinum', image: 'public/items/i1.jpg' },
    { name: 'Golden Neckle', image: 'public/items/i2.jpg' },
    { name: 'Shosle', image: 'public/items/i3.jpg' },
    { name: 'Chatty', image: 'public/items/i4.jpg' },
    { name: 'Return', image: 'public/items/i1.jpg' },
    { name: 'Bride', image: 'public/items/i6.jpg' },
    { name: 'Necklace', image: 'public/items/i7.jpg' }
  ]

  const superSaverProducts = [
    { id: 1, name: 'B Natural Mixed Fruit Juice', price: 213, originalPrice: 999, discount: 52, image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop' },
    { id: 2, name: 'Han Fruit White Protein 80+1 legs', price: 215, originalPrice: 891, discount: 50, image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&h=400&fit=crop' },
    { id: 3, name: 'Daz Charline Shoes 200 g', price: 213, originalPrice: 999, discount: 30, image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=400&fit=crop' },
    { id: 4, name: 'Soap Pagal by Charitra 200 g', price: 81, originalPrice: 999, discount: 42, image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&h=400&fit=crop' },
    { id: 5, name: 'Aashirvaad Chocolate Thicker Syrup', price: 214, originalPrice: 1040, discount: 50, image: 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=400&h=400&fit=crop' }
  ]

  const necklaces = [
    { id: 1, name: 'Necklace 1', price: 201, originalPrice: 561, discount: 52, image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=400&fit=crop' },
    { id: 2, name: 'Necklace 2', price: 272, originalPrice: 951, discount: 50, image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&h=400&fit=crop' },
    { id: 3, name: 'Necklace 3', price: 218, originalPrice: 999, discount: 30, image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&h=400&fit=crop' },
    { id: 4, name: 'Necklace 4', price: 211, originalPrice: 999, discount: 30, image: 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=400&h=400&fit=crop' },
    { id: 5, name: 'Necklace 5', price: 213, originalPrice: 999, discount: 50, image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop' }
  ]

  const coldDrinks = [
    { id: 1, name: 'B Natural Mixed Fruit Juice', price: 213, originalPrice: 1040, discount: 52, image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=400&fit=crop' },
    { id: 2, name: 'Slazia 100% Tender Coconut Water', price: 118, originalPrice: 995, discount: 52, image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&h=400&fit=crop' },
    { id: 3, name: 'Basant Reshampatti Water 5 L', price: 71, discount: 52, image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&h=400&fit=crop' },
    { id: 4, name: 'Sting Energy Drink Pack of 2', price: 219, originalPrice: 999, discount: 52, image: 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=400&h=400&fit=crop' },
    { id: 5, name: 'Mission Manigo Drink 5 L', price: 212, originalPrice: 875, discount: 52, image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop' }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 px-4 text-center text-sm">
        Flatburg In 60 minutes!
      </div>
      <Header />
      <HeroSection />
      <main className="container mx-auto px-4 py-12">
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
      <Footer />
    </div>
  )
}

export default Home