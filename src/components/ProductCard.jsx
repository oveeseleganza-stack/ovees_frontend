import React, { useState } from 'react'
import { Heart, Minus, Plus } from 'lucide-react'

const ProductCard = ({ product, onProductClick, onAddToCart, cartItems = [] }) => {
  const [isClicked, setIsClicked] = useState(false)
  
  // Get the first image from the images array or use a placeholder
  const imageUrl = product.images && product.images.length > 0 
    ? product.images[0] 
    : 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=400&fit=crop'

  // Check if product is in cart
  const cartItem = cartItems.find(item => item.id === product.id)
  const quantityInCart = cartItem ? cartItem.quantity : 0

  // Handle Add Click with animation
  const handleAddClick = () => {
    if (typeof onAddToCart === 'function') {
      onAddToCart(product, 1)
      setIsClicked(true)
      setTimeout(() => setIsClicked(false), 300)
    }
  }

  // Handle quantity change
  const handleIncrement = (e) => {
    e.stopPropagation()
    if (typeof onAddToCart === 'function') {
      onAddToCart(product, 1)
    }
  }

  const handleDecrement = (e) => {
    e.stopPropagation()
    if (typeof onAddToCart === 'function' && quantityInCart > 0) {
      onAddToCart(product, -1)
    }
  }

  return (
    <div className={`bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${
      isClicked ? 'scale-95' : ''
    }`}>
      <div className="relative cursor-pointer" onClick={onProductClick}>
        <img src={imageUrl} alt={product.name} className="w-full h-48 object-cover" />
        {product.stock_quantity > 0 ? (
          <span className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded-md text-xs font-semibold">
            In Stock
          </span>
        ) : (
          <span className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-semibold">
            Out of Stock
          </span>
        )}
        <button className="absolute top-2 right-2 bg-white p-2 rounded-full hover:bg-red-50 transition">
          <Heart className="w-5 h-5 text-gray-600 hover:text-red-500" />
        </button>
      </div>
      <div className="p-4">
        <h3 
          className="text-gray-800 font-medium mb-2 h-12 line-clamp-2 cursor-pointer hover:text-teal-600 transition"
          onClick={onProductClick}
        >
          {product.name}
        </h3>
        {product.category && (
          <p className="text-xs text-gray-500 mb-2">{product.category.name}</p>
        )}
        <div className="flex items-center gap-2 mb-3">
          {product.offer_price ? (
            <>
              <span className="text-xl font-bold text-gray-900">₹{product.offer_price}</span>
              <span className="text-sm text-gray-500 line-through">₹{product.normal_price}</span>
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                {Math.round(((product.normal_price - product.offer_price) / product.normal_price) * 100)}% OFF
              </span>
            </>
          ) : (
            <span className="text-xl font-bold text-gray-900">₹{product.normal_price || product.price}</span>
          )}
        </div>
        {quantityInCart > 0 ? (
          <div className="flex items-center justify-between bg-emerald-50 border-2 border-emerald-500 rounded-md p-1">
            <button
              onClick={handleDecrement}
              className="bg-white hover:bg-emerald-100 text-emerald-600 w-8 h-8 rounded flex items-center justify-center transition"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="font-bold text-emerald-600 text-lg px-2">{quantityInCart}</span>
            <button
              onClick={handleIncrement}
              className="bg-emerald-500 hover:bg-emerald-600 text-white w-8 h-8 rounded flex items-center justify-center transition"
              disabled={quantityInCart >= product.stock_quantity}
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button 
            onClick={handleAddClick}
            className="w-full bg-emerald-500 text-white py-2 rounded-md hover:bg-emerald-600 active:scale-95 transition-all font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={product.stock_quantity === 0}
          >
            {product.stock_quantity > 0 ? 'ADD TO CART' : 'OUT OF STOCK'}
          </button>
        )}
      </div>
    </div>
  )
}

export default ProductCard