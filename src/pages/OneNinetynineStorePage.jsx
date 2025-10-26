import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { X } from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import ProductCard from '../components/ProductCard'
import ProductDetailModal from '../components/ProductDetailModal'
import { fetchOneNinetyNineStore } from '../services/api'

const OneNinetynineStorePage = ({ addToCart, cartItems = [] }) => {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedProduct, setSelectedProduct] = useState(null)

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await fetchOneNinetyNineStore(1, 100)
        const data = response.items || []
        setProducts(data)
        console.log(`✅ Loaded ${data.length} products from 199 Store`)
      } catch (err) {
        console.error('Error fetching 199 Store products:', err)
      } finally {
        setLoading(false)
      }
    }
    loadProducts()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* <Header cartCount={cartItems.length} addToCart={addToCart} /> */}
      
      <main className="container mx-auto px-2 sm:px-4 py-6 sm:py-12">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800">✨ Under ₹199</h1>
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
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No products found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-6">
            {products.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product}
                onProductClick={() => setSelectedProduct(product)}
                onAddToCart={addToCart}
                cartItems={cartItems}
              />
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

export default OneNinetynineStorePage
