// cartStorage.js
const CART_COOKIE_NAME = 'ovees_cart'
const ORDERS_STORAGE_KEY = 'ovees_previous_orders'
const PENDING_REORDER_KEY = 'ovees_pending_reorder'
const COOKIE_EXPIRY_DAYS = 30

/**
 * Set cart items in cookies
 * @param {Array} cartItems - Array of cart items to store
 */
export const saveCartToCookie = (cartItems) => {
  try {
    const cartJSON = JSON.stringify(cartItems)
    const expiryDate = new Date()
    expiryDate.setDate(expiryDate.getDate() + COOKIE_EXPIRY_DAYS)
    
    document.cookie = `${CART_COOKIE_NAME}=${encodeURIComponent(cartJSON)}; expires=${expiryDate.toUTCString()}; path=/; SameSite=Lax`
    console.log('✅ Cart saved to cookies:', cartItems.length, 'items')
  } catch (error) {
    console.error('❌ Error saving cart to cookies:', error)
  }
}

/**
 * Get cart items from cookies
 * @returns {Array} Array of cart items or empty array if not found
 */
export const getCartFromCookie = () => {
  try {
    const name = `${CART_COOKIE_NAME}=`
    const decodedCookie = decodeURIComponent(document.cookie)
    const cookieArray = decodedCookie.split(';')
    
    for (let cookie of cookieArray) {
      cookie = cookie.trim()
      if (cookie.indexOf(name) === 0) {
        const cartJSON = cookie.substring(name.length)
        const cartItems = JSON.parse(cartJSON)
        console.log('✅ Cart loaded from cookies:', cartItems.length, 'items')
        return cartItems
      }
    }
    console.log('ℹ️ No cart found in cookies')
    return []
  } catch (error) {
    console.error('❌ Error reading cart from cookies:', error)
    return []
  }
}

/**
 * Clear cart from cookies
 */
export const clearCartCookie = () => {
  try {
    document.cookie = `${CART_COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax`
    console.log('✅ Cart cleared from cookies')
  } catch (error) {
    console.error('❌ Error clearing cart from cookies:', error)
  }
}

/**
 * Save order to local storage
 * @param {Array} orderItems - Array of items in the order
 */
export const saveOrderToStorage = (orderItems) => {
  try {
    const timestamp = new Date().toISOString()
    const order = { items: orderItems, timestamp, id: Date.now() }
    const previousOrders = getPreviousOrders()
    const updatedOrders = [...previousOrders, order]
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updatedOrders))
    console.log('✅ Order saved to local storage:', order)
  } catch (error) {
    console.error('❌ Error saving order to local storage:', error)
  }
}

/**
 * Get previous orders from local storage
 * @returns {Array} Array of previous orders
 */
export const getPreviousOrders = () => {
  try {
    const ordersJSON = localStorage.getItem(ORDERS_STORAGE_KEY)
    if (ordersJSON) {
      const orders = JSON.parse(ordersJSON)
      console.log('✅ Previous orders loaded:', orders.length, 'orders')
      return orders
    }
    console.log('ℹ️ No previous orders found')
    return []
  } catch (error) {
    console.error('❌ Error reading previous orders:', error)
    return []
  }
}

// Pending reorder helpers
export const setPendingReorder = (orderItems, mode = 'merge') => {
  try {
    const payload = { items: orderItems, mode, timestamp: Date.now() }
    localStorage.setItem(PENDING_REORDER_KEY, JSON.stringify(payload))
  } catch (error) {
    console.error('❌ Error setting pending reorder:', error)
  }
}

export const getPendingReorder = () => {
  try {
    const raw = localStorage.getItem(PENDING_REORDER_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch (error) {
    console.error('❌ Error reading pending reorder:', error)
    return null
  }
}

export const clearPendingReorder = () => {
  try {
    localStorage.removeItem(PENDING_REORDER_KEY)
  } catch (error) {
    console.error('❌ Error clearing pending reorder:', error)
  }
}