# B2B Marketplace Frontend - API Integration Guide

**Project:** NestJS REST API Backend  
**API Version:** v1  
**Last Updated:** February 3, 2026

---

## Quick Start

### Base URL
```
Development: http://localhost:3001/api
Production: https://marketplace-api.example.com/api
```

### API Documentation
- **Swagger UI:** `http://localhost:3001/api/docs`
- Auto-generated OpenAPI documentation with interactive testing

---

## Authentication

### Token Format
All authenticated requests require a Bearer token in the Authorization header:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Token Expiry
- **Validity:** 24 hours
- **Refresh:** ❌ Not yet implemented (token-based only)
- **Storage:** LocalStorage recommended (`authToken`)

### JWT Payload Structure
```json
{
  "id": "user-uuid",
  "email": "user@example.com",
  "role": "supplier" | "buyer",
  "iat": 1701561600,
  "exp": 1701648000
}
```

---

## Response Format

### Success Response
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Operation completed successfully",
  "timestamp": "2026-02-03T10:30:45.123Z",
  "data": {
    // Response payload
  }
}
```

### Error Response
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Validation failed",
  "timestamp": "2026-02-03T10:30:45.123Z",
  "details": {
    // Error-specific details (dev only)
  }
}
```

### Common Status Codes
- **200** - Success (GET, PUT, PATCH, DELETE)
- **201** - Created (POST)
- **400** - Bad Request / Validation Error
- **401** - Unauthorized (missing/invalid token)
- **403** - Forbidden (insufficient permissions)
- **404** - Not Found
- **500** - Server Error

---

## Authentication Endpoints

### 1. Supplier Login
```
POST /auth/suppliers/login
```

**Request:**
```json
{
  "email": "supplier@example.com",
  "password": "SecurePass123!"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "supplier-uuid",
    "email": "supplier@example.com",
    "company_name": "My Trading Co.",
    "location": "New York, NY",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "created_at": "2026-02-03T10:30:45.123Z"
  }
}
```

**Frontend Example:**
```typescript
const login = async (email: string, password: string) => {
  const response = await fetch('/api/auth/suppliers/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  
  const data = await response.json();
  if (data.success) {
    localStorage.setItem('authToken', data.data.token);
    localStorage.setItem('userRole', 'supplier');
    return data.data;
  }
  throw new Error(data.message);
};
```

---

### 2. Supplier Register
```
POST /auth/suppliers/register
```

**Request:**
```json
{
  "email": "newsupplier@example.com",
  "password": "SecurePass123!",
  "company_name": "My Trading Co.",
  "location": "New York, NY"
}
```

**Response (201):** Same as Login

---

### 3. Buyer Login
```
POST /auth/buyers/login
```

**Request:**
```json
{
  "email": "buyer@example.com",
  "password": "SecurePass123!"
}
```

**Response (201):** Similar to supplier login, role = "buyer"

---

### 4. Buyer Register
```
POST /auth/buyers/register
```

**Request:**
```json
{
  "email": "newbuyer@example.com",
  "password": "SecurePass123!",
  "first_name": "John",
  "last_name": "Doe",
  "address": "123 Main St",
  "city": "New York",
  "state": "NY",
  "zip_code": "10001",
  "country": "USA"
}
```

---

### 5. Logout
```
POST /auth/logout
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## Categories Endpoints

### 1. Get All Categories
```
GET /categories
```

**Description:** Retrieve a list of all product categories (no authentication required)

**Response (200):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Success",
  "timestamp": "2026-02-03T10:30:45.123Z",
  "data": [
    {
      "id": "6817f2a0-6698-40fa-bb65-6d741c076397",
      "name": "Meat & Poultry",
      "created_at": "2026-02-03T14:29:48.875Z",
      "updated_at": "2026-02-03T14:29:48.875Z"
    },
    {
      "id": "5498704a-4d0b-4002-8e6d-51bef1abfdf3",
      "name": "Produce",
      "created_at": "2026-02-03T14:29:48.875Z",
      "updated_at": "2026-02-03T14:29:48.875Z"
    },
    {
      "id": "08ec0926-f59e-462d-bf5b-35cb98662ff4",
      "name": "Dairy & Eggs",
      "created_at": "2026-02-03T14:29:48.875Z",
      "updated_at": "2026-02-03T14:29:48.875Z"
    }
  ]
}
```

**Frontend Example:**
```typescript
const getCategories = async () => {
  try {
    const response = await fetch('http://localhost:3001/api/categories', {
      method: 'GET'
    });
    const result = await response.json();
    
    if (result.success) {
      console.log('Categories:', result.data);
      return result.data;
    }
  } catch (error) {
    console.error('Error fetching categories:', error);
  }
};
```

---

### 2. Get All Subcategories
```
GET /categories/subcategories
```

**Description:** Retrieve a list of all subcategories with their parent category names (no authentication required)

**Response (200):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Success",
  "timestamp": "2026-02-03T10:30:45.123Z",
  "data": [
    {
      "id": "a9490b2d-1e89-44ea-ac62-7833a2e0962f",
      "name": "Beef",
      "category_id": "6817f2a0-6698-40fa-bb65-6d741c076397",
      "category_name": "Meat & Poultry",
      "created_at": "2026-02-03T14:29:48.875Z",
      "updated_at": "2026-02-03T14:29:48.875Z"
    },
    {
      "id": "49bb6fa2-d861-4433-a312-2c5194b500ab",
      "name": "Chicken",
      "category_id": "6817f2a0-6698-40fa-bb65-6d741c076397",
      "category_name": "Meat & Poultry",
      "created_at": "2026-02-03T14:29:48.875Z",
      "updated_at": "2026-02-03T14:29:48.875Z"
    },
    {
      "id": "82e1601d-c513-474c-a222-7cb7b5207f5b",
      "name": "Vegetables",
      "category_id": "5498704a-4d0b-4002-8e6d-51bef1abfdf3",
      "category_name": "Produce",
      "created_at": "2026-02-03T14:29:48.875Z",
      "updated_at": "2026-02-03T14:29:48.875Z"
    }
  ]
}
```

**Frontend Example:**
```typescript
const getSubcategories = async () => {
  try {
    const response = await fetch('http://localhost:3001/api/categories/subcategories', {
      method: 'GET'
    });
    const result = await response.json();
    
    if (result.success) {
      console.log('Subcategories:', result.data);
      return result.data;
    }
  } catch (error) {
    console.error('Error fetching subcategories:', error);
  }
};
```

---

### 3. Get Subcategories by Category ID
```
GET /categories/:categoryId/subcategories
```

**Path Parameters:**
- `categoryId` (required): The UUID of the parent category

**Description:** Retrieve subcategories for a specific category (no authentication required)

**Response (200):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Success",
  "timestamp": "2026-02-03T10:30:45.123Z",
  "data": [
    {
      "id": "a9490b2d-1e89-44ea-ac62-7833a2e0962f",
      "name": "Beef",
      "category_id": "6817f2a0-6698-40fa-bb65-6d741c076397",
      "created_at": "2026-02-03T14:29:48.875Z",
      "updated_at": "2026-02-03T14:29:48.875Z"
    },
    {
      "id": "49bb6fa2-d861-4433-a312-2c5194b500ab",
      "name": "Chicken",
      "category_id": "6817f2a0-6698-40fa-bb65-6d741c076397",
      "created_at": "2026-02-03T14:29:48.875Z",
      "updated_at": "2026-02-03T14:29:48.875Z"
    }
  ]
}
```

**Frontend Example:**
```typescript
const getSubcategoriesByCategory = async (categoryId) => {
  try {
    const response = await fetch(`http://localhost:3001/api/categories/${categoryId}/subcategories`, {
      method: 'GET'
    });
    const result = await response.json();
    
    if (result.success) {
      console.log('Subcategories for category:', result.data);
      return result.data;
    }
  } catch (error) {
    console.error('Error fetching subcategories:', error);
  }
};
```

---

## Products Endpoints

### 1. Get All Products
```
GET /api/suppliers/products
Authorization: Bearer {token}
```

**Description:** Retrieve all products created by the authenticated supplier.

**Response (200):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Success",
  "timestamp": "2026-02-04T10:30:45.123Z",
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "supplier_id": "7ecbdaa3-a964-403b-a59b-b75b3c171b9e",
      "name": "Premium Beef Sirloin",
      "description": "High-quality 16oz sirloin steak",
      "category_id": "cat-uuid",
      "subcategory_id": "subcat-uuid",
      "price": "24.99",
      "stock": 50,
      "sku": "BEEF-001",
      "image_url": "https://example.com/image.jpg",
      "is_active": 1,
      "created_at": "2026-02-03T10:30:45.123Z",
      "updated_at": "2026-02-03T10:30:45.123Z"
    }
  ]
}
```

**Error (401):**
```json
{
  "success": false,
  "statusCode": 401,
  "message": "Missing or invalid JWT token",
  "timestamp": "2026-02-04T10:30:45.123Z"
}
```

**Frontend Example:**
```typescript
const getAllProducts = async () => {
  const token = localStorage.getItem('authToken');
  
  const response = await fetch('/api/suppliers/products', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  const data = await response.json();
  if (!data.success) throw new Error(data.message);
  return data.data;
};
```

---

### 2. Get Products for a Specific Supplier
```
GET /api/suppliers/:supplierId/products
Authorization: Bearer {token}
```

**Description:** Retrieve all products from a specific supplier by their ID. Accessible by any authenticated user regardless of supplier ownership. Returns category and subcategory names along with product details.

**Path Parameters:**
- `supplierId` (required): UUID of the supplier

**Response (200):** Array of product objects with category and subcategory names included

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Success",
  "timestamp": "2026-02-04T10:30:45.123Z",
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "supplier_id": "7ecbdaa3-a964-403b-a59b-b75b3c171b9e",
      "name": "Premium Beef Sirloin",
      "description": "High-quality 16oz sirloin steak",
      "category_id": "cat-uuid",
      "category_name": "Meat & Poultry",
      "subcategory_id": "subcat-uuid",
      "subcategory_name": "Beef Products",
      "price": "24.99",
      "stock": 50,
      "sku": "BEEF-001",
      "image_url": "https://example.com/image.jpg",
      "is_active": 1,
      "created_at": "2026-02-03T10:30:45.123Z",
      "updated_at": "2026-02-03T10:30:45.123Z"
    }
  ]
}
```

**Error (401):**
```json
{
  "success": false,
  "statusCode": 401,
  "message": "Missing or invalid JWT token",
  "timestamp": "2026-02-04T10:30:45.123Z"
}
```

**Frontend Example:**
```typescript
const getSupplierProducts = async (supplierId: string) => {
  const token = localStorage.getItem('authToken');
  
  const response = await fetch(`/api/suppliers/${supplierId}/products`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  const data = await response.json();
  if (!data.success) throw new Error(data.message);
  
  // Products now include category_name and subcategory_name
  return data.data;
};
```

---

### 3. Get Product by ID
```
GET /api/suppliers/products/:id
Authorization: Bearer {token}
```

**Description:** Retrieve detailed information for a single product by its UUID. Accessible by any authenticated user regardless of supplier ownership.

**Path Parameters:**
- `id` (required): Product UUID

**Response (200):** Single product object

**Error (404):**
```json
{
  "success": false,
  "statusCode": 404,
  "message": "Product not found",
  "timestamp": "2026-02-04T10:30:45.123Z"
}
```

**Frontend Example:**
```typescript
const getProduct = async (productId: string) => {
  const token = localStorage.getItem('authToken');
  
  const response = await fetch(`/api/suppliers/products/${productId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  const data = await response.json();
  if (!data.success) throw new Error(data.message);
  return data.data;
};
```

---

### 4. Create Product
```
POST /api/suppliers/products
Authorization: Bearer {supplier-token}
Content-Type: application/json
```

**Description:** Create a new product listing for the authenticated supplier. Generates UUID for product ID and initializes stock history. Prices are stored as strings for decimal precision.

**Required Fields:**
- `name`: Product name (string, min 3 characters)
- `category_id`: UUID of category
- `price`: Product price (number, positive)

**Optional Fields:**
- `description`: Product description (string)
- `stock`: Initial stock quantity (number, default 0)
- `subcategory_id`: UUID of subcategory
- `sku`: Stock keeping unit (string)
- `image_url`: Product image URL (string)

**Request:**
```json
{
  "name": "Premium Beef Sirloin",
  "description": "High-quality 16oz sirloin steak",
  "price": 24.99,
  "stock": 50,
  "category_id": "cat-uuid",
  "subcategory_id": "subcat-uuid",
  "sku": "BEEF-001",
  "image_url": "https://example.com/image.jpg"
}
```

**Response (201):** Created product object with UUID and timestamps

**Error (400):**
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Validation error - name, category_id, and price are required. Price must be positive.",
  "timestamp": "2026-02-04T10:30:45.123Z"
}
```

**Frontend Example:**
```typescript
const createProduct = async (productData) => {
  const token = localStorage.getItem('authToken');
  
  const response = await fetch('/api/suppliers/products', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(productData)
  });
  
  const data = await response.json();
  if (!data.success) throw new Error(data.message);
  return data.data;
};
```

---

### 5. Update Product
```
PUT /api/suppliers/products/:id
Authorization: Bearer {supplier-token}
```

**Description:** Update product details. Only the supplier who owns the product can update it. All fields are optional - send only fields to be updated. Automatically updates the updated_at timestamp.

**Path Parameters:**
- `id` (required): Product UUID to update

**Optional Fields:**
- `name`: Updated product name
- `description`: Updated description
- `price`: Updated price
- `stock`: Updated stock quantity
- `category_id`: Updated category
- `subcategory_id`: Updated subcategory
- `sku`: Updated SKU
- `image_url`: Updated image URL
- `is_active`: Active status

**Request:**
```json
{
  "name": "Updated Name",
  "price": 29.99,
  "stock": 75
}
```

**Response (200):** Updated product object

**Error (403):**
```json
{
  "success": false,
  "statusCode": 403,
  "message": "Supplier not owner of product",
  "timestamp": "2026-02-04T10:30:45.123Z"
}
```

**Frontend Example:**
```typescript
const updateProduct = async (productId: string, updates: Partial<Product>) => {
  const token = localStorage.getItem('authToken');
  
  const response = await fetch(`/api/suppliers/products/${productId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(updates)
  });
  
  const data = await response.json();
  if (!data.success) throw new Error(data.message);
  return data.data;
};
```

---

### 6. Delete Product
```
DELETE /api/suppliers/products/:id
Authorization: Bearer {supplier-token}
```

**Description:** Permanently delete a product. Only the supplier who owns the product can delete it. This action cannot be undone. All stock history is retained.

**Path Parameters:**
- `id` (required): Product UUID to delete

**Response (200):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Product deleted successfully",
  "timestamp": "2026-02-04T10:30:45.123Z"
}
```

**Error (403):**
```json
{
  "success": false,
  "statusCode": 403,
  "message": "Supplier not owner of product",
  "timestamp": "2026-02-04T10:30:45.123Z"
}
```

**Frontend Example:**
```typescript
const deleteProduct = async (productId: string) => {
  const token = localStorage.getItem('authToken');
  
  const response = await fetch(`/api/suppliers/products/${productId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  const data = await response.json();
  if (!data.success) throw new Error(data.message);
};
```

---

### 7. Update Stock with Audit Trail
```
PATCH /api/suppliers/products/:id/stock
Authorization: Bearer {supplier-token}
```

**Description:** Adjust product stock quantity and create a stock history entry for audit tracking. Supports positive quantities (restocks) and negative (sales/adjustments). Prevents negative final stock. Each change is logged with timestamp, previous/new quantity, and reason.

**Path Parameters:**
- `id` (required): Product UUID

**Request:**
```json
{
  "quantityChange": 25,
  "reason": "Restock"
}
```

**Reason Options:**
- "Purchase" - Stock reduction due to purchase
- "Return" - Stock increase from customer return
- "Damage" - Stock reduction due to damaged goods
- "Stock adjustment" - Manual inventory adjustment
- "Restock" - Supplier restocking inventory
- "Other" - Other stock adjustment reason

**Response (200):** Updated product object with new stock level

**Error (400):**
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Invalid quantity - would result in negative stock",
  "timestamp": "2026-02-04T10:30:45.123Z"
}
```

**Frontend Example:**
```typescript
const updateStock = async (productId: string, quantityChange: number, reason: string) => {
  const token = localStorage.getItem('authToken');
  
  const response = await fetch(`/api/suppliers/products/${productId}/stock`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ quantityChange, reason })
  });
  
  const data = await response.json();
  if (!data.success) throw new Error(data.message);
  return data.data;
};
```

---

### 8. Get Stock History
```
GET /api/suppliers/products/:id/stock-history
Authorization: Bearer {token}
```

**Description:** Retrieve the complete audit trail of stock changes for a product. Shows all quantity adjustments with timestamps, quantities before/after, and change reasons. Results ordered chronologically.

**Path Parameters:**
- `id` (required): Product UUID

**Response (200):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Success",
  "timestamp": "2026-02-04T10:30:45.123Z",
  "data": [
    {
      "id": "history-uuid",
      "product_id": "product-uuid",
      "previous_stock": 50,
      "new_stock": 75,
      "quantity_change": 25,
      "reason": "Restock",
      "created_at": "2026-02-03T10:30:45.123Z"
    }
  ]
}
```

**Error (404):**
```json
{
  "success": false,
  "statusCode": 404,
  "message": "Product not found",
  "timestamp": "2026-02-04T10:30:45.123Z"
}
```

**Frontend Example:**
```typescript
const getStockHistory = async (productId: string) => {
  const token = localStorage.getItem('authToken');
  
  const response = await fetch(`/api/suppliers/products/${productId}/stock-history`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  const data = await response.json();
  if (!data.success) throw new Error(data.message);
  return data.data;
};
```

---

## Cart Endpoints (Not Fully Tested Yet)

### 1. Add to Cart
```
POST /cart
Authorization: Bearer {buyer-token}
```

**Request:**
```json
{
  "product_id": "product-uuid",
  "quantity": 2
}
```

---

### 2. Get Cart
```
GET /cart
Authorization: Bearer {buyer-token}
```

---

### 3. Remove from Cart
```
DELETE /cart/:cartItemId
Authorization: Bearer {buyer-token}
```

---

### 4. Update Cart Item Quantity
```
PATCH /cart/:cartItemId
Authorization: Bearer {buyer-token}
```

**Request:**
```json
{
  "quantity": 5
}
```

---

### 5. Clear Cart
```
DELETE /cart
Authorization: Bearer {buyer-token}
```

---

## Orders Endpoints (Not Fully Tested Yet)

### 1. Create Order
```
POST /orders
Authorization: Bearer {buyer-token}
```

**Request:**
```json
{
  "items": [
    {
      "product_id": "product-uuid",
      "quantity": 2,
      "price": "24.99"
    }
  ],
  "shipping_address": "123 Main St",
  "payment_method": "credit_card"
}
```

---

### 2. Get Orders
```
GET /orders
Authorization: Bearer {token}
```

---

### 3. Get Order by ID
```
GET /orders/:orderId
Authorization: Bearer {token}
```

---

## Health Check Endpoint

### Check API Status
```
GET /health
```

**Response (200):**
```json
{
  "success": true,
  "message": "API is running",
  "database": "connected"
}
```

**Response (503):** Database connection failed

---

## Error Handling Guide

### Common Errors

**1. Invalid Credentials**
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Invalid email or password"
}
```

**2. Missing Token**
```json
{
  "success": false,
  "statusCode": 401,
  "message": "Authorization token is missing"
}
```

**3. Invalid Token**
```json
{
  "success": false,
  "statusCode": 401,
  "message": "Invalid or expired token"
}
```

**4. Insufficient Permissions**
```json
{
  "success": false,
  "statusCode": 403,
  "message": "Cannot update product of another supplier"
}
```

**5. Validation Error**
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Name, category_id, and price are required"
}
```

---

## Frontend Integration Patterns

### 1. Create API Client
```typescript
// api.ts
class ApiClient {
  private baseUrl = 'http://localhost:3001/api';
  
  private getHeaders() {
    const token = localStorage.getItem('authToken');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }
  
  async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: { ...this.getHeaders(), ...options.headers }
    });
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message);
    }
    
    return data.data;
  }
  
  get<T>(endpoint: string) {
    return this.request<T>(endpoint, { method: 'GET' });
  }
  
  post<T>(endpoint: string, body: unknown) {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body)
    });
  }
  
  put<T>(endpoint: string, body: unknown) {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body)
    });
  }
  
  patch<T>(endpoint: string, body: unknown) {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(body)
    });
  }
  
  delete<T>(endpoint: string) {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const api = new ApiClient();
```

### 2. Use API Client
```typescript
// productService.ts
import { api } from './api';

export const productService = {
  getAll: () => api.get('/suppliers/products'),
  getById: (id: string) => api.get(`/suppliers/products/${id}`),
  create: (product) => api.post('/suppliers/products', product),
  update: (id: string, product) => api.put(`/suppliers/products/${id}`, product),
  delete: (id: string) => api.delete(`/suppliers/products/${id}`),
  updateStock: (id: string, update) => api.patch(`/suppliers/products/${id}/stock`, update),
  search: (query) => api.get(`/suppliers/products/search?${new URLSearchParams(query)}`)
};
```

### 3. Component Usage
```typescript
// ProductList.tsx
import { useState, useEffect } from 'react';
import { productService } from './productService';

export function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await productService.getAll();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    loadProducts();
  }, []);
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div>
      {products.map(product => (
        <div key={product.id}>
          <h3>{product.name}</h3>
          <p>${product.price}</p>
          <p>Stock: {product.stock}</p>
        </div>
      ))}
    </div>
  );
}
```

---

## Testing the APIs

### Using Swagger UI
1. Navigate to `http://localhost:3001/api/docs`
2. Click "Authorize" button
3. Paste your JWT token (with "Bearer " prefix)
4. Try endpoints directly in the UI

### Using cURL
```bash
# Login
curl -X POST http://localhost:3001/api/auth/suppliers/login \
  -H "Content-Type: application/json" \
  -d '{"email":"supplier@example.com","password":"SecurePass123!"}'

# Get token from response, then:

# Get all products
curl http://localhost:3001/api/suppliers/products \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Create product
curl -X POST http://localhost:3001/api/suppliers/products \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "name":"Product Name",
    "price":29.99,
    "stock":100,
    "category_id":"cat-uuid"
  }'
```

---

## Important Notes

### Rate Limiting
⚠️ Not yet implemented - to be added

### CORS
✅ Enabled for localhost:3000 (frontend) and production domain

### Data Types
- **IDs:** All IDs are UUIDs (strings)
- **Prices:** Stored as strings for precision (e.g., "24.99")
- **Timestamps:** ISO 8601 format
- **Stock:** Integer

### Pagination
❌ Not yet implemented - all endpoints return full results

### Sorting
❌ Not yet implemented - add to frontend if needed

---

## Development Checklist

- [ ] Supplier authentication flow
- [ ] Buyer authentication flow
- [ ] Product listing & search
- [ ] Product creation/editing
- [ ] Cart management
- [ ] Order creation
- [ ] Error handling & user feedback
- [ ] Token refresh flow (pending backend)
- [ ] Pagination (pending backend)
- [ ] Image uploads (pending backend)

---

## Backend API Status

**Tested & Working:**
- ✅ Authentication (Suppliers & Buyers)
- ✅ Products (All CRUD + Search)
- ✅ Health Check

**Built but Not Fully Tested:**
- ⚠️ Cart (basic implementation)
- ⚠️ Orders (basic implementation)

**Not Yet Implemented:**
- ❌ Discounts/Coupons
- ❌ Reviews & Ratings
- ❌ Wishlist
- ❌ Notifications
- ❌ Admin Dashboard

---

## Support

- **API Documentation:** `http://localhost:3001/api/docs`
- **Backend Logs:** Check terminal running `npm run start:dev`
- **Common Issues:** Check API_STATUS.md for known limitations

