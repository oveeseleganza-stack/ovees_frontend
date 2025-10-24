import React, { useState } from 'react'
import { X, ChevronLeft, ChevronRight, ShoppingCart, Minus, Plus } from 'lucide-react'

const ProductDetailModal = ({ product, onClose,onAddToCart}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)

  if (!product) return null

  const images = product.images && product.images.length > 0 
    ? product.images 
    : ['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&h=800&fit=crop']

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

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1)
    }
  }

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
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
            <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={images[selectedImageIndex]}
                alt={product.name}
                className="w-full h-full object-cover"
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
                  <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    In Stock
                  </span>
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
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition ${
                      selectedImageIndex === index
                        ? 'border-teal-500'
                        : 'border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
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
            {product.product_code && (
              <p className="text-sm text-gray-500">
                Product Code: <span className="font-medium">{product.product_code}</span>
              </p>
            )}

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

            {/* Quantity Selector */}
            {product.stock_quantity > 0 && (
              <div className="space-y-2">
                <label className="font-semibold text-gray-900">Quantity</label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={decrementQuantity}
                    disabled={quantity <= 1}
                    className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-teal-500 hover:text-teal-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-xl font-semibold w-12 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={incrementQuantity}
                    disabled={quantity >= product.stock_quantity}
                    className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-teal-500 hover:text-teal-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
           <button
  onClick={() => onAddToCart(product, quantity)}
  disabled={product.stock_quantity === 0 || quantity === 0}
  className="flex-1 bg-emerald-500 text-white py-3 px-6 rounded-lg hover:bg-emerald-600 transition font-semibold flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
>
  <ShoppingCart className="w-5 h-5" />
  {product.stock_quantity > 0 ? `Add to Cart (${quantity})` : 'Out of Stock'}
</button>
            </div>

            {/* Additional Info */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-gray-600">✓</span>
                <span className="text-gray-700">Free delivery on orders above ₹500</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-600">✓</span>
                <span className="text-gray-700">Easy returns within 7 days</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-600">✓</span>
                <span className="text-gray-700">100% authentic products</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetailModal
