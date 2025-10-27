import React from 'react'
import { ShoppingCart } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const FloatingCartButton = ({ cartCount, onCartClick }) => {
  const navigate = useNavigate()

  if (cartCount === 0) return null

  // Use responsive styles: center bottom on mobile, right bottom on desktop
  // OnClick logic: desktop fire onCartClick, mobile go to /cart
  const handleClick = () => {
    if (window.innerWidth >= 768 && typeof onCartClick === 'function') {
      onCartClick()
    } else {
      navigate('/cart')
    }
  }

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-5 left-1/2 -translate-x-1/2 sm:right-6 sm:left-auto sm:translate-x-0 sm:bottom-6 bg-gradient-to-r from-teal-500 to-emerald-500 text-white px-6 py-3 rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 flex items-center gap-3 z-50 group animate-bounce-slow"
      aria-label="View Cart"
    >
      <div className="relative">
        <ShoppingCart className="w-6 h-6" />
        {cartCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
            {cartCount > 99 ? '99+' : cartCount}
          </span>
        )}
      </div>
      <span className="font-semibold ml-2">View Cart</span>
    </button>
  )
}

export default FloatingCartButton
