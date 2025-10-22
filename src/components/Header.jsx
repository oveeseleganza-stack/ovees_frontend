import React, { useState, useEffect, useCallback, useRef } from 'react'
import { ShoppingCart, Search, Menu, X, Loader2 } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import { fetchCategories, searchProducts, fetchProducts } from '../services/api'

const Header = ({ cartCount, addToCart, setSelectedProduct }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [categoryProducts, setCategoryProducts] = useState({})
  const [loadingProducts, setLoadingProducts] = useState({})
  const [hasMoreProducts, setHasMoreProducts] = useState({})
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const observerRefs = useRef({})
  const navigate = useNavigate()
  const location = useLocation()
  const ITEMS_PER_PAGE = 10

  // Fetch categories
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategories()
        setCategories(data)
        const initialProducts = {}
        const initialLoading = {}
        const initialHasMore = {}
        data.forEach((cat) => {
          initialProducts[cat.id] = []
          initialLoading[cat.id] = false
          initialHasMore[cat.id] = true
        })
        setCategoryProducts(initialProducts)
        setLoadingProducts(initialLoading)
        setHasMoreProducts(initialHasMore)
      } catch (err) {
        console.error('Failed to load categories:', err)
      }
    }
    loadCategories()
  }, [])

  // Debounce function
  const debounce = (func, delay) => {
    let timeoutId
    return (...args) => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => func(...args), delay)
    }
  }

  // Fetch suggestions
  const fetchSuggestions = useCallback(
    debounce(async (query) => {
      if (query.length < 2) {
        setSuggestions([])
        return
      }
      try {
        const response = await searchProducts(query, 1, 5, true)
        setSuggestions(response.items || [])
      } catch (err) {
        console.error('Error fetching suggestions:', err)
      }
    }, 300),
    []
  )

  // Update suggestions on query change
  useEffect(() => {
    fetchSuggestions(searchQuery)
  }, [searchQuery, fetchSuggestions])

  // Handle search submission
  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`)
      setSearchQuery('')
      setSuggestions([])
      setIsSearchFocused(false)
      setIsMenuOpen(false)
    }
  }

  // Handle suggestion click
  const handleSuggestionClick = (product) => {
    navigate(`/search?q=${encodeURIComponent(product.name)}`)
    setSearchQuery('')
    setSuggestions([])
    setIsSearchFocused(false)
    setIsMenuOpen(false)
  }

  // Fetch products for a category
  const loadCategoryProducts = async (categoryId) => {
    if (loadingProducts[categoryId] || !hasMoreProducts[categoryId]) return

    setLoadingProducts((prev) => ({ ...prev, [categoryId]: true }))
    try {
      const currentPage = Math.floor(categoryProducts[categoryId].length / ITEMS_PER_PAGE) + 1
      const response = await fetchProducts(currentPage, ITEMS_PER_PAGE, true, categoryId)
      const data = response.items || []
      const meta = response.meta || {}
      console.log(`✅ Loaded ${data.length} products for category ${categoryId} (Page ${meta.page}/${meta.total_pages})`)
      
      if (!meta.has_next || data.length === 0) {
        setHasMoreProducts((prev) => ({ ...prev, [categoryId]: false }))
      }
      
      setCategoryProducts((prev) => ({
        ...prev,
        [categoryId]: [
          ...prev[categoryId],
          ...data.filter((newProduct) => !prev[categoryId].some((p) => p.id === newProduct.id)),
        ],
      }))
    } catch (err) {
      console.error(`Error fetching products for category ${categoryId}:`, err)
    } finally {
      setLoadingProducts((prev) => ({ ...prev, [categoryId]: false }))
    }
  }

  // Intersection Observer for lazy loading products
  useEffect(() => {
    const observers = {}
    categories.forEach((cat) => {
      observers[cat.id] = new IntersectionObserver(
        (entries) => {
          const target = entries[0]
          if (target.isIntersecting && hasMoreProducts[cat.id] && !loadingProducts[cat.id]) {
            console.log(`📜 Loading more products for category ${cat.id}`)
            loadCategoryProducts(cat.id)
          }
        },
        { threshold: 0.1, rootMargin: '100px' }
      )
      if (observerRefs.current[cat.id]) {
        observers[cat.id].observe(observerRefs.current[cat.id])
      }
    })

    return () => {
      Object.values(observers).forEach((observer) => observer.disconnect())
    }
  }, [categories, hasMoreProducts, loadingProducts])

  return (
    <header className="bg-white shadow-md sticky top-0 z-40">
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-1 px-4 text-center text-xs sm:text-sm">
        Flatburg In 60 minutes!
      </div>
      <div className="container mx-auto px-2 sm:px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="Logo" className="h-8 sm:h-10" />
          <span className="text-lg sm:text-xl font-bold text-teal-600">Ovees</span>
        </div>

        {/* Search Bar */}
        <div className="relative flex-1 max-w-md mx-4">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
              />
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            </div>
          </form>
          {isSearchFocused && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto z-50">
              {suggestions.map((product) => (
                <div
                  key={product.id}
                  onMouseDown={() => handleSuggestionClick(product)}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  <p className="text-sm font-medium text-gray-800">{product.name}</p>
                  <p className="text-xs text-gray-500">₹{product.offer_price || product.normal_price || product.price}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={() => navigate('/cart')}
            className="relative p-2 rounded-full hover:bg-gray-100 transition"
          >
            <ShoppingCart className="w-6 h-6 text-gray-600" />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="sm:hidden p-2 rounded-full hover:bg-gray-100 transition"
          >
            {isMenuOpen ? <X className="w-6 h-6 text-gray-600" /> : <Menu className="w-6 h-6 text-gray-600" />}
          </button>
        </div>
      </div>

      {/* Desktop Category Dropdown */}
      <div className="hidden sm:block bg-gray-50 border-t">
        <div className="container mx-auto px-2 sm:px-4 py-2">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <div key={cat.id} className="relative group">
                <button
                  onClick={() => {
                    setSelectedCategory(selectedCategory === cat.id ? null : cat.id)
                    if (!categoryProducts[cat.id]?.length) loadCategoryProducts(cat.id)
                  }}
                  className="px-3 py-1 text-sm font-medium text-gray-700 bg-white rounded-md hover:bg-teal-100 transition"
                >
                  {cat.name}
                </button>
                {selectedCategory === cat.id && (
                  <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-96 overflow-y-auto w-80">
                    {categoryProducts[cat.id]?.length > 0 ? (
                      <>
                        <div className="p-4 space-y-2">
                          {categoryProducts[cat.id].map((product) => (
                            <div
                              key={product.id}
                              onClick={() => {
                                setSelectedProduct(product)
                                setSelectedCategory(null)
                              }}
                              className="text-sm text-gray-800 hover:bg-gray-100 cursor-pointer px-2 py-1 rounded"
                            >
                              {product.name}
                            </div>
                          ))}
                        </div>
                        {loadingProducts[cat.id] && (
                          <div className="flex justify-center items-center py-4">
                            <Loader2 className="w-6 h-6 animate-spin text-teal-500" />
                            <span className="ml-2 text-gray-600">Loading more...</span>
                          </div>
                        )}
                        <div ref={(el) => (observerRefs.current[cat.id] = el)} className="h-10" />
                      </>
                    ) : (
                      <div className="p-4 text-center text-gray-500">
                        {loadingProducts[cat.id] ? 'Loading...' : 'No products found.'}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Category Menu */}
      {isMenuOpen && (
        <div className="sm:hidden bg-gray-50 border-t">
          <div className="container mx-auto px-2 py-2">
            <div className="space-y-2">
              {categories.map((cat) => (
                <div key={cat.id} className="relative">
                  <button
                    onClick={() => {
                      setSelectedCategory(selectedCategory === cat.id ? null : cat.id)
                      if (!categoryProducts[cat.id]?.length) loadCategoryProducts(cat.id)
                    }}
                    className="w-full text-left px-3 py-2 text-sm font-medium text-gray-700 bg-white rounded-md hover:bg-teal-100 transition"
                  >
                    {cat.name}
                  </button>
                  {selectedCategory === cat.id && (
                    <div className="mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-80 overflow-y-auto">
                      {categoryProducts[cat.id]?.length > 0 ? (
                        <>
                          <div className="p-4 space-y-2">
                            {categoryProducts[cat.id].map((product) => (
                              <div
                                key={product.id}
                                onClick={() => {
                                  setSelectedProduct(product)
                                  setSelectedCategory(null)
                                  setIsMenuOpen(false)
                                }}
                                className="text-sm text-gray-800 hover:bg-gray-100 cursor-pointer px-2 py-1 rounded"
                              >
                                {product.name}
                              </div>
                            ))}
                          </div>
                          {loadingProducts[cat.id] && (
                            <div className="flex justify-center items-center py-4">
                              <Loader2 className="w-6 h-6 animate-spin text-teal-500" />
                              <span className="ml-2 text-gray-600">Loading more...</span>
                            </div>
                          )}
                          <div ref={(el) => (observerRefs.current[cat.id] = el)} className="h-10" />
                        </>
                      ) : (
                        <div className="p-4 text-center text-gray-500">
                          {loadingProducts[cat.id] ? 'Loading...' : 'No products found.'}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

export default Header