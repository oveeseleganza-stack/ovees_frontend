import React from 'react'
import { Heart } from 'lucide-react'

const ProductCard = ({ product }) => {
  return (
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
  )
}

export default ProductCard