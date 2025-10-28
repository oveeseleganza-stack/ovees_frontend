import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getPreviousOrders, getCartFromCookie, setPendingReorder } from '../utils/cartStorage'

const OrderHistory = () => {
  const navigate = useNavigate()
  const previousOrders = getPreviousOrders()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedOrderItems, setSelectedOrderItems] = useState([])

  const handleReorder = (items) => {
    const currentCart = getCartFromCookie()
    if (currentCart && currentCart.length > 0) {
      setSelectedOrderItems(items)
      setDialogOpen(true)
    } else {
      setPendingReorder(items, 'replace')
      navigate('/cart')
    }
  }

  const applyReorder = (mode) => {
    setPendingReorder(selectedOrderItems, mode)
    setDialogOpen(false)
    navigate('/cart')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-teal-600 text-white p-4 flex justify-between items-center sticky top-0 z-10 shadow-md">
        <h2 className="text-xl font-bold">Attempted to WhatsApp Orders history</h2>
        <button onClick={() => navigate('/')} className="text-white hover:text-gray-200 transition">
          Home
        </button>
      </header>

      <main className="container mx-auto px-2 sm:px-4 py-6 sm:py-12">
        {previousOrders.length === 0 ? (
          <div className="text-center py-20 text-gray-500">No previous orders found.</div>
        ) : (
          <div className="space-y-6">
            {previousOrders.map((order) => {
              const orderTotal = order.items.reduce((sum, item) => {
                const price = item.offer_price || item.normal_price || item.price || 0
                return sum + price * item.quantity
              }, 0)
              return (
                <div key={order.id} className="border rounded-lg p-4 bg-white shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-medium mb-1">Order Date</p>
                      <p className="text-sm font-semibold text-gray-800">{new Date(order.timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                      <p className="text-xs text-gray-500">{new Date(order.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500 uppercase font-medium mb-1">Total</p>
                      <p className="text-lg font-bold text-teal-600">₹{orderTotal.toFixed(2)}</p>
                      <p className="text-xs text-gray-500">{order.items.length} item{order.items.length > 1 ? 's' : ''}</p>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-md p-3 mb-3">
                    {order.items.map((item, idx) => {
                      const itemPrice = item.offer_price || item.normal_price || item.price || 0
                      return (
                        <div key={item.id} className={`flex justify-between items-center py-2 ${idx !== order.items.length - 1 ? 'border-b border-gray-200' : ''}`}>
                          <div className="flex items-center gap-2 flex-1">
                            {item.images?.[0] && (
                              <img src={item.images[0]} alt={item.name} className="w-10 h-10 object-cover rounded mr-2" />
                            )}
                            <div>
                              <p className="text-sm font-medium text-gray-900">{item.name}</p>
                              <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                            </div>
                          </div>
                          <span className="text-sm font-semibold text-gray-700">₹{(itemPrice * item.quantity).toFixed(2)}</span>
                        </div>
                      )
                    })}
                  </div>
                  {/* <div className="flex justify-end">
                    <button
                      onClick={() => handleReorder(order.items)}
                      className="px-4 py-2 rounded-md bg-teal-600 text-white text-sm font-semibold hover:bg-teal-700 transition"
                    >
                      Reorder
                    </button>
                  </div> */}
                </div>
              )
            })}
          </div>
        )}
      </main>

      {/* {dialogOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Cart has items</h3>
            <p className="text-sm text-gray-600 mb-4">Do you want to add these items to your existing cart or start a new order?</p>
            <div className="flex flex-col sm:flex-row gap-2 justify-end">
              <button
                onClick={() => applyReorder('merge')}
                className="px-4 py-2 rounded-md bg-gray-100 text-gray-800 text-sm font-semibold hover:bg-gray-200 transition"
              >
                Add to existing
              </button>
              <button
                onClick={() => applyReorder('replace')}
                className="px-4 py-2 rounded-md bg-teal-600 text-white text-sm font-semibold hover:bg-teal-700 transition"
              >
                Start new order
              </button>
              <button
                onClick={() => setDialogOpen(false)}
                className="px-3 py-2 rounded-md text-sm text-gray-500 hover:text-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )} */}
    </div>
  )
}

export default OrderHistory
