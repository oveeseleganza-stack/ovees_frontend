import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useState } from 'react'
import Home from './pages/Home'
import SearchResults from './pages/SearchResults'
import CategoryProducts from './pages/CategoryProducts'
import Header from './components/Header'
import CartPage from './pages/CartPage'
import ProductDetailModal from './components/ProductDetailModal'
import FloatingCartButton from './components/FloatingCartButton'

function App() {
  const [cartItems, setCartItems] = useState([])
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
        </Routes>
        <FloatingCartButton cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)} />
      </div>
    </BrowserRouter>
  )
}

export default App