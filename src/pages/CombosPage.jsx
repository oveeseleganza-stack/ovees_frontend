import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { X } from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import ProductDetailModal from '../components/ProductDetailModal'
import { fetchCombos } from '../services/api'

const CombosPage = ({ addToCart, cartItems = [] }) => {
  const navigate = useNavigate()
  const [combos, setCombos] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedProduct, setSelectedProduct] = useState(null)

  useEffect(() => {
    const loadCombos = async () => {
      try {
        const response = await fetchCombos(1, 100, true)
        const data = response.items || []
        setCombos(data)
        console.log(`✅ Loaded ${data.length} combos`)
      } catch (err) {
        console.error('Error fetching combos:', err)
      } finally {
        setLoading(false)
      }
    }
    loadCombos()
  }, [])

  const handleAddComboToCart = (combo) => {
    addToCart({
      id: `combo-${combo.id}`,
      name: combo.name,
      price: combo.combo_price,
      images: combo.products[0]?.product.images || ['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=400&fit=crop'],
      stock_quantity: Math.min(...combo.products.map(p => p.product.stock_quantity)),
      is_combo: true,
      combo_products: combo.products.map(p => ({
        id: p.product.id,
        name: p.product.name,
        quantity: p.quantity,
        price: p.product.price
      }))
    }, 1)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* <Header cartCount={cartItems.length} addToCart={addToCart} /> */}
      
      <main className="container mx-auto px-2 sm:px-4 py-6 sm:py-12">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800">💍 Special Combos</h1>
          <button
            onClick={() => navigate('/')}
            className="p-2 hover:bg-gray-200 rounded-full transition"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Loading...</p>
          </div>
        ) : combos.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No combos found.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {combos.map((combo) => (
              <div key={combo.id} className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">{combo.name}</h3>
                    <p className="text-sm text-gray-500">{combo.description}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-bold text-gray-900">₹{combo.combo_price}</span>
                    <p className="text-xs text-gray-500">
                      Save ₹{combo.products.reduce((sum, p) => sum + p.product.price * p.quantity, 0) - combo.combo_price}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                  {combo.products.map((item) => (
                    <div key={item.product.id} className="border p-2 rounded-md">
                      <img 
                        src={item.product.images[0] || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=400&fit=crop'} 
                        alt={item.product.name} 
                        className="w-full h-24 object-cover rounded-md mb-2"
                        loading="lazy"
                        decoding="async"
                      />
                      <p className="text-sm font-medium text-gray-700">{item.product.name}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                      <p className="text-xs font-semibold text-gray-900">₹{item.product.price}</p>
                    </div>
                  ))}
                </div>
                <button 
                  onClick={() => handleAddComboToCart(combo)}
                  className="w-full bg-emerald-500 text-white py-2 rounded-md hover:bg-emerald-600 transition font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
                  disabled={combo.products.some(p => p.product.stock_quantity === 0)}
                >
                  {combo.products.every(p => p.product.stock_quantity > 0) ? 'ADD COMBO TO CART' : 'OUT OF STOCK'}
                </button>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />

      {selectedProduct && (
        <ProductDetailModal 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)}
          onAddToCart={addToCart}
        />
      )}
    </div>
  )
}

export default CombosPage
