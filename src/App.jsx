import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useState } from 'react'
import Home from './pages/Home'
import SearchResults from './pages/SearchResults'
import Header from './components/Header'
import Cart from './components/Cart'
import ProductDetailModal from './components/ProductDetailModal'

function App() {
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [cartItems, setCartItems] = useState([])
  const [selectedProduct, setSelectedProduct] = useState(null)

  const addToCart = (item, quantity = 1) => {
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
    setCartItems(prev => prev.filter(item => item.id !== itemId))
  }

  const updateQuantity = (itemId, newQuantity) => {
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
      <div className="font-sans relative">
        <Header 
          setIsCartOpen={setIsCartOpen} 
          cartCount={cartItems.length}
          addToCart={addToCart}
          setSelectedProduct={setSelectedProduct}
        />
        {isCartOpen && (
          <Cart 
            setIsCartOpen={setIsCartOpen}
            cartItems={cartItems}
            removeFromCart={removeFromCart}
            updateQuantity={updateQuantity}
          />
        )}
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
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App