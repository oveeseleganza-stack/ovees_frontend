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

export const fetchProducts = async (page = 1, pageSize = 20, isActive = true, categoryId = null, sortBy = null, minPrice = null, maxPrice = null) => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      page_size: pageSize.toString(),
      is_active: isActive.toString()
    })
    
    if (categoryId) params.append('category_id', categoryId.toString())
    if (sortBy) params.append('sort_by', sortBy)
    if (minPrice !== null) params.append('min_price', minPrice.toString())
    if (maxPrice !== null) params.append('max_price', maxPrice.toString())
    
    const url = `${API_BASE_URL}${API_ENDPOINTS.PRODUCTS}?${params.toString()}`
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error('Failed to fetch products')
    }
    const data = await response.json()
    return {
      items: data.items || [],
      meta: data.meta || {}
    }
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

export const searchProducts = async (query, page = 1, pageSize = 20, isActive = true, categoryId = null, sortBy = null, minPrice = null, maxPrice = null) => {
  try {
    const params = new URLSearchParams({
      search: query,
      page: page.toString(),
      page_size: pageSize.toString(),
      is_active: isActive.toString()
    })
    
    if (categoryId) params.append('category_id', categoryId.toString())
    if (sortBy) params.append('sort_by', sortBy)
    if (minPrice !== null) params.append('min_price', minPrice.toString())
    if (maxPrice !== null) params.append('max_price', maxPrice.toString())
    
    const url = `${API_BASE_URL}${API_ENDPOINTS.PRODUCTS}?${params.toString()}`
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error('Failed to fetch search results')
    }
    const data = await response.json()
    return {
      items: data.items || [],
      meta: data.meta || {}
    }
  } catch (error) {
    console.error('Error fetching search results:', error)
    throw error
  }
}