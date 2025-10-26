import React from 'react'
import { Trash2, X, Tag, Clock } from 'lucide-react'

const Cart = ({ setIsCartOpen, cartItems, removeFromCart, updateQuantity }) => {
  console.log('Cart rendering with items:', cartItems)

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const discount = subtotal * 0.1 // 10% discount for demo
  const deliveryCharge = subtotal > 500 ? 0 : 50 // Free delivery above ₹500
  const total = subtotal - discount + deliveryCharge

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 z-50 flex items-center justify-center">
      <div className="bg-white w-full max-w-5xl h-[95vh] flex flex-col overflow-hidden shadow-2xl rounded-lg">
        {/* Header */}
        <div className="bg-teal-600 text-white p-4 flex justify-between items-center sticky top-0 z-10">
          <h2 className="text-xl font-bold">Shopping Cart</h2>
          <button
            onClick={() => setIsCartOpen(false)}
            className="text-white hover:text-gray-200 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-4 flex">
          {/* Product List */}
          <div className="w-full md:w-2/3 pr-4">
            {cartItems.length === 0 ? (
              <div className="text-center py-20 text-gray-500">
                <p className="text-2xl">Your cart is empty.</p>
                <button
                  onClick={() => setIsCartOpen(false)}
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
                        loading="lazy"
                        decoding="async"
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
                      <button
                        onClick={() => alert(`Saved ${item.name} for later`)}
                        className="text-blue-500 hover:text-blue-700 text-sm"
                      >
                        Save for Later
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

        {/* Sticky Footer */}
        {cartItems.length > 0 && (
          <div className="p-4 bg-gray-100 border-t sticky bottom-0">
            <button
              onClick={() => {
                alert('Proceeding to checkout... (Feature not implemented)')
                setIsCartOpen(false)
              }}
              className="w-full bg-teal-600 text-white py-3 rounded-md hover:bg-teal-700 transition font-semibold text-lg"
            >
              Proceed to Checkout (₹{total.toFixed(2)})
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Cart