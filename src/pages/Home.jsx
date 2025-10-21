import React, { useState, useEffect, useRef } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import HeroSection from '../components/Herosession'
import ProductCard from '../components/ProductCard'
import ProductDetailModal from '../components/ProductDetailModal'
import { fetchProducts, fetchNinetynineStore, fetchOneNinetyNineStore, fetchCombos, fetchNewArrivals } from '../services/api'
import { Loader2 } from 'lucide-react'

const Home = ({ addToCart }) => {
  const [allProducts, setAllProducts] = useState([])
  const [ninetynineProducts, setNinetynineProducts] = useState([])
  const [oneNinetyNineProducts, setOneNinetyNineProducts] = useState([])
  const [combos, setCombos] = useState([])
  const [newArrivals, setNewArrivals] = useState([])
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [error, setError] = useState(null)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const observerTarget = useRef(null)
  const ITEMS_PER_PAGE = 20

  // Fetch 99 Store Products
  useEffect(() => {
    const loadNinetynineStore = async () => {
      try {
        const data = await fetchNinetynineStore(0, 100)
        setNinetynineProducts(data)
        console.log(`✅ Loaded ${data.length} products from 99 Store`)
      } catch (err) {
        console.error('Error fetching 99 Store:', err)
        setError('Failed to load 99 Store. Please try again.')
      }
    }
    loadNinetynineStore()
  }, [])

  // Fetch 199 Store Products
  useEffect(() => {
    const loadOneNinetyNineStore = async () => {
      try {
        const data = await fetchOneNinetyNineStore(0, 3)
        setOneNinetyNineProducts(data)
        console.log(`✅ Loaded ${data.length} products from 199 Store`)
      } catch (err) {
        console.error('Error fetching 199 Store:', err)
        setError('Failed to load 199 Store. Please try again.')
      }
    }
    loadOneNinetyNineStore()
  }, [])

  // Fetch Combos
  useEffect(() => {
    const loadCombos = async () => {
      try {
        const data = await fetchCombos(0, 5, true)
        setCombos(data)
        console.log(`✅ Loaded ${data.length} combos`)
      } catch (err) {
        console.error('Error fetching combos:', err)
        setError('Failed to load Combos. Please try again.')
      }
    }
    loadCombos()
  }, [])

  // Fetch New Arrivals
  useEffect(() => {
    const loadNewArrivals = async () => {
      try {
        const data = await fetchNewArrivals(0, 5, true)
        setNewArrivals(data)
        console.log(`✅ Loaded ${data.length} new arrivals`)
      } catch (err) {
        console.error('Error fetching new arrivals:', err)
        setError('Failed to load New Arrivals. Please try again.')
      }
    }
    loadNewArrivals()
  }, [])

  // Fetch all products
  const loadProducts = async () => {
    if (loading || !hasMore) return

    setLoading(true)
    setError(null)
    
    try {
      const skip = allProducts.length
      console.log(`🔄 Loading products: skip=${skip}, limit=${ITEMS_PER_PAGE}`)
      
      const data = await fetchProducts(skip, ITEMS_PER_PAGE, true)
      
      console.log(`✅ Loaded ${data.length} products`)
      
      if (data.length === 0 || data.length < ITEMS_PER_PAGE) {
        setHasMore(false)
        console.log('🏁 No more products to load')
      }
      
      if (data.length > 0) {
        setAllProducts(prev => {
          const newProducts = data.filter(newProduct => 
            !prev.some(existing => existing.id === newProduct.id)
          )
          return [...prev, ...newProducts]
        })
      }
    } catch (err) {
      setError('Failed to load products. Please try again.')
      console.error('❌ Failed to load products:', err)
    } finally {
      setLoading(false)
    }
  }

  // Initial load for all products
  useEffect(() => {
    loadProducts()
  }, [])

  // Intersection Observer for lazy loading (all products)
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        const target = entries[0]
        if (target.isIntersecting && hasMore && !loading) {
          console.log('📜 Observer triggered - loading more...')
          loadProducts()
        }
      },
      { 
        threshold: 0.1,
        rootMargin: '100px'
      }
    )

    if (observerTarget.current) {
      observer.observe(observerTarget.current)
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current)
      }
    }
  }, [hasMore, loading])

  // Handle Add Combo to Cart
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
      
      <HeroSection />
      <main className="container mx-auto px-2 sm:px-4 py-6 sm:py-12">
        {/* New Arrivals Section */}
        {newArrivals.length > 0 && (
          <section className="mb-8 sm:mb-16 bg-green-50 rounded-xl p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4 sm:mb-6 px-2">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-200 text-green-800">
                  🆕 New Arrivals
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                  Latest Additions
                </h2>
              </div>
              <span className="text-sm text-gray-500">{newArrivals.length} items</span>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-6">
              {newArrivals.map((item) => (
                <ProductCard 
                  key={item.product.id} 
                  product={item.product}
                  onProductClick={() => setSelectedProduct(item.product)}
                  onAddToCart={addToCart}
                />
              ))}
            </div>
          </section>
        )}

        {/* 99 Store Section */}
        {ninetynineProducts.length > 0 && (
          <section className="mb-8 sm:mb-16 bg-yellow-50 rounded-xl p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4 sm:mb-6 px-2">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-200 text-yellow-800">
                  🔥 99 Store
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                  Under ₹99
                </h2>
              </div>
              <span className="text-sm text-gray-500">{ninetynineProducts.length} items</span>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-6">
              {ninetynineProducts.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  onProductClick={() => setSelectedProduct(product)}
                  onAddToCart={addToCart}
                />
              ))}
            </div>
          </section>
        )}

        {/* 199 Store Section */}
        {oneNinetyNineProducts.length > 0 && (
          <section className="mb-8 sm:mb-16 bg-blue-50 rounded-xl p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4 sm:mb-6 px-2">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-200 text-blue-800">
                  ✨ 199 Store
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                  Under ₹199
                </h2>
              </div>
              <span className="text-sm text-gray-500">{oneNinetyNineProducts.length} items</span>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-6">
              {oneNinetyNineProducts.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  onProductClick={() => setSelectedProduct(product)}
                  onAddToCart={addToCart}
                />
              ))}
            </div>
          </section>
        )}

        {/* Combos Section */}
        {combos.length > 0 && (
          <section className="mb-8 sm:mb-16 bg-purple-50 rounded-xl p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4 sm:mb-6 px-2">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-200 text-purple-800">
                  💍 Combo Deals
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                  Special Combos
                </h2>
              </div>
              <span className="text-sm text-gray-500">{combos.length} items</span>
            </div>
            
            <div className="space-y-6">
              {combos.map((combo) => (
                <div key={combo.id} className="bg-white rounded-lg shadow-md p-4">
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
          </section>
        )}

        {/* All Products Section with Lazy Loading */}
        <section className="mb-8 sm:mb-16">
          <div className="flex items-center justify-between mb-4 sm:mb-6 px-2">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">All Products</h2>
            <span className="text-sm text-gray-500">{allProducts.length} items</span>
          </div>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-6">
            {allProducts.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onProductClick={() => setSelectedProduct(product)}
                onAddToCart={addToCart}
              />
            ))}
          </div>

          {loading && (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-teal-500" />
              <span className="ml-2 text-gray-600">Loading more products...</span>
            </div>
          )}

          {!loading && (
            <div ref={observerTarget} className="h-10" />
          )}

          {!hasMore && allProducts.length > 0 && !loading && (
            <div className="text-center py-8 text-gray-500">
              <p>You've reached the end of our products!</p>
            </div>
          )}

          {!loading && allProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No products found.</p>
            </div>
          )}
        </section>
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

export default Home