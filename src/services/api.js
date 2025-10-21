import { API_BASE_URL, API_ENDPOINTS } from '../config/api'

export const fetchCategories = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.CATEGORIES}`)
    if (!response.ok) {
      throw new Error('Failed to fetch categories')
    }
    return await response.json()
  } catch (error) {
    console.error('Error fetching categories:', error)
    throw error
  }
}

export const fetchProducts = async (skip = 0, limit = 10, isActive = true, categoryId = null) => {
  try {
    const url = categoryId
      ? `${API_BASE_URL}${API_ENDPOINTS.PRODUCTS}?skip=${skip}&limit=${limit}&is_active=${isActive}&category_id=${categoryId}`
      : `${API_BASE_URL}${API_ENDPOINTS.PRODUCTS}?skip=${skip}&limit=${limit}&is_active=${isActive}`
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error('Failed to fetch products')
    }
    return await response.json()
  } catch (error) {
    console.error('Error fetching products:', error)
    throw error
  }
}

export const fetchNinetynineStore = async (skip = 0, limit = 100) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/products/collection/99-store?skip=${skip}&limit=${limit}`
    )
    if (!response.ok) {
      throw new Error('Failed to fetch 99 Store products')
    }
    return await response.json()
  } catch (error) {
    console.error('Error fetching 99 Store products:', error)
    throw error
  }
}

export const fetchOneNinetyNineStore = async (skip = 0, limit = 3) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/products/collection/199-store?skip=${skip}&limit=${limit}`
    )
    if (!response.ok) {
      throw new Error('Failed to fetch 199 Store products')
    }
    return await response.json()
  } catch (error) {
    console.error('Error fetching 199 Store products:', error)
    throw error
  }
}

export const fetchCombos = async (skip = 0, limit = 5, isActive = true) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/combos?skip=${skip}&limit=${limit}&is_active=${isActive}`
    )
    if (!response.ok) {
      throw new Error('Failed to fetch combos')
    }
    return await response.json()
  } catch (error) {
    console.error('Error fetching combos:', error)
    throw error
  }
}

export const fetchNewArrivals = async (skip = 0, limit = 5, isActive = true) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/new-arrivals?skip=${skip}&limit=${limit}&is_active=${isActive}`
    )
    if (!response.ok) {
      throw new Error('Failed to fetch new arrivals')
    }
    return await response.json()
  } catch (error) {
    console.error('Error fetching new arrivals:', error)
    throw error
  }
}

export const searchProducts = async (query, skip = 0, limit = 10, isActive = true) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/products/search?q=${encodeURIComponent(query)}&skip=${skip}&limit=${limit}&is_active=${isActive}`
    )
    if (!response.ok) {
      throw new Error('Failed to fetch search results')
    }
    return await response.json()
  } catch (error) {
    console.error('Error fetching search results:', error)
    throw error
  }
}