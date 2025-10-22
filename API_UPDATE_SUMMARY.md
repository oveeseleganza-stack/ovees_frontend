# API Update Summary - New Pagination & Price Structure

## Changes Made

### 1. ✅ Updated API Service (`src/services/api.js`)

**New Pagination Structure:**
- Changed from `skip`/`limit` to `page`/`page_size`
- Old: `?skip=0&limit=20`
- New: `?page=1&page_size=20`

**New Response Format:**
```javascript
{
  "items": [...products...],
  "meta": {
    "page": 1,
    "page_size": 20,
    "total_items": 122,
    "total_pages": 7,
    "has_next": true,
    "has_previous": false
  }
}
```

**Updated Functions:**

#### `fetchProducts()`
- **Parameters**: `page`, `pageSize`, `isActive`, `categoryId`, `sortBy`, `minPrice`, `maxPrice`
- **Returns**: `{ items: [], meta: {} }`
- **Supports**: All filter parameters from API

#### `searchProducts()`
- **Parameters**: `query`, `page`, `pageSize`, `isActive`, `categoryId`, `sortBy`, `minPrice`, `maxPrice`
- **Uses**: `search` parameter in query string
- **Returns**: `{ items: [], meta: {} }`
- **Supports**: Full search with filters

### 2. ✅ Updated Price Structure

**Old Structure:**
```javascript
{
  price: 199
}
```

**New Structure:**
```javascript
{
  normal_price: 299,
  offer_price: 199  // null if no offer
}
```

### 3. ✅ Updated Components

#### **ProductCard.jsx**
- ✅ Handles `normal_price` and `offer_price`
- ✅ Shows discount percentage when offer exists
- ✅ Displays strikethrough on normal price
- ✅ Shows offer badge with percentage

**Display Logic:**
- If `offer_price` exists: Show offer price, strikethrough normal price, discount badge
- If no offer: Show normal price only

#### **ProductDetailModal.jsx**
- ✅ Updated to show offer pricing
- ✅ Large discount badge for offers
- ✅ Clear price comparison

#### **Home.jsx**
- ✅ Uses `page` instead of `skip`
- ✅ Calculates current page from products length
- ✅ Handles `meta.has_next` for pagination
- ✅ Logs page progress

#### **SearchResults.jsx**
- ✅ Updated to use new API structure
- ✅ Handles `items` and `meta` from response
- ✅ Updated price handling in recommendations

#### **Header.jsx**
- ✅ Search suggestions use new API
- ✅ Category products use pagination
- ✅ Price display updated for suggestions
- ✅ Proper page calculation

### 4. ✅ Search Functionality

**Search Parameters Supported:**
- `search` - Search query string
- `page` - Page number (starts from 1)
- `page_size` - Items per page (max 100)
- `sort_by` - Sort options: `price_low`, `price_high`, `newest`, `oldest`
- `min_price` - Minimum price filter
- `max_price` - Maximum price filter
- `category_id` - Filter by category
- `is_active` - Show only active products

**Example Search URL:**
```
/products?search=necklace&page=1&page_size=20&is_active=true&sort_by=price_low&min_price=100&max_price=500&category_id=9
```

### 5. ✅ Pagination Logic

**Before (Skip-based):**
```javascript
const skip = products.length
fetchProducts(skip, 20, true)
```

**After (Page-based):**
```javascript
const currentPage = Math.floor(products.length / ITEMS_PER_PAGE) + 1
const response = await fetchProducts(currentPage, ITEMS_PER_PAGE, true)
const data = response.items || []
const meta = response.meta || {}

if (!meta.has_next) {
  setHasMore(false)
}
```

### 6. ✅ Price Display Examples

**Product Card:**
```
₹199  ₹299  33% OFF
```

**Product Detail:**
```
₹199
₹299
33% OFF
```

**No Offer:**
```
₹299
```

## API Endpoints

### Products Endpoint
```
GET https://ovees-backend.azurewebsites.net/products
```

**Query Parameters:**
- `page` (integer, default: 1) - Page number
- `page_size` (integer, default: 20, max: 100) - Items per page
- `search` (string) - Search query
- `sort_by` (string) - Sort order
- `min_price` (number) - Minimum price
- `max_price` (number) - Maximum price
- `category_id` (integer) - Filter by category
- `is_active` (boolean, default: true) - Show active products

### Categories Endpoint
```
GET https://ovees-backend.azurewebsites.net/categories
```

## Testing Checklist

- [x] Products load with pagination
- [x] Search works with new API structure
- [x] Category filtering works
- [x] Price display shows offers correctly
- [x] Discount percentage calculates correctly
- [x] Pagination stops at last page
- [x] Search suggestions work
- [x] Category dropdowns load products
- [x] Lazy loading continues to work
- [x] Meta information is used correctly

## Migration Notes

### Breaking Changes:
1. **API Response Structure**: All product fetches now return `{ items, meta }` instead of array
2. **Pagination**: Changed from skip/limit to page/page_size
3. **Price Fields**: `price` → `normal_price` and `offer_price`

### Backward Compatibility:
- Code handles both old `price` and new `normal_price`/`offer_price`
- Fallback: `product.offer_price || product.normal_price || product.price`

## Future Enhancements

1. **Add Filter UI**: 
   - Price range slider
   - Sort dropdown
   - Category filter chips

2. **Advanced Search**:
   - Search by product code
   - Search by category
   - Multi-filter search

3. **Pagination UI**:
   - Page numbers
   - Jump to page
   - Items per page selector

4. **Offer Management**:
   - Offer expiry dates
   - Flash sales
   - Limited time offers
