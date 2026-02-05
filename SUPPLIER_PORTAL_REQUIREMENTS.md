# Supplier Portal Requirements Document

## Overview
The Supplier Portal is a dedicated platform where suppliers can manage their inventory, process orders, handle pricing, and track their business performance.

---

## 1. INVENTORY MANAGEMENT

### 1.1 Add New Products/Items
- **Functionality:**
  - Suppliers can add new products to their inventory
  - Form fields include:
    - Product Name (required)
    - Description (required)
    - Unit Type (kg, pieces, liters, boxes, etc.) (required)
    - Price per unit (required)
    - Category (dropdown - select from existing categories) (required)
    - Subcategory (dropdown - filtered based on selected category) (required)
    - Option to create new subcategory as "Other" (optional)
    - Initial Availability/Stock (quantity or weight based on unit type) (required)
    - Product Images (optional)
    - Minimum Order Quantity (MOQ) (required)
    - Product SKU/Code (optional)

### 1.2 View Product Inventory
- **Functionality:**
  - Display list of all products added by supplier
  - Table/Grid view showing:
    - Product Name
    - Category
    - Subcategory
    - Current Stock/Availability
    - Unit Type
    - Price per unit
    - MOQ
    - Date Added
    - Status (Active/Inactive)
    - Actions (Edit, Delete, View Details)
  - Search and filter options:
    - Search by product name
    - Filter by category
    - Filter by stock status (in stock, low stock, out of stock)
    - Sort by price, date added, stock level

### 1.3 Edit Product
- **Functionality:**
  - Update product details
  - Editable fields:
    - Product Name
    - Description
    - Price per unit
    - Category
    - Subcategory
    - MOQ
    - Product Images
  - Non-editable fields (shown for reference):
    - Product SKU
    - Date Added

### 1.4 Update Stock/Availability
- **Functionality:**
  - Quick update inventory without editing full product
  - Can increase or decrease stock
  - Show current stock before update
  - Reason for stock update (optional - for tracking):
    - New shipment received
    - Stock adjustment
    - Sale
    - Damaged/Return
  - Stock history log showing changes over time

### 1.5 Delete/Deactivate Product
- **Functionality:**
  - Soft delete (Deactivate) - hide from buyers but keep in system
  - Hard delete - completely remove (maybe with warning if orders exist)
  - Reason for deletion (optional)
  - Archive older products

---

## 2. DISCOUNT MANAGEMENT

### 2.1 Add Discount to Existing Item
- **Functionality:**
  - Apply discount to a specific product
  - Types of discounts:
    - Fixed amount ($X off)
    - Percentage discount (X% off)
  - Discount Parameters:
    - Discount Type (Fixed/Percentage) (required)
    - Discount Value (required)
    - Original Price (display only)
    - New Price (auto-calculated)
    - Discount Start Date (required)
    - Discount End Date (required)
    - Minimum quantity for discount (optional - e.g., buy 10+ to get discount)
    - Discount Code/Name (optional)
    - Description (optional)

### 2.2 View Active Discounts
- **Functionality:**
  - List all active and scheduled discounts
  - Show:
    - Product Name
    - Original Price
    - Discount Details
    - New Price
    - Discount Duration
    - Status (Active/Scheduled/Expired)
  - Filter by status, product, date range

### 2.3 Edit/Update Discount
- **Functionality:**
  - Modify discount details before end date
  - Extend discount duration
  - Update discount amount/percentage

### 2.4 Remove/Cancel Discount
- **Functionality:**
  - End discount early
  - Revert product to original price

---

## 3. ORDER MANAGEMENT

### 3.1 View Orders
- **Functionality:**
  - Dashboard showing all orders from buyers
  - Multiple order status tabs/views:
    - **New Orders** - Just received, awaiting supplier action
    - **Accepted Orders** - Supplier confirmed, preparing for shipment
    - **Fulfilled Orders** - Already shipped/delivered
    - All Orders - View all regardless of status
  
### 3.2 Order Details View
- **Display Information:**
  - Order ID
  - Buyer Name/Company
  - Buyer Contact Info
  - Order Date
  - Order Items:
    - Product Name
    - Quantity Ordered
    - Unit Price
    - Total Price for item
    - Any applied discounts
  - Order Total
  - Delivery Address
  - Special Instructions (if any)
  - Order Status
  - Current Order Timeline

### 3.3 Accept/Confirm Order
- **Functionality:**
  - Move order from "New Orders" to "Accepted Orders"
  - Confirm availability of all items
  - Add optional message to buyer (e.g., delivery timeline)
  - Reduce stock automatically when order is accepted
  - Generate order confirmation

### 3.4 Update Order Status
- **Functionality:**
  - Mark as "Ready for Shipment"
  - Mark as "Shipped" (can add tracking number)
  - Mark as "Fulfilled/Delivered"
  - Add notes/messages at each step
  - Notify buyer at each status update

### 3.5 Reject/Cancel Order
- **Functionality:**
  - Option to reject orders before acceptance
  - Reason for rejection (required):
    - Stock not available
    - Item discontinued
    - Unable to fulfill
    - Other (with explanation)
  - Auto-notify buyer
  - Reason visible to buyer

### 3.6 Order Filters & Search
- **Functionality:**
  - Search by Order ID
  - Search by Buyer Name
  - Filter by Date Range
  - Filter by Status
  - Filter by Total Amount Range
  - Sort by date, amount, buyer name

### 3.7 Order History/Analytics
- **Display:**
  - Total orders received
  - Orders by status
  - Order trends (daily/weekly/monthly)
  - Top products ordered
  - Revenue from orders
  - Average order value

---

## 4. SUPPLIER PROFILE/SETTINGS

### 4.1 Supplier Information
- **Fields:**
  - Company Name (editable)
  - Business License/Registration Number (editable)
  - Contact Person Name (editable)
  - Email Address (editable)
  - Phone Number (editable)
  - Business Address (editable)
  - Business Hours (editable)
  - Company Logo (editable)
  - Description/Bio (editable)
  - Specialties/Categories they supply (editable)

### 4.2 Bank/Payment Information
- **Fields:**
  - Bank Name
  - Account Holder Name
  - Account Number
  - Routing Number
  - Account Type

### 4.3 Shipping Information
- **Fields:**
  - Default Shipping Method
  - Warehouse/Pickup Address
  - Accepted Shipping Destinations
  - Standard Delivery Time
  - Shipping Rates (if applicable)

### 4.4 Return & Refund Policy
- **Fields:**
  - Return Policy Description
  - Return Window (in days)
  - Refund Processing Time

---

## 5. DASHBOARD & ANALYTICS

### 5.1 Supplier Dashboard (Main Page)
- **Display:**
  - Welcome message with supplier name
  - Quick Stats:
    - Total Products Listed
    - Total Orders (month)
    - Pending Orders
    - Revenue (month/year)
    - Average Rating (if applicable)
  - Recent Orders (last 5-10)
  - Low Stock Alerts
  - Expiring Discounts
  - Quick Action Buttons:
    - Add New Product
    - View All Orders
    - Manage Inventory
    - View Discounts

### 5.2 Performance Metrics
- **Display:**
  - Orders received (daily/weekly/monthly chart)
  - Revenue trends
  - Top performing products
  - Order fulfillment rate
  - Average order value
  - Customer response time
  - Acceptance rate (orders accepted vs rejected)

---

## 6. NOTIFICATIONS & ALERTS

### 6.1 Alerts
- **Types:**
  - New order received
  - Low stock warning (when stock < threshold)
  - Discount expiring soon
  - Product deactivated by admin
  - Payment received
  - Order review/rating from buyer

### 6.2 Notifications Center
- **Features:**
  - View all notifications
  - Mark as read/unread
  - Clear old notifications
  - Email notification preferences

---

## 7. FUTURE ENHANCEMENTS (Optional)

### 7.1 Bulk Operations
- **Features:**
  - Bulk update stock for multiple products
  - Bulk add discounts
  - Bulk deactivate/activate products
  - Export inventory to CSV
  - Import products from CSV

### 7.2 Reports
- **Types:**
  - Inventory report
  - Sales report
  - Revenue report
  - Customer report
  - Exportable to PDF/Excel

### 7.3 Ratings & Reviews
- **Features:**
  - View buyer reviews/ratings
  - Supplier rating display
  - Response to reviews

### 7.4 Messages/Chat
- **Features:**
  - Direct messaging with buyers
  - Chat history
  - Quick replies for common questions

### 7.5 Invoice Generation
- **Features:**
  - Auto-generate invoices for orders
  - Send invoices to buyers
  - Invoice templates

---

## 8. TECHNICAL REQUIREMENTS

### 8.1 Authentication & Authorization
- Supplier login with email/password
- Session management
- Only see own products and orders
- Role-based access (Supplier role)

### 8.2 Data Validation
- All required fields must be filled
- Price must be positive number
- Stock must be non-negative
- Date validations for discounts
- Category/Subcategory must exist in system

### 8.3 Database Tables Needed
- `suppliers` - Supplier profile info
- `supplier_products` - Products listed by suppliers
- `supplier_discounts` - Discounts on products
- `supplier_orders` - Orders received by suppliers
- `order_items` - Line items in orders
- `stock_history` - Track inventory changes
- `supplier_categories_mapping` - Link suppliers to categories/subcategories

### 8.4 API Endpoints Required
- Product Management:
  - POST /api/supplier/products (add)
  - GET /api/supplier/products (list)
  - GET /api/supplier/products/:id (detail)
  - PUT /api/supplier/products/:id (update)
  - DELETE /api/supplier/products/:id (delete)
  - PATCH /api/supplier/products/:id/stock (update stock)

- Discount Management:
  - POST /api/supplier/discounts (add)
  - GET /api/supplier/discounts (list)
  - PUT /api/supplier/discounts/:id (update)
  - DELETE /api/supplier/discounts/:id (delete)

- Order Management:
  - GET /api/supplier/orders (list)
  - GET /api/supplier/orders/:id (detail)
  - PATCH /api/supplier/orders/:id/status (update status)
  - POST /api/supplier/orders/:id/accept (accept order)
  - POST /api/supplier/orders/:id/reject (reject order)

- Dashboard:
  - GET /api/supplier/dashboard (stats)
  - GET /api/supplier/analytics (metrics)

---

## 9. UI/UX CONSIDERATIONS

### 9.1 Navigation Structure
- Top Navigation Bar with:
  - Supplier Portal Logo/Name
  - Supplier Name / Profile Icon
  - Notifications Bell
  - Settings Icon
  - Logout

- Left Sidebar with main sections:
  - Dashboard
  - Inventory Management
    - All Products
    - Add New Product
    - Low Stock Items
  - Discounts
  - Orders
    - New Orders
    - Accepted Orders
    - Fulfilled Orders
  - Profile/Settings
  - Analytics/Reports
  - Logout

### 9.2 Responsive Design
- Mobile-friendly interface
- Tablet-optimized views
- Desktop full experience

### 9.3 Forms & Validation
- Clear error messages
- Inline validation where possible
- Confirmation dialogs for destructive actions
- Save drafts for long forms

---

## 10. SECURITY REQUIREMENTS

- All supplier data must be protected
- Only suppliers can edit their own data
- Admin can view/manage suppliers (future)
- Encrypt sensitive data (bank info, addresses)
- Audit logs for important actions (delete product, reject order, etc.)
- Rate limiting on API calls

---

## Phase 1 Priority (MVP)

### Must Have:
1. Supplier Registration/Login
2. Add Products with Category/Subcategory selection
3. View Product Inventory
4. Update Stock
5. View Orders (all statuses)
6. Accept/Reject Orders
7. Basic Dashboard with stats
8. Edit Product Details
9. Add Discounts to Products
10. Supplier Profile Page

### Nice to Have (Phase 2):
1. Bulk operations
2. Reports/Export
3. Messaging
4. Order tracking with timeline
5. Advanced analytics

---

## Estimated Components Needed

### Pages:
- `/supplier/login` - Login page
- `/supplier/dashboard` - Main dashboard
- `/supplier/products` - Product inventory list
- `/supplier/products/add` - Add new product form
- `/supplier/products/:id/edit` - Edit product form
- `/supplier/discounts` - Discounts management
- `/supplier/orders` - Orders list
- `/supplier/orders/:id` - Order details
- `/supplier/profile` - Supplier profile settings
- `/supplier/analytics` - Analytics/Reports

### Components:
- ProductForm (reusable for add/edit)
- OrderStatusBadge
- OrderCard
- ProductCard
- DiscountCard
- StockChart
- NotificationCenter
- Sidebar Navigation
- DashboardStats
- InventoryTable
- OrdersList

### Hooks:
- useSupplierProducts
- useSupplierOrders
- useSupplierDiscounts
- useSupplierStats
- useSupplierAuth

---

## Notes for Implementation

1. **Stock Deduction:** When an order is accepted, automatically deduct the ordered quantity from product stock
2. **Stock Alert Threshold:** Set a low stock alert threshold (e.g., < 10 units or < 50 kg)
3. **Order Timeline:** Show when order was received, accepted, shipped, delivered
4. **Discount Conflicts:** Prevent overlapping discounts on same product
5. **Category Management:** Use existing categories from buyer side, but allow "Other" as new subcategory
6. **Pagination:** Use pagination for large lists (products, orders)
7. **Real-time Updates:** Consider WebSocket for real-time new order notifications
8. **Undo Actions:** Consider adding undo functionality for recent actions
9. **Backup:** Consider scheduled backups of supplier data

---

End of Requirements Document
