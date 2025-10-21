import React from 'react'
import { Trash2, Tag, X } from 'lucide-react' // Added X to imports
import { useNavigate } from 'react-router-dom'

const CartPage = ({ cartItems, removeFromCart, updateQuantity }) => {
  const navigate = useNavigate()

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const discount = subtotal * 0.1 // 10% discount for demo
  const deliveryCharge = subtotal > 500 ? 0 : 50 // Free delivery above ₹500
  const total = subtotal - discount + deliveryCharge

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-teal-600 text-white p-4 flex justify-between items-center sticky top-0 z-10 shadow-md">
        <h2 className="text-xl font-bold">Shopping Cart</h2>
        <button
          onClick={() => navigate('/')}
          className="text-white hover:text-gray-200 transition"
        >
          <X className="w-6 h-6" /> {/* Now properly imported */}
        </button>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-2 sm:px-4 py-6 sm:py-12">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Product List */}
          <div className="w-full md:w-2/3">
            {cartItems.length === 0 ? (
              <div className="text-center py-20 text-gray-500">
                <p className="text-2xl">Your cart is empty.</p>
                <button
                  onClick={() => navigate('/')}
                  className="mt-6 text-teal-600 hover:text-teal-700 font-semibold text-lg"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between border-b pb-4"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <img
                        src={item.images?.[0] || 'https://via.placeholder.com/80'}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded"
                      />
                      <div>
                        <h3 className="text-md font-medium text-gray-800">{item.name}</h3>
                        {item.is_combo && (
                          <div className="text-sm text-gray-500 mt-1">
                            {item.combo_products.map((p) => (
                              <div key={p.id}>{`${p.name} (x${p.quantity})`}</div>
                            ))}
                          </div>
                        )}
                        <p className="text-sm text-gray-600 mt-1">₹{item.price.toFixed(2)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <select
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                        className="p-1 border border-gray-300 rounded"
                      >
                        {[...Array(10).keys()].map((i) => (
                          <option key={i + 1} value={i + 1}>{i + 1}</option>
                        ))}
                      </select>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Price Summary */}
          <div className="w-full md:w-1/3 bg-gray-50 p-4 rounded-lg shadow-inner">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Price Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Price ({cartItems.length} item{cartItems.length > 1 ? 's' : ''})</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span>-₹{discount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Charge</span>
                <span>{deliveryCharge === 0 ? 'Free' : `₹${deliveryCharge.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between font-bold text-lg mt-4">
                <span>Total Amount</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center gap-2 text-green-600">
                <Tag className="w-4 h-4" />
                <span>You will save ₹{discount.toFixed(2)} on this order</span>
              </div>
            </div>
            <div className="mt-4">
              <input
                type="text"
                placeholder="Apply Coupon"
                className="w-full p-2 border border-gray-300 rounded mb-2"
              />
              <button
                onClick={() => alert('Coupon applied! (Feature not implemented)')}
                className="w-full bg-teal-600 text-white py-2 rounded hover:bg-teal-700 transition"
              >
                Apply Coupon
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      {cartItems.length > 0 && (
        <footer className="bg-gray-100 p-4 border-t sticky bottom-0">
          <button
            onClick={() => {
              alert('Proceeding to checkout... (Feature not implemented)')
              navigate('/')
            }}
            className="w-full bg-teal-600 text-white py-3 rounded-md hover:bg-teal-700 transition font-semibold text-lg"
          >
            Proceed to Checkout (₹{total.toFixed(2)})
          </button>
        </footer>
      )}
    </div>
  )
}

export default CartPage