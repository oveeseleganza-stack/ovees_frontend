import React from 'react'
import { X, Minus, Plus, Trash2 } from 'lucide-react'

const Cart = ({ setIsCartOpen, cartItems, removeFromCart, updateQuantity }) => {
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const handleClose = () => {
    setIsCartOpen(false)
  }

  const handleUpdateQuantity = (itemId, newQuantity) => {
    updateQuantity(itemId, newQuantity)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl sm:text-2xl font-bold text-teal-500">
            Your Cart ({cartItems.length})
          </h2>
          <button onClick={handleClose} className="text-gray-500 hover:text-gray-700 transition">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        {cartItems.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">Your cart is empty.</p>
            <button
              onClick={handleClose}
              className="text-teal-600 hover:text-teal-700 font-medium"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            <ul className="mb-4 space-y-3 max-h-96 overflow-y-auto">
              {cartItems.map((item) => (
                <li key={item.id} className="flex flex-col py-3 border-b">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{item.name}</p>
                      {item.is_combo ? (
                        <div className="text-xs text-gray-500 mt-1">
                          {item.combo_products.map((p) => (
                            <p key={p.id} className="truncate">
                              - {p.name} (Qty: {p.quantity})
                            </p>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-gray-500">₹{item.price}</p>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-3 ml-4">
                      <div className="flex items-center bg-gray-100 rounded-full">
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center rounded-l-full hover:bg-gray-200"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="px-4 py-2 font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                          disabled={item.quantity >= item.stock_quantity}
                          className="w-8 h-8 flex items-center justify-center rounded-r-full hover:bg-gray-200 disabled:opacity-50"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <span className="font-semibold text-sm">₹{item.price * item.quantity}</span>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            
            <div className="flex justify-between font-bold text-lg mb-4 pt-2 border-t">
              <span>Total</span>
              <span>₹{total}</span>
            </div>
            
            <button
              onClick={() => alert('Proceeding to Checkout...')}
              className="w-full bg-emerald-500 text-white py-3 rounded-md hover:bg-emerald-600 transition font-semibold mb-3"
              disabled={cartItems.length === 0}
            >
              Checkout ₹{total}
            </button>
          </>
        )}
        
        <button
          onClick={handleClose}
          className="w-full bg-gray-200 text-gray-700 py-2 rounded-md hover:bg-gray-300 transition font-medium"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  )
}

export default Cart