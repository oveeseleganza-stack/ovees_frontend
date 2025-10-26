import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { X, Flame, Tag, TrendingDown, Percent, Sparkles, Zap } from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import ProductCard from '../components/ProductCard'
import ProductDetailModal from '../components/ProductDetailModal'
import { fetchNinetynineStore } from '../services/api'

const NinetynineStorePage = ({ addToCart, cartItems = [] }) => {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedProduct, setSelectedProduct] = useState(null)

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await fetchNinetynineStore(1, 100)
        const data = response.items || []
        setProducts(data)
        console.log(`✅ Loaded ${data.length} products from 99 Store`)
      } catch (err) {
        console.error('Error fetching 99 Store products:', err)
      } finally {
        setLoading(false)
      }
    }
    loadProducts()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      {/* <Header cartCount={cartItems.length} addToCart={addToCart} /> */}
      
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 text-white">
        <div className="absolute inset-0 bg-black opacity-5"></div>
        
        {/* Animated Fire Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-72 h-72 bg-yellow-300 rounded-full mix-blend-overlay filter blur-3xl animate-pulse-slow"></div>
          <div className="absolute top-20 right-20 w-96 h-96 bg-orange-300 rounded-full mix-blend-overlay filter blur-3xl animate-pulse-slow animation-delay-1000"></div>
          <div className="absolute bottom-10 left-1/3 w-80 h-80 bg-red-300 rounded-full mix-blend-overlay filter blur-3xl animate-pulse-slow animation-delay-2000"></div>
        </div>

        {/* Floating Price Tags */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-1/4 animate-float">
            <Tag className="w-12 h-12 text-yellow-200 opacity-30 rotate-12" />
          </div>
          <div className="absolute top-40 right-1/4 animate-float animation-delay-1000">
            <Percent className="w-10 h-10 text-yellow-200 opacity-30 -rotate-12" />
          </div>
          <div className="absolute bottom-32 left-1/3 animate-float animation-delay-2000">
            <Sparkles className="w-8 h-8 text-yellow-200 opacity-30" />
          </div>
        </div>
        
        <div className="container mx-auto px-4 py-12 sm:py-16 relative z-10">
          <button
            onClick={() => navigate('/')}
            className="absolute top-6 right-6 p-2 hover:bg-white/20 rounded-full transition-all duration-300 backdrop-blur-sm group"
          >
            <X className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
          </button>
          
          <div className="max-w-4xl">
            <div className="flex items-center gap-3 mb-4 animate-fade-in">
              <div className="relative">
                <Flame className="w-8 h-8 text-yellow-300 animate-pulse" />
                <Zap className="w-4 h-4 text-yellow-200 absolute -top-1 -right-1 animate-ping" />
              </div>
              <span className="text-sm font-bold tracking-widest uppercase bg-gradient-to-r from-yellow-400 to-orange-400 text-orange-900 px-4 py-1.5 rounded-full shadow-lg">
                Hot Deals
              </span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black mb-4 animate-slide-up">
              Under <span className="text-yellow-300">₹99</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-orange-50 mb-6 animate-slide-up leading-relaxed" style={{ animationDelay: '0.1s' }}>
              Unbeatable prices on amazing products! Shop smart, save big. Everything you need at pocket-friendly prices.
            </p>
            
            <div className="flex flex-wrap gap-3 sm:gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2.5 rounded-full border border-white/30">
                <TrendingDown className="w-5 h-5 text-yellow-300" />
                <span className="text-sm font-bold">Best Prices</span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2.5 rounded-full border border-white/30">
                <Tag className="w-5 h-5 text-yellow-300" />
                <span className="text-sm font-bold">{products.length} Items</span>
              </div>
              <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-orange-900 px-4 py-2.5 rounded-full shadow-lg font-black">
                <Flame className="w-5 h-5" />
                <span className="text-sm">Limited Time</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
          <svg className="relative block w-full h-12" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" className="fill-orange-50"></path>
          </svg>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8 sm:py-12">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-orange-100">
                  <div className="aspect-square bg-gradient-to-br from-orange-100 to-red-100"></div>
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-orange-100 rounded w-3/4"></div>
                    <div className="h-6 bg-gradient-to-r from-orange-200 to-red-200 rounded-lg w-1/2"></div>
                    <div className="h-10 bg-orange-100 rounded-lg"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-block p-8 bg-white rounded-3xl shadow-xl border-2 border-orange-100">
              <div className="relative mb-4">
                <Tag className="w-20 h-20 text-orange-300 mx-auto" />
                <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-red-400 opacity-20 blur-2xl"></div>
              </div>
              <p className="text-gray-600 text-xl font-semibold mb-2">No Products Available</p>
              <p className="text-gray-400 text-sm">Check back soon for amazing deals!</p>
            </div>
          </div>
        ) : (
          <>
            {/* Promotional Banner */}
            <div className="mb-8 relative overflow-hidden bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 rounded-2xl shadow-xl p-6 sm:p-8 border-2 border-orange-200">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNiIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utb3BhY2l0eT0iLjEiLz48L2c+PC9zdmc+')] opacity-30"></div>
              
              <div className="relative flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl">
                    <Flame className="w-10 h-10 text-yellow-300 animate-pulse" />
                  </div>
                  <div className="text-white">
                    <p className="text-3xl sm:text-4xl font-black mb-1">
                      All Under ₹99!
                    </p>
                    <p className="text-orange-100 text-sm sm:text-base">
                      Shop {products.length} affordable products
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-col items-center sm:items-end gap-2">
                  <div className="bg-yellow-400 text-orange-900 px-6 py-3 rounded-xl font-black text-xl shadow-lg animate-bounce-slow">
                    SAVE BIG!
                  </div>
                  <div className="flex items-center gap-1 text-yellow-100 text-xs">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span>Live offers</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
              {products.map((product, index) => (
                <div
                  key={product.id}
                  className="animate-fade-in-up hover-lift"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  {/* Price Badge Overlay */}
                  <div className="relative">
                    <div className="absolute -top-3 -left-3 z-10 bg-gradient-to-br from-orange-500 to-red-600 text-white px-4 py-2 rounded-xl shadow-xl transform -rotate-12 border-2 border-orange-300">
                      <div className="flex items-center gap-1">
                        <Flame className="w-4 h-4 animate-pulse" />
                        <span className="text-xs font-black">₹99</span>
                      </div>
                    </div>
                    <ProductCard 
                      product={product}
                      onProductClick={() => setSelectedProduct(product)}
                      onAddToCart={addToCart}
                      cartItems={cartItems}
                    />
                  </div>
                </div>
              ))}
            </div>
          </>
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

        @keyframes pulse-slow {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          33% {
            transform: translateY(-20px) rotate(5deg);
          }
          66% {
            transform: translateY(-10px) rotate(-5deg);
          }
        }

        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
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

        .animate-pulse-slow {
          animation: pulse-slow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }

        .animation-delay-1000 {
          animation-delay: 1s;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .hover-lift {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .hover-lift:hover {
          transform: translateY(-8px);
        }
      `}</style>
    </div>
  )
}

export default NinetynineStorePage