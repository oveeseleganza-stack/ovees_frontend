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
  const [isHeaderVisible, setIsHeaderVisible] = useState(true)
  const observerRefs = useRef({})
  const lastScrollY = useRef(0)
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

  // Handle scroll to hide/show header
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      
      if (currentScrollY > lastScrollY.current) {
        // Scrolling down - hide header
        setIsHeaderVisible(false)
      } else {
        // Scrolling up - show header
        setIsHeaderVisible(true)
      }
      
      lastScrollY.current = currentScrollY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
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

  // Handle category click
  const handleCategoryClick = (category) => {
    navigate(`/category?id=${category.id}&name=${encodeURIComponent(category.name)}`)
    setIsMenuOpen(false)
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
    <header className={`bg-gray-700 shadow-md sticky top-0 z-40 transform transition-transform duration-300 ease-in-out ${
      isHeaderVisible ? 'translate-y-0' : '-translate-y-full'
    }`}>
      {/* <div className="bg-yellow-400 text-gray-800 py-2 px-4 text-center text-xs sm:text-sm font-semibold">
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <span>🚚 Home Delivery </span>
          <span>|</span>
          <span>📍 Track your order</span>
          <span>|</span>
          <span>🛍️ All Offers</span>
        </div>
      </div> */}

      <div className="container mx-auto px-2 sm:px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
          <img src="/logoo.png" alt="Logo" className="h-10 sm:h-12" />
          <h1 className="text-xl sm:text-2xl font-bold">
            <span className="text-teal-400">OVEES</span>{' '}
            <span className="text-orange-400">ELEGANZA</span>
          </h1>
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
                placeholder="Search items..."
                className="w-full pl-10 pr-4 py-2 rounded-full bg-white border border-white focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm"
              />
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            </div>
          </form>
          {isSearchFocused && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto z-50 mt-1">
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
            className="relative flex items-center gap-2 px-3 py-2 rounded-full hover:bg-gray-700 transition"
          >
            <ShoppingCart className="w-6 h-6 text-white" />
            <span className="text-white text-sm font-medium hidden sm:inline">Cart</span>
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="sm:hidden p-2 rounded-full hover:bg-gray-700 transition"
          >
            {isMenuOpen ? <X className="w-6 h-6 text-white" /> : <Menu className="w-6 h-6 text-white" />}
          </button>
        </div>
      </div>

      {/* Desktop Category Bar - Flipkart Style */}
      <div className="hidden sm:block bg-white border-t border-gray-200 shadow-sm">
        <div className="container mx-auto px-2 sm:px-4">
          <div className="flex items-center justify-between overflow-x-auto scrollbar-hide py-2">
            {categories.map((cat) => (
              <div
                key={cat.id}
                onClick={() => handleCategoryClick(cat)}
                className="flex flex-col items-center justify-center min-w-[80px] px-3 py-2 cursor-pointer group hover:bg-gray-50 rounded-lg transition-all"
              >
                {cat.icon_url && (
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform overflow-hidden">
                    <img 
                      src={cat.icon_url} 
                      alt={cat.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                )}
                <span className="text-xs font-medium text-gray-700 text-center line-clamp-2 group-hover:text-teal-600">
                  {cat.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>  


      {/* Mobile Sidebar Menu - Slides from Left */}
      {isMenuOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30 sm:hidden"
            onClick={() => setIsMenuOpen(false)}
          />
          {/* Sidebar */}
          <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-2xl z-40 sm:hidden transform transition-transform duration-300 ease-in-out overflow-y-auto">
            {/* Close Button */}
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-bold text-gray-800">Categories</h2>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-1 hover:bg-gray-100 rounded-full transition"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>
            {/* Categories List */}
            <div className="p-4 space-y-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat)}
                  className="w-full text-left px-4 py-3 text-sm font-medium text-gray-700 bg-gray-50 rounded-lg hover:bg-teal-100 hover:text-teal-700 transition flex items-center gap-3"
                >
                  {cat.icon_url && (
                    <img 
                      src={cat.icon_url} 
                      alt={cat.name}
                      className="w-6 h-6 object-cover rounded"
                      loading="lazy"
                    />
                  )}
                  <span>{cat.name}</span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}

    </header>
  )
}

export default Header