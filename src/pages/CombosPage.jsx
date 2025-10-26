import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { X, Sparkles, ShoppingCart, ArrowRight, Check } from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import ProductDetailModal from '../components/ProductDetailModal'
import { fetchCombos } from '../services/api'

const CombosPage = ({ addToCart, cartItems = [] }) => {
  const navigate = useNavigate()
  const [combos, setCombos] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [addedCombo, setAddedCombo] = useState(null)

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
    
    setAddedCombo(combo.id)
    setTimeout(() => setAddedCombo(null), 2000)
  }

  const calculateSavings = (combo) => {
    const originalTotal = combo.products.reduce((sum, p) => sum + p.product.price * p.quantity, 0)
    return originalTotal - combo.combo_price
  }

  const calculateSavingsPercent = (combo) => {
    const originalTotal = combo.products.reduce((sum, p) => sum + p.product.price * p.quantity, 0)
    return Math.round(((originalTotal - combo.combo_price) / originalTotal) * 100)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50">
      {/* <Header cartCount={cartItems.length} addToCart={addToCart} /> */}
      
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 text-white">
        <div className="absolute inset-0 bg-black opacity-5"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNiIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utb3BhY2l0eT0iLjEiLz48L2c+PC9zdmc+')] opacity-20"></div>
        
        <div className="container mx-auto px-4 py-12 sm:py-16 relative z-10">
          <button
            onClick={() => navigate('/')}
            className="absolute top-6 right-6 p-2 hover:bg-white/20 rounded-full transition-all duration-300 backdrop-blur-sm"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-4 animate-fade-in">
              <Sparkles className="w-6 h-6 text-yellow-300 animate-pulse" />
              <span className="text-sm font-semibold tracking-wide uppercase">Exclusive Deals</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 animate-slide-up">
              Special Combo Offers
            </h1>
            <p className="text-lg sm:text-xl text-emerald-50 animate-slide-up" style={{ animationDelay: '0.1s' }}>
              Curated bundles designed to give you the best value. Save more when you buy together!
            </p>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8 sm:py-12">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-2xl shadow-lg p-6 animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {[1, 2, 3].map((j) => (
                    <div key={j} className="h-32 bg-gray-200 rounded-lg"></div>
                  ))}
                </div>
                <div className="h-12 bg-gray-200 rounded-lg"></div>
              </div>
            ))}
          </div>
        ) : combos.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-block p-6 bg-white rounded-2xl shadow-lg">
              <Sparkles className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg font-medium">No combo deals available right now.</p>
              <p className="text-gray-400 text-sm mt-2">Check back soon for exciting offers!</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {combos.map((combo, index) => {
              const savings = calculateSavings(combo)
              const savingsPercent = calculateSavingsPercent(combo)
              const isOutOfStock = combo.products.some(p => p.product.stock_quantity === 0)
              const isAdded = addedCombo === combo.id

              return (
                <div 
                  key={combo.id} 
                  className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden animate-fade-in-up border border-gray-100"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Badge */}
                  <div className="relative bg-gradient-to-r from-amber-400 to-orange-400 px-6 py-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-white animate-pulse" />
                        <span className="text-white font-bold text-sm uppercase tracking-wide">
                          Save {savingsPercent}%
                        </span>
                      </div>
                      <span className="text-white font-semibold text-sm">
                        ₹{savings} OFF
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    {/* Header */}
                    <div className="mb-6">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors">
                        {combo.name}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {combo.description}
                      </p>
                    </div>

                    {/* Products Grid */}
                    <div className="grid grid-cols-3 gap-3 mb-6">
                      {combo.products.map((item, idx) => (
                        <div 
                          key={item.product.id} 
                          className="relative group/item bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-3 hover:shadow-md transition-all duration-300 hover:-translate-y-1 border border-gray-200"
                          style={{ animationDelay: `${idx * 0.05}s` }}
                        >
                          <div className="relative mb-2 overflow-hidden rounded-lg bg-white p-2">
                            <img 
                              src={item.product.images[0] || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=400&fit=crop'} 
                              alt={item.product.name} 
                              className="w-full h-20 object-contain group-hover/item:scale-110 transition-transform duration-500"
                              loading="lazy"
                              decoding="async"
                            />
                          </div>
                          <p className="text-xs font-semibold text-gray-800 mb-1 line-clamp-2">
                            {item.product.name}
                          </p>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-500">Qty: {item.quantity}</span>
                            <span className="font-bold text-emerald-600">₹{item.product.price}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Price Section */}
                    <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-4 mb-4 border border-emerald-100">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Combo Price</p>
                          <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-emerald-600">
                              ₹{combo.combo_price}
                            </span>
                            <span className="text-lg text-gray-400 line-through">
                              ₹{combo.products.reduce((sum, p) => sum + p.product.price * p.quantity, 0)}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                            <Check className="w-3 h-3" />
                            Best Deal
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Add to Cart Button */}
                    <button 
                      onClick={() => handleAddComboToCart(combo)}
                      disabled={isOutOfStock}
                      className={`
                        w-full py-4 rounded-xl font-bold text-sm uppercase tracking-wide
                        transition-all duration-300 transform
                        flex items-center justify-center gap-2
                        ${isOutOfStock 
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                          : isAdded
                          ? 'bg-green-500 text-white scale-95'
                          : 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700 hover:shadow-lg hover:-translate-y-0.5 active:scale-95'
                        }
                      `}
                    >
                      {isOutOfStock ? (
                        'Out of Stock'
                      ) : isAdded ? (
                        <>
                          <Check className="w-5 h-5" />
                          Added to Cart
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="w-5 h-5" />
                          Add Combo to Cart
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )
            })}
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

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.8s ease-out;
          animation-fill-mode: both;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out;
          animation-fill-mode: both;
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  )
}

export default CombosPage