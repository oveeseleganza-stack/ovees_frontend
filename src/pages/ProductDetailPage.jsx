// src/pages/ProductDetailPage.jsx
import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import ProductDetailModal from '../components/ProductDetailModal'
import { Loader2, X, Check } from 'lucide-react'
import { API_BASE_URL } from '../config/api'

const API_BASE = API_BASE_URL

const ProductDetailPage = ({ addToCart, cartItems = [] }) => {
  const { id } = useParams()        // <-- Get product ID from URL
  const navigate = useNavigate()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [snackbar, setSnackbar] = useState({ show: false, message: '', type: 'success' })

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return

      try {
        setLoading(true)
        setError(null)

        // Fetch product by ID
        const response = await fetch(`${API_BASE}/products/id/${id}`)
        
        if (!response.ok) {
          if (response.status === 404) throw new Error('Product not found')
          throw new Error('Failed to load product')
        }

        const data = await response.json()
        setProduct(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id])

  const handleClose = () => navigate(-1)

  
  
  
  const handleAdd = (prod, qty) => {
    // Only show snackbar if qty > 0 (adding items, not removing)
    if (qty <= 0) {
      addToCart(prod, qty)
      return
    }

    // Check if quantity would exceed stock
    const cartItem = cartItems.find(item => item.id === prod.id)
    const currentQty = cartItem ? cartItem.quantity : 0
    const totalQty = currentQty + qty

    if (totalQty > prod.stock_quantity) {
      setSnackbar({
        show: true,
        message: `Only ${prod.stock_quantity} items available in stock`,
        type: 'error'
      })
      setTimeout(() => setSnackbar({ show: false, message: '', type: 'success' }), 3000)
      return
    }

    addToCart(prod, qty)
    setSnackbar({
      show: true,
      message: `${prod.name} added to cart!`,
      type: 'success'
    })
    setTimeout(() => setSnackbar({ show: false, message: '', type: 'success' }), 3000)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-red-600">
        <p>{error}</p>
        <button onClick={handleClose} className="mt-4 text-teal-600 underline">
          ← Back
        </button>
      </div>
    )
  }

  return (
    <>
      <ProductDetailModal
        product={product}
        onClose={handleClose}
        onAddToCart={handleAdd}
        cartItems={cartItems}
      />
      
      {/* Snackbar Notification */}
      {snackbar.show && (
        <div className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 z-[200] px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 ${
          snackbar.type === 'success' 
            ? 'bg-green-500 text-white' 
            : 'bg-red-500 text-white'
        }`}>
          {snackbar.type === 'success' ? (
            <Check className="w-5 h-5" />
          ) : (
            <X className="w-5 h-5" />
          )}
          <span className="font-medium">{snackbar.message}</span>
        </div>
      )}
    </>
  )
}

export default ProductDetailPage