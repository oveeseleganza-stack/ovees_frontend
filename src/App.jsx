import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Home from './pages/Home'
import SearchResults from './pages/SearchResults'
import CategoryProducts from './pages/CategoryProducts'
import Header from './components/Header'
import CartPage from './pages/CartPage'
import NewArrivalsPage from './pages/NewArrivalsPage'
import NinetynineStorePage from './pages/NinetynineStorePage'
import OneNinetynineStorePage from './pages/OneNinetynineStorePage'
import CombosPage from './pages/CombosPage'
import ProductDetailModal from './components/ProductDetailModal'
import FloatingCartButton from './components/FloatingCartButton'
import { saveCartToCookie, getCartFromCookie } from './utils/cartStorage'

function App() {
  const [cartItems, setCartItems] = useState(() => {
    // Initialize cart from cookies on app load
    return getCartFromCookie()
  })
  const [selectedProduct, setSelectedProduct] = useState(null)

  const addToCart = (item, quantity = 1) => {
    console.log('Adding to cart:', item, quantity)
    setCartItems(prev => {
      const existingItem = prev.find(cartItem => 
        (item.is_combo ? cartItem.id === `combo-${item.id}` : cartItem.id === item.id)
      )
      if (existingItem) {
        const newQuantity = existingItem.quantity + quantity
        // Remove item if quantity becomes 0 or negative
        if (newQuantity <= 0) {
          return prev.filter(cartItem => 
            !(item.is_combo ? cartItem.id === `combo-${item.id}` : cartItem.id === item.id)
          )
        }
        return prev.map(cartItem =>
          (item.is_combo ? cartItem.id === `combo-${item.id}` : cartItem.id === item.id)
            ? { ...cartItem, quantity: newQuantity }
            : cartItem
        )
      }
      // Only add if quantity is positive
      if (quantity > 0) {
        return [...prev, { ...item, quantity }]
      }
      return prev
    })
  }

  const removeFromCart = (itemId) => {
    console.log('Removing from cart:', itemId)
    setCartItems(prev => prev.filter(item => item.id !== itemId))
  }

  const updateQuantity = (itemId, newQuantity) => {
    console.log('Updating quantity:', itemId, newQuantity)
    if (newQuantity <= 0) {
      removeFromCart(itemId)
      return
    }
    setCartItems(prev =>
      prev.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    )
  }

  // Save cart to cookies whenever it changes
  useEffect(() => {
    saveCartToCookie(cartItems)
  }, [cartItems])

  return (
    <BrowserRouter>
      <div className="font-sans relative min-h-screen">
        <Header 
          cartCount={cartItems.length}
          addToCart={addToCart}
          setSelectedProduct={setSelectedProduct}
        />
        {selectedProduct && (
          <ProductDetailModal 
            product={selectedProduct} 
            onClose={() => setSelectedProduct(null)}
            onAddToCart={addToCart}
          />
        )}
        <Routes>
          <Route path="/" element={<Home addToCart={addToCart} cartItems={cartItems} />} />
          <Route path="/search" element={<SearchResults addToCart={addToCart} cartItems={cartItems} />} />
          <Route path="/category" element={<CategoryProducts addToCart={addToCart} cartItems={cartItems} />} />
          <Route path="/cart" element={<CartPage cartItems={cartItems} removeFromCart={removeFromCart} updateQuantity={updateQuantity} />} />
          <Route path="/new-arrivals" element={<NewArrivalsPage addToCart={addToCart} cartItems={cartItems} />} />
          <Route path="/99-store" element={<NinetynineStorePage addToCart={addToCart} cartItems={cartItems} />} />
          <Route path="/199-store" element={<OneNinetynineStorePage addToCart={addToCart} cartItems={cartItems} />} />
          <Route path="/combos" element={<CombosPage addToCart={addToCart} cartItems={cartItems} />} />
        </Routes>
        <FloatingCartButton cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)} />
      </div>
    </BrowserRouter>
  )
}

export default App