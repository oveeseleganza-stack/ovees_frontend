import React from 'react'
import { Trash2, Tag, X } from 'lucide-react' // Added X to imports
import { useNavigate } from 'react-router-dom'

const CartPage = ({ cartItems, removeFromCart, updateQuantity }) => {
  const navigate = useNavigate()

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => {
    const price = item.offer_price || item.normal_price || item.price || 0
    return sum + price * item.quantity
  }, 0)
  const discount = subtotal * 0.1 // 10% discount for demo
  const deliveryCharge = subtotal > 500 ? 0 : 50 // Free delivery above ₹500
  const total = subtotal - discount + deliveryCharge

  // Handle WhatsApp checkout
  const handleWhatsAppCheckout = () => {
    // Build message with cart details
    let message = `*Order Details*\n\n`
    
    // Add items
    message += `*Items:*\n`
    cartItems.forEach((item) => {
      const price = item.offer_price || item.normal_price || item.price || 0
      message += `• ${item.name}\n`
      message += `  Qty: ${item.quantity} × ₹${price.toFixed(2)} = ₹${(price * item.quantity).toFixed(2)}\n`
      if (item.is_combo && item.combo_products) {
        item.combo_products.forEach((p) => {
          message += `  └─ ${p.name} (x${p.quantity})\n`
        })
      }
    })
    
    // Add pricing details
    message += `\n*Price Summary:*\n`
    message += `Subtotal: ₹${subtotal.toFixed(2)}\n`
    message += `Discount (10%): -₹${discount.toFixed(2)}\n`
    message += `Delivery Charge: ${deliveryCharge === 0 ? 'Free' : `₹${deliveryCharge.toFixed(2)}`}\n`
    message += `*Total: ₹${total.toFixed(2)}*\n\n`
    message += `Please confirm this order. Thank you!`

    // Encode message for URL
    const encodedMessage = encodeURIComponent(message)
    
    // WhatsApp API URL (8129690147 is the phone number)
    const whatsappUrl = `https://wa.me/918129690147?text=${encodedMessage}`
    
    // Open WhatsApp
    window.open(whatsappUrl, '_blank')
  }

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
                        <p className="text-sm text-gray-600 mt-1">
                          {item.offer_price ? (
                            <>
                              <span className="font-semibold">₹{item.offer_price.toFixed(2)}</span>
                              <span className="line-through text-gray-400 ml-2">₹{item.normal_price.toFixed(2)}</span>
                            </>
                          ) : (
                            <span className="font-semibold">₹{(item.normal_price || item.price || 0).toFixed(2)}</span>
                          )}
                        </p>
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
          <div className="w-full md:w-1/3 bg-gray-50 p-4 rounded-lg shadow-inner h-fit sticky top-20">
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
              <div className="flex justify-between font-bold text-lg mt-4 border-t pt-4">
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
            {cartItems.length > 0 && (
              <button
                onClick={handleWhatsAppCheckout}
                className="w-full bg-teal-600 text-white py-2 rounded-md hover:bg-teal-700 transition font-semibold mt-6 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-4.946 1.347l-.355.192-.368-.06a9.879 9.879 0 00-3.464.608l.564 2.173 1.888-.959a9.9 9.9 0 013.285-1.855c3.486-1.02 7.313-.542 10.159 1.34 2.846 1.882 4.481 5.009 4.481 8.296 0 .55-.047 1.1-.138 1.649l.738 1.321-2.365-.666a9.88 9.88 0 01-2.202 1.518l-.422.18-.434-.079c-1.122.308-2.298.466-3.513.466-5.335 0-9.678-4.343-9.678-9.678 0-1.747.38-3.408 1.127-4.99l.199-.424-.423-.199z"/>
                </svg>
                Order via WhatsApp
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default CartPage