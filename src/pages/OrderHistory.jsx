import React from 'react'
import { useNavigate } from 'react-router-dom'
import { getPreviousOrders } from '../utils/cartStorage'

const OrderHistory = () => {
  const navigate = useNavigate()
  const previousOrders = getPreviousOrders()

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-teal-600 text-white p-4 flex justify-between items-center sticky top-0 z-10 shadow-md">
        <h2 className="text-xl font-bold">Order History</h2>
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
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}

export default OrderHistory
