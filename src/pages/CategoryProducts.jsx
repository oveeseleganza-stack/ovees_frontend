import React, { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import ProductCard from '../components/ProductCard'
import ProductCardSkeleton from '../components/ProductCardSkeleton'
import ProductDetailModal from '../components/ProductDetailModal'
import { fetchProducts, fetchCategories } from '../services/api'

const CategoryProducts = ({ addToCart, cartItems = [] }) => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const categoryId = searchParams.get('id')
  const categoryName = searchParams.get('name')
  
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [categories, setCategories] = useState([])
  const observerTarget = useRef(null)
  const ITEMS_PER_PAGE = 20

  // Fetch categories for header
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategories()
        setCategories(data)
      } catch (err) {
        console.error('Failed to load categories:', err)
      }
    }
    loadCategories()
  }, [])

  // Fetch products for category
  const loadCategoryProducts = async () => {
    if (loading || !hasMore || !categoryId) return

    setLoading(true)
    try {
      const currentPage = Math.floor(products.length / ITEMS_PER_PAGE) + 1
      const response = await fetchProducts(currentPage, ITEMS_PER_PAGE, true, categoryId)
      const data = response.items || []
      const meta = response.meta || {}

      console.log(`✅ Loaded ${data.length} products for category ${categoryId} (Page ${meta.page}/${meta.total_pages})`)

      if (!meta.has_next || data.length === 0) {
        setHasMore(false)
      }

      if (data.length > 0) {
        setProducts(prev => {
          const newProducts = data.filter(newProduct =>
            !prev.some(existing => existing.id === newProduct.id)
          )
          return [...prev, ...newProducts]
        })
      }
    } catch (err) {
      console.error(`Error fetching products for category ${categoryId}:`, err)
    } finally {
      setLoading(false)
    }
  }

  // Initial load
  useEffect(() => {
    if (categoryId) {
      setProducts([])
      setHasMore(true)
      loadCategoryProducts()
    }
  }, [categoryId])

  // Intersection Observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        const target = entries[0]
        if (target.isIntersecting && hasMore && !loading) {
          console.log('📜 Loading more products...')
          loadCategoryProducts()
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
  }, [hasMore, loading, categoryId])

  if (!categoryId) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header cartCount={cartItems.length} addToCart={addToCart} setSelectedProduct={setSelectedProduct} />
        <div className="container mx-auto px-4 py-12 text-center">
          <p className="text-gray-500 text-lg">No category selected</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* <Header cartCount={cartItems.length} addToCart={addToCart} setSelectedProduct={setSelectedProduct} /> */}
      
      <main className="container mx-auto px-2 sm:px-4 py-6 sm:py-12">
        {/* Header with Back Button */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow hover:shadow-md transition"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
              {categoryName || 'Category Products'}
            </h1>
            <p className="text-sm text-gray-500 mt-1">{products.length} products found</p>
          </div>
        </div>

        {/* Products Grid */}
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

          {/* Loading Skeletons */}
          {loading && Array.from({ length: 10 }).map((_, index) => (
            <ProductCardSkeleton key={`skeleton-${index}`} />
          ))}
        </div>

        {/* Observer Target */}
        {!loading && (
          <div ref={observerTarget} className="h-10 mt-8" />
        )}

        {/* End of Products Message */}
        {!hasMore && products.length > 0 && !loading && (
          <div className="text-center py-8 text-gray-500 mt-8">
            <p>You've reached the end of products in this category!</p>
          </div>
        )}

        {/* No Products Message */}
        {!loading && products.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No products found in this category.</p>
          </div>
        )}

        {/* Initial Loading */}
        {loading && products.length === 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-6">
            {Array.from({ length: 20 }).map((_, index) => (
              <ProductCardSkeleton key={`initial-skeleton-${index}`} />
            ))}
          </div>
        )}
      </main>

      <Footer />

      {/* Product Detail Modal */}
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

export default CategoryProducts
