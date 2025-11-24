import React, { useState, useEffect, useRef } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import HeroSection from '../components/Herosession'
import BannerCards from '../components/BannerCards'
import ProductCard from '../components/ProductCard'
import ProductCardSkeleton from '../components/ProductCardSkeleton'
import { fetchProducts, fetchNinetynineStore, fetchOneNinetyNineStore, fetchCombos, fetchNewArrivals } from '../services/api'
import { Loader2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const Home = ({ addToCart, cartItems = [] }) => {
  const [allProducts, setAllProducts] = useState([])
  const [ninetynineProducts, setNinetynineProducts] = useState([])
  const [oneNinetyNineProducts, setOneNinetyNineProducts] = useState([])
  const [combos, setCombos] = useState([])
  const [newArrivals, setNewArrivals] = useState([])
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [error, setError] = useState(null)
  const [activeSection, setActiveSection] = useState(null)
  const observerTarget = useRef(null)
  const loadingRef = useRef(false)
  const currentPageRef = useRef(1)
  const ITEMS_PER_PAGE = 10
  const navigate = useNavigate()
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarProduct, setSnackbarProduct] = useState(null)

  // // Fetch 99 Store Products
  // useEffect(() => {
  //   const loadNinetynineStore = async () => {
  //     try {
  //       const response = await fetchNinetynineStore(1, 100)
  //       const data = response.items || []
  //       setNinetynineProducts(data)
  //       console.log(`Loaded ${data.length} products from 99 Store`)
  //     } catch (err) {
  //       console.error('Error fetching 99 Store:', err)
  //       setError('Failed to load 99 Store. Please try again.')
  //     }
  //   }
  //   loadNinetynineStore()
  // }, [])

  // Fetch 199 Store Products
  // useEffect(() => {
  //   const loadOneNinetyNineStore = async () => {
  //     try {
  //       const response = await fetchOneNinetyNineStore(1, 20)
  //       const data = response.items || []
  //       setOneNinetyNineProducts(data)
  //       console.log(`Loaded ${data.length} products from 199 Store`)
  //     } catch (err) {
  //       console.error('Error fetching 199 Store:', err)
  //       setError('Failed to load 199 Store. Please try again.')
  //     }
  //   }
  //   loadOneNinetyNineStore()
  // }, [])

  // Fetch Combos
  // useEffect(() => {
  //   const loadCombos = async () => {
  //     try {
  //       const response = await fetchCombos(1, 20, true)
  //       const data = response.items || []
  //       setCombos(data)
  //       console.log(`Loaded ${data.length} combos`)
  //     } catch (err) {
  //       console.error('Error fetching combos:', err)
  //       setError('Failed to load Combos. Please try again.')
  //     }
  //   }
  //   loadCombos()
  // }, [])

  // Fetch New Arrivals
  // useEffect(() => {
  //   const loadNewArrivals = async () => {
  //     try {
  //       const response = await fetchNewArrivals(1, 20, true)
  //       const data = response.items || []
  //       setNewArrivals(data)
  //       console.log(`Loaded ${data.length} new arrivals`)
  //     } catch (err) {
  //       console.error('Error fetching new arrivals:', err)
  //       setError('Failed to load New Arrivals. Please try again.')
  //     }
  //   }
  //   loadNewArrivals()
  // }, [])

  // Lazy load all products
  const loadProducts = React.useCallback(async () => {
    if (loadingRef.current || !hasMore) return

    loadingRef.current = true
    setLoading(true)
    setError(null)

    try {
      const pageToLoad = currentPageRef.current
      console.log(`Loading products: page=${pageToLoad}, page_size=${ITEMS_PER_PAGE}`)

      const response = await fetchProducts(pageToLoad, ITEMS_PER_PAGE, true)
      const data = response.items || []
      const meta = response.meta || {}

      console.log(`Loaded ${data.length} products (Page ${meta.page}/${meta.total_pages})`)

      if (!meta.has_next || data.length === 0) {
        setHasMore(false)
        console.log('No more products to load')
      } else {
        currentPageRef.current += 1
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
      console.error('Failed to load products:', err)
    } finally {
      setLoading(false)
      loadingRef.current = false
    }
  }, [hasMore])

  // Initial load
  useEffect(() => {
    loadProducts()
  }, [])

  // Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        const target = entries[0]
        if (target.isIntersecting && hasMore && !loadingRef.current) {
          console.log('Observer triggered - loading more...')
          loadProducts()
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    )

    if (observerTarget.current) {
      observer.observe(observerTarget.current)
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current)
      }
      observer.disconnect()
    }
  }, [hasMore, loadProducts])

  // Handle Combo Add to Cart
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

  // Add to Cart with Mobile Snackbar
  const handleAddToCart = (item, quantity = 1) => {
    addToCart(item, quantity)
    if (window.innerWidth < 768) {
      setSnackbarProduct(item)
      setSnackbarOpen(true)
      setTimeout(() => setSnackbarOpen(false), 2500)
    }
  }

  // Banner Card Navigation
  const handleBannerCardClick = (sectionId) => {
    switch (sectionId) {
      case 'new-arrivals':
        navigate('/new-arrivals')
        break
      case 'combos':
        navigate('/combos')
        break
      case '199-store':
        navigate('/199-store')
        break
      case '99-store':
        navigate('/99-store')
        break
      default:
        break
    }
  }

  // Get products for active section
  const getDisplayProducts = () => {
    switch (activeSection) {
      case 'new-arrivals':
        return newArrivals.map(item => item.product)
      case '99-store':
        return ninetynineProducts
      case '199-store':
        return oneNinetyNineProducts
      case 'combos':
        return combos
      default:
        return []
    }
  }

  const displayProducts = getDisplayProducts()

  return (
    <div className="min-h-screen bg-gray-50">
      <HeroSection />
      <main className="container mx-auto px-2 sm:px-4 py-6 sm:py-12">
        
        {/* Banner Cards */}
        <BannerCards onCardClick={handleBannerCardClick} />

        {/* All Products Section */}
        <section className="mb-8 sm:mb-16">
          <div className="flex items-center justify-between mb-4 sm:mb-6 px-2">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">All Products</h2>
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
                onAddToCart={handleAddToCart}
                cartItems={cartItems}
              />
            ))}

            {/* Loading Skeletons */}
            {loading && Array.from({ length: 10 }).map((_, index) => (
              <ProductCardSkeleton key={`skeleton-${index}`} />
            ))}
          </div>

          {/* Observer Target */}
          <div ref={observerTarget} className="h-10 mt-8" />

          {/* End of List */}
          {!hasMore && allProducts.length > 0 && !loading && (
            <div className="text-center py-8 text-gray-500">
              <p>You've reached the end of our products!</p>
            </div>
          )}

          {/* Empty State */}
          {!loading && allProducts.length === 0 && !error && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No products found.</p>
            </div>
          )}

          {/* Initial Load Skeletons */}
          {loading && allProducts.length === 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-6">
              {Array.from({ length: 20 }).map((_, index) => (
                <ProductCardSkeleton key={`initial-skeleton-${index}`} />
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />

      {/* Mobile Snackbar */}
      {snackbarOpen && (
        <div className="md:hidden fixed bottom-5 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-4 py-3 rounded-full shadow-lg flex items-center gap-3 z-[120] animate-fade-in min-w-[280px] justify-center">
          <span className="text-white text-sm font-medium flex items-center gap-2">
            Item added to cart!
          </span>
          <button onClick={() => setSnackbarOpen(false)} className="text-gray-400 hover:text-white">X</button>
        </div>
      )}
    </div>
  )
}

export default Home