import React from 'react'
import { X, Trash2, Tag } from 'lucide-react'
import { sendCartOrderViaWhatsapp } from '../utils/cartWhatsapp'

const CartSidebar = ({ isOpen, onClose, cartItems, removeFromCart, updateQuantity }) => {
  // Pricing logic (mirrored from cart)
  const subtotal = cartItems.reduce((sum, item) => {
    const price = item.offer_price || item.normal_price || item.price || 0
    return sum + price * item.quantity
  }, 0)
  const discount = subtotal * 0.1 // 10% discount
  const deliveryCharge = subtotal > 500 ? 0 : 50 // Free delivery above ₹500
  const total = subtotal - discount + deliveryCharge

  return (
    <div className={`fixed inset-y-0 right-0 z-[100] w-full sm:w-[450px] bg-white shadow-2xl border-l transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'} hidden md:block`}>  {/* desktop only */}
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b bg-white sticky top-0 z-10">
        <h2 className="text-xl font-bold text-gray-800">My Cart ({cartItems.length})</h2>
        <button onClick={onClose} className="text-gray-600 hover:text-gray-900 transition"><X className="w-6 h-6" /></button>
      </div>
      {/* Contents */}
      <div className="flex flex-col h-[calc(100vh-4rem)] overflow-y-auto px-6 py-4">
        {cartItems.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
            <span className="text-2xl mb-3">🛒</span>
            <p className="text-lg font-medium">Your cart is empty</p>
            <button onClick={onClose} className="mt-8 px-6 py-2 rounded bg-teal-600 hover:bg-teal-700 text-white font-bold">Continue Shopping</button>
          </div>
        ) : (
          <>
            {/* Cart items */}
            <div className="flex-1 overflow-y-auto pr-1 space-y-7">
              {cartItems.map((item) => {
                const price = item.offer_price || item.normal_price || item.price || 0
                return (
                  <div key={item.id} className="flex gap-4 items-start border-b pb-3 last:border-none">
                    <img src={item?.images?.[0] || 'https://via.placeholder.com/80'} alt={item.name} className="w-20 h-20 object-cover rounded" />
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900 text-base mb-1 line-clamp-2">{item.name}</div>
                      {item.is_combo && item.combo_products && (
                        <div className="text-xs text-gray-400 mb-1">
                          {item.combo_products.map((p) => <div key={p.id}>{p.name} (x{p.quantity})</div>)}
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-gray-800">
                        {item.offer_price ? (
                          <>
                            <span className="font-bold text-lg">₹{item.offer_price.toFixed(2)}</span>
                            <span className="line-through text-gray-400 ml-1 text-sm">₹{item.normal_price.toFixed(2)}</span>
                          </>
                        ) : (
                          <span className="font-bold text-lg">₹{(item.normal_price || item.price || 0).toFixed(2)}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <select value={item.quantity} onChange={e => updateQuantity(item.id, parseInt(e.target.value))} className="p-1 border border-gray-300 rounded focus:ring-emerald-500">
                          {[...Array(10).keys()].map(i => <option key={i+1} value={i+1}>{i+1}</option>)}
                        </select>
                        <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-700 ml-1"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
            {/* Bottom summary & actions */}
            <div className="border-t pt-6 pb-2 bg-white sticky bottom-0 mt-7">
              <div className="space-y-2 text-base">
                <div className="flex justify-between"><span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between text-green-600"><span>Discount</span><span>-₹{discount.toFixed(2)}</span></div>
                <div className="flex justify-between"><span>Delivery</span><span>{deliveryCharge === 0 ? 'Free' : `₹${deliveryCharge.toFixed(2)}`}</span></div>
                <div className="flex justify-between font-black text-lg border-t pt-4 mt-3"><span>Total</span><span>₹{total.toFixed(2)}</span></div>
              </div>
              <div className="flex items-center gap-2 text-green-600 mt-2"><Tag className="w-4 h-4" /><span className="text-sm">You save ₹{discount.toFixed(2)}</span></div>
              <button
                onClick={() => sendCartOrderViaWhatsapp(cartItems, subtotal, discount, deliveryCharge, total)}
                className="w-full mt-4 bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-bold text-base shadow-lg flex items-center justify-center gap-2 transition"
                disabled={cartItems.length === 0}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-4.946 1.347l-.355.192-.368-.06a9.879 9.879 0 00-3.464.608l.564 2.173 1.888-.959a9.9 9.9 0 013.285-1.855c3.486-1.02 7.313-.542 10.159 1.34 2.846 1.882 4.481 5.009 4.481 8.296 0 .55-.047 1.1-.138 1.649l.738 1.321-2.365-.666a9.88 9.88 0 01-2.202 1.518l-.422.18-.434-.079c-1.122.308-2.298.466-3.513.466-5.335 0-9.678-4.343-9.678-9.678 0-1.747.38-3.408 1.127-4.99l.199-.424-.423-.199z" /></svg>
                Order via WhatsApp
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default CartSidebar
