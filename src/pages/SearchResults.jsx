import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { searchProducts, fetchProducts } from '../services/api'
import ProductCard from '../components/ProductCard'
import ProductCardSkeleton from '../components/ProductCardSkeleton'
import ProductDetailModal from '../components/ProductDetailModal'
import { Loader2 } from 'lucide-react'

const SearchResults = ({ addToCart }) => {
  const [results, setResults] = useState([])
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const location = useLocation()
  const navigate = useNavigate()

  // Extract query from URL
  const query = new URLSearchParams(location.search).get('q') || ''

  // Fetch search results
  useEffect(() => {
    const fetchResults = async () => {
      if (!query) return
      setLoading(true)
      setError(null)
      try {
        const response = await searchProducts(query, 1, 20, true)
        const data = response.items || []
        setResults(data)
        console.log(`✅ Loaded ${data.length} search results for "${query}"`)

        // Fetch recommendations (same category as first result or similar price)
        if (data.length > 0) {
          const firstResult = data[0]
          const recResponse = await fetchProducts(1, 5, true)
          const recData = recResponse.items || []
          const price = firstResult.offer_price || firstResult.normal_price || firstResult.price
          const filteredRecs = recData.filter(
            (p) => {
              const pPrice = p.offer_price || p.normal_price || p.price
              return p.id !== firstResult.id &&
                (p.category_id === firstResult.category_id ||
                  Math.abs(pPrice - price) <= 50)
            }
          ).slice(0, 3)
          setRecommendations(filteredRecs)
        }
      } catch (err) {
        setError('Failed to load search results. Please try again.')
        console.error('Error fetching search results:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchResults()
  }, [query])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 px-4 text-center text-sm">
        Flatburg In 60 minutes!
      </div>
      <main className="container mx-auto px-2 sm:px-4 py-6 sm:py-12">
        {/* Search Results Section */}
        <section className="mb-8 sm:mb-16">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 px-2">
            Search Results for "<span className="text-teal-500">{query}</span>"
          </h2>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {loading && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-6">
              {Array.from({ length: 20 }).map((_, index) => (
                <ProductCardSkeleton key={`search-skeleton-${index}`} />
              ))}
            </div>
          )}

          {!loading && results.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No products found for "{query}".</p>
              <button
                onClick={() => navigate('/')}
                className="mt-4 text-teal-600 hover:text-teal-700 font-medium"
              >
                Back to Home
              </button>
            </div>
          )}

          {!loading && results.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-6">
              {results.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  onProductClick={() => setSelectedProduct(product)}
                  onAddToCart={addToCart}
                />
              ))}
            </div>
          )}
        </section>

        {/* Recommendations Section */}
        {recommendations.length > 0 && (
          <section className="mb-8 sm:mb-16">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 px-2">
              Recommended for You
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-6">
              {recommendations.map((product) => (
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
      </main>

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

export default SearchResults

