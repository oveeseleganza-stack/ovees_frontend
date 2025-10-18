import React from 'react'
import { ShoppingCart, User, Search, Menu, ChevronDown } from 'lucide-react'

const Header = () => {
  return (
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
  )
}

export default Header