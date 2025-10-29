import React, { useState, useRef, useEffect } from 'react'
import { X, ChevronLeft, ChevronRight, ShoppingCart, Minus, Plus, Check, Loader2 } from 'lucide-react'
import { API_BASE_URL } from '../config/api'
import ProductCard from './ProductCard'

const ProductDetailModal = ({ product, onClose, onAddToCart, cartItems = [] }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isClicked, setIsClicked] = useState(false)
  const [recommendedProducts, setRecommendedProducts] = useState([])
  const [loadingRecommended, setLoadingRecommended] = useState(false)
  const loadingRef = useRef(false)
  
  // Check if product is in cart
  const cartItem = cartItems.find(item => item.id === product.id)
  const quantityInCart = cartItem ? cartItem.quantity : 0

  if (!product) return null

  const images = product.images && product.images.length > 0 
    ? product.images 
    : ['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&h=800&fit=crop']

  // Fetch recommended products from same category
  useEffect(() => {
    const fetchRecommendedProducts = async () => {
      if (!product.category?.id) return
      
      try {
        setLoadingRecommended(true)
        const response = await fetch(`${API_BASE_URL}/products?category_id=${product.category.id}&limit=6`)
        if (response.ok) {
          const data = await response.json()
          // Extract items array from response
          const items = data.items || data || []
          // Filter out current product and limit to 5
          const filtered = items.filter(p => p.id !== product.id).slice(0, 5)
          setRecommendedProducts(filtered)
        }
      } catch (err) {
        console.error('Failed to fetch recommended products:', err)
      } finally {
        setLoadingRecommended(false)
      }
    }

    fetchRecommendedProducts()
  }, [product.id, product.category?.id])

  const handlePrevImage = () => {
    setSelectedImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const handleNextImage = () => {
    setSelectedImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  const incrementQuantity = () => {
    if (quantity < product.stock_quantity) {
      setQuantity(prev => prev + 1)
    }
  }
  
  const handleAddToCart = () => {
    if (!loadingRef.current) {
      loadingRef.current = true
      onAddToCart(product, quantity)
      setIsClicked(true)
      setTimeout(() => {
        setIsClicked(false)
        loadingRef.current = false
      }, 500)
    }
  }

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1)
    }
  }

  return (
    <div className="fixed inset-0 bg-white z-[70] overflow-y-auto">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="fixed top-4 right-4 bg-gray-100 rounded-full p-2 shadow-lg hover:bg-gray-200 transition z-10"
      >
        <X className="w-6 h-6 text-gray-700" />
      </button>

      <div className="container mx-auto px-2 sm:px-4 py-6 sm:py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-7xl mx-auto">
          {/* Left Side - Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
              <img
                src={images[selectedImageIndex]}
                alt={product.name}
                className="w-full h-full object-contain"
              />
              
              {/* Image Navigation Arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-700" />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition"
                  >
                    <ChevronRight className="w-5 h-5 text-gray-700" />
                  </button>
                </>
              )}

              {/* Stock Badge */}
              <div className="absolute top-4 left-4">
                {product.stock_quantity > 0 ? (
                  <div className="flex flex-col space-y-1">
                    <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      In Stock
                    </span>
                    <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs text-center">
                      {product.stock_quantity} {product.stock_quantity === 1 ? 'item' : 'items'} left
                    </span>
                  </div>
                ) : (
                  <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Out of Stock
                  </span>
                )}
              </div>
            </div>

            {/* Thumbnail Images */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition flex items-center justify-center bg-gray-50 ${
                      selectedImageIndex === index
                        ? 'border-teal-500'
                        : 'border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-contain"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Side - Product Details */}
          <div className="space-y-4">
            {/* Category */}
            {product.category && (
              <div className="text-sm text-teal-600 font-medium">
                {product.category.name}
              </div>
            )}

            {/* Product Name */}
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {product.name}
            </h1>

            {/* Product Code */}
            {/* {product.product_code && (
              <p className="text-sm text-gray-500">
                Product Code: <span className="font-medium">{product.product_code}</span>
              </p>
            )} */}

            {/* Price */}
            <div className="flex items-baseline gap-3 flex-wrap">
              {product.offer_price ? (
                <>
                  <span className="text-3xl sm:text-4xl font-bold text-gray-900">
                    ₹{product.offer_price}
                  </span>
                  <span className="text-xl text-gray-500 line-through">
                    ₹{product.normal_price}
                  </span>
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                    {Math.round(((product.normal_price - product.offer_price) / product.normal_price) * 100)}% OFF
                  </span>
                </>
              ) : (
                <span className="text-3xl sm:text-4xl font-bold text-gray-900">
                  ₹{product.normal_price || product.price}
                </span>
              )}
            </div>

            {/* Stock Info */}
            <div className="text-sm text-gray-600">
              {product.stock_quantity > 0 ? (
                <span className="text-green-600 font-medium">
                  {product.stock_quantity} units available
                </span>
              ) : (
                <span className="text-red-600 font-medium">
                  Currently unavailable
                </span>
              )}
            </div>

            {/* Divider */}
            <hr className="border-gray-200" />

            {/* Product Details */}
            {product.details && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Product Details</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {product.details}
                </p>
              </div>
            )}

 
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              {quantityInCart > 0 ? (
                <div className="w-full">
                  <div className="flex items-center justify-between bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-500 rounded-xl p-1.5 shadow-md">
                    <button
                      onClick={() => onAddToCart(product, -1)}
                      className="bg-white hover:bg-emerald-100 text-emerald-600 w-12 h-12 rounded-lg flex items-center justify-center transition-all duration-300 shadow-sm hover:shadow-md active:scale-95 group/btn"
                    >
                      <Minus className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                    </button>
                    <div className="flex flex-col items-center px-2">
                      <span className="font-black text-emerald-600 text-xl">{quantityInCart}</span>
                      <span className="text-xs text-emerald-600 font-semibold">in cart</span>
                    </div>
                    <button
                      onClick={() => onAddToCart(product, 1)}
                      className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white w-12 h-12 rounded-lg flex items-center justify-center transition-all duration-300 shadow-md hover:shadow-lg active:scale-95 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed group/btn"
                      disabled={quantityInCart >= product.stock_quantity}
                    >
                      <Plus className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                    </button>
                  </div>
                  {isClicked && (
                    <div className="absolute inset-0 bg-emerald-500/20 rounded-xl flex items-center justify-center animate-ping">
                      <Check className="w-6 h-6 text-emerald-600" />
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock_quantity === 0 || quantity === 0}
                  className={`flex-1 py-3 px-6 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all duration-300 ${
                    isClicked 
                      ? 'bg-white border-2 border-emerald-500 text-emerald-500' 
                      : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600 shadow-md hover:shadow-lg'
                  } disabled:bg-gray-300 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed disabled:shadow-none`}
                >
                  {isClicked ? (
                    <>
                      <Check className="w-5 h-5" />
                      Added to Cart
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-5 h-5" />
                      {product.stock_quantity > 0 ? `Add to Cart ` : 'Out of Stock'}
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Additional Info */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-gray-600">✓</span>
                <span className="text-gray-700">Free delivery on orders above ₹500</span>
              </div>
              {/* <div className="flex items-center gap-2">
                <span className="text-gray-600">✓</span>
                <span className="text-gray-700">Easy returns within 7 days</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-600">✓</span>
                <span className="text-gray-700">100% authentic products</span>
              </div> */}
            </div>
          </div>
        </div>

        {/* Recommended Products Section */}
        {recommendedProducts.length > 0 && (
          <div className="mt-12 border-t pt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Recommended Products</h2>
            {loadingRecommended ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                {recommendedProducts.map((recProduct) => (
                  <ProductCard
                    key={recProduct.id}
                    product={recProduct}
                    onAddToCart={onAddToCart}
                    cartItems={cartItems}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductDetailModal
