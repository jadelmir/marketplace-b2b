# B2B Marketplace MVP - React Architecture & Feature Mapping

## MVP Goal

Enable restaurants (buyers) to discover suppliers, view transparent pricing, and place orders — while allowing suppliers to list products and manage incoming orders.

## Tech Stack

- **Frontend Framework:** React 18.2.0
- **Type Safety:** TypeScript 5.3.3
- **Build Tool:** Vite 5.0.8
- **Styling:** Tailwind CSS 3.3.6
- **Routing:** React Router DOM 6.20.0
- **HTTP Client:** Axios 1.6.2
- **Data Fetching & Caching:** TanStack Query 5.28.0
- **State Management:** React Context API + useReducer
- **Package Manager:** npm
User Roles
● Buyer (Restaurant): search products, place orders, reorder
● Supplier: manage product catalog, accept or reject orders
Application Routing Structure
● /login, /register
● /buyer/search, /buyer/supplier/:id, /buyer/cart, /buyer/orders
● /supplier/dashboard, /supplier/products, /supplier/orders
Authentication & Role Handling
● Single React app with role-based routing
● Post-login redirect based on role (BUYER or SUPPLIER)
● Global AuthContext stores user session
Buyer Features (MVP)
● Search products by category and name
● View supplier profile and product listings
● Single-supplier cart with quantity selection
● Place order with Pending status
● View order history and reorder
Supplier Features (MVP)
● Create, edit, and manage product catalog
● Set price, unit, MOQ, and availability
● View incoming orders
● Accept or reject orders
Core React Components
● Authentication: LoginForm, RegisterForm
● Buyer: ProductCard, ProductList, CartItem, OrderCard
● Supplier: ProductTable, Add/Edit Product Modal, OrderDetails
State Management
● React Context + useReducer
● AuthContext for user session
● CartContext for buyer cart
● Optional ProductContext
API Communication Pattern
● Feature-based API modules (auth, products, orders)
● Axios or fetch with loading & error states
● No real-time or websocket communication in MVP
Core Data Models
● User
● BuyerProfile
● SupplierProfile
● Product
● Category
● Order
● OrderItem
Explicitly Excluded from MVP
● Chat or messaging
● Ratings & reviews
● Negotiation or bidding
● Multi-supplier carts
● Mobile app
● Advanced analytics
Recommended Build Order
● Authentication & role routing
● Supplier product management
● Buyer search & cart
● Order lifecycle (buyer & supplier)
MVP Success Criteria
● Buyer places order without offline communication
● Supplier fulfills order
● Both parties return to reuse the platform

Login : 
 - login screen split into 2 
 - 1 for buyer that takes you to the dashboard
 - 1 for supplier that takes you to the supplier dashboard 
 
