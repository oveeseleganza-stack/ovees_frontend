import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'
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
import CartSidebar from './components/CartSidebar'
import { saveCartToCookie, getCartFromCookie } from './utils/cartStorage'
import OrderHistory from './pages/OrderHistory'

function CartFAB({ cartItems, onCartClick }) {
  const location = useLocation()
  if (location.pathname === '/cart') return null
  return (
    <FloatingCartButton
      cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
      onCartClick={onCartClick}
    />
  )
}

function App() {
  const [cartItems, setCartItems] = useState(() => {
    return getCartFromCookie()
  })
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [isCartSidebarOpen, setIsCartSidebarOpen] = useState(false)

  const addToCart = (item, quantity = 1) => {
    console.log('Adding to cart:', item, quantity)
    setCartItems(prev => {
      const existingItem = prev.find(cartItem => 
        (item.is_combo ? cartItem.id === `combo-${item.id}` : cartItem.id === item.id)
      )
      if (existingItem) {
        const newQuantity = existingItem.quantity + quantity
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
      if (quantity > 0) {
        return [...prev, { ...item, quantity }]
      }
      return prev
    })
    setIsCartSidebarOpen(true) // Open sidebar on add
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

  // New function to reload a previous order
  const loadPreviousOrder = (orderItems) => {
    console.log('Loading previous order:', orderItems)
    setCartItems(orderItems)
  }

  useEffect(() => {
    saveCartToCookie(cartItems)
  }, [cartItems])

  return (
    <BrowserRouter>
      <div className="font-sans relative min-h-screen">
        <Analytics />
        <SpeedInsights />
        <Header 
          cartCount={cartItems.length}
          addToCart={addToCart}
          setSelectedProduct={setSelectedProduct}
          onCartIconClick={() => setIsCartSidebarOpen(true)} // Add prop to open sidebar
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
          <Route path="/cart" element={
            <CartPage 
              cartItems={cartItems} 
              removeFromCart={removeFromCart} 
              updateQuantity={updateQuantity}
              loadPreviousOrder={loadPreviousOrder}
            />
          } />
          <Route path="/new-arrivals" element={<NewArrivalsPage addToCart={addToCart} cartItems={cartItems} />} />
          <Route path="/99-store" element={<NinetynineStorePage addToCart={addToCart} cartItems={cartItems} />} />
          <Route path="/199-store" element={<OneNinetynineStorePage addToCart={addToCart} cartItems={cartItems} />} />
          <Route path="/combos" element={<CombosPage addToCart={addToCart} cartItems={cartItems} />} />
          <Route path="/orders" element={<OrderHistory />} />
        </Routes>
        {/* Cart Sidebar: Only for desktop (hidden on mobile) */}
        <CartSidebar
          isOpen={isCartSidebarOpen}
          onClose={() => setIsCartSidebarOpen(false)}
          cartItems={cartItems}
          removeFromCart={removeFromCart}
          updateQuantity={updateQuantity}
        />
          <CartFAB
          cartItems={cartItems}
          onCartClick={() => setIsCartSidebarOpen(true)}
        />
      </div>
    </BrowserRouter>
  )
}

export default App