import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useState } from 'react'
import Home from './pages/Home'
import SearchResults from './pages/SearchResults'
import Header from './components/Header'
import CartPage from './pages/CartPage'
import ProductDetailModal from './components/ProductDetailModal'

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
        return prev.map(cartItem =>
          (item.is_combo ? cartItem.id === `combo-${item.id}` : cartItem.id === item.id)
            ? { ...cartItem, quantity: cartItem.quantity + quantity }
            : cartItem
        )
      }
      return [...prev, { ...item, quantity }]
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
          <Route path="/" element={<Home addToCart={addToCart} />} />
          <Route path="/search" element={<SearchResults addToCart={addToCart} />} />
          <Route path="/cart" element={<CartPage cartItems={cartItems} removeFromCart={removeFromCart} updateQuantity={updateQuantity} />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App