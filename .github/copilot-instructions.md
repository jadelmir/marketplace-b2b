# AI Coding Agent Instructions for B2B Marketplace Frontend

## Project Overview

**React 18 + TypeScript B2B marketplace** serving two user roles:
- **Buyers** (restaurants): search suppliers, browse products, manage cart (single-supplier constraint), place orders
- **Suppliers**: manage product catalogs, view incoming orders, manage discounts/profiles

Single codebase with role-based routing post-login; all routes default to `/login`.

## Tech Stack

**Framework**: React 18.2 + TypeScript 5.3 | **Build**: Vite 5.0 (port 3000) | **HTTP**: Axios + TanStack Query 5.28 | **State**: Context API + useReducer | **Styling**: Tailwind CSS 3.3 + PostCSS | **Routing**: React Router DOM 6.20

## Critical Architectural Patterns

### State Management (useReducer + Context only)
- **AuthContext** ([src/context/AuthContext.tsx](src/context/AuthContext.tsx)): `{ user, isLoading, error, token }` with actions `LOGIN_START | LOGIN_SUCCESS | LOGIN_FAILURE | LOGOUT | RESTORE_USER | CLEAR_ERROR`. Auto-restores from localStorage on mount.
- **CartContext** ([src/context/CartContext.tsx](src/context/CartContext.tsx)): Enforces **single-supplier constraint** — `ADD_ITEM` from different supplier auto-clears cart. Provides helper methods: `addItem(item)`, `removeItem(productId)`, `updateQuantity(productId, qty)`, `clearCart()`.

### API Layer (Modular, Defensive)
- **Shared client**: [src/api/client.ts](src/api/client.ts) (axios instance with `Authorization: Bearer <token>` interceptor)
- **Base URL**: `http://localhost:3001/api`
- **Modules**: [src/api/auth.ts](src/api/auth.ts), [src/api/products.ts](src/api/products.ts), [src/api/orders.ts](src/api/orders.ts), [src/api/categories.ts](src/api/categories.ts)
- **Response format**: APIs defensively handle both `{ success, data: T }` and direct array responses; extract `response.data.data` or `response.data` as fallback
- **Error handling**: APIs throw errors on failure (catch blocks extract message from `error.response?.data?.message`); components must handle `error` and empty states

### Data Fetching (TanStack Query + Hooks)
- **Reads**: `useQuery` via [src/hooks/useProducts.ts](src/hooks/useProducts.ts), [src/hooks/useOrders.ts](src/hooks/useOrders.ts), [src/hooks/useCategories.ts](src/hooks/useCategories.ts)
- **Writes**: `useMutation` via [src/hooks/useMutations.ts](src/hooks/useMutations.ts), [src/hooks/useAuth.ts](src/hooks/useAuth.ts)
- **queryKey pattern**: `['resource', 'action', ...params]` (e.g., `['products', 'search', query, category]`)
- **Auth mutations**: Use `useBuyerLogin()`, `useSupplierLogin()`, `useBuyerRegister()`, `useSupplierRegister()`, `useLogout()`
- **Conditional queries**: Always use `enabled: !!param` to prevent requests with undefined params

## Router Structure

All routes in [src/App.tsx](src/App.tsx):
- **Buyer routes** (`/buyer/*`): wrapped in `<BuyerLayout>` (persistent header/sidebar)
- **Supplier routes** (`/supplier/*`): standalone pages (no layout wrapper)
- **Auth**: `/login` (split form for buyer/supplier tabs)
- **Catch-all**: redirects to `/login`

## Developer Workflows

```bash
npm run dev      # Vite dev server on :3000
npm run build    # TypeScript check + Vite production build
npm run lint     # ESLint, zero-warning policy (run before commit)
npm run preview  # Local prod build preview
```

## Key Constraints & Patterns

- ❌ No Redux/Zustand — Context + useReducer only
- ❌ No raw axios in components — use hooks exclusively
- ❌ No hardcoded API URLs — use [src/api/client.ts](src/api/client.ts)
- ❌ No multi-supplier carts — CartContext enforces single-supplier
- ❌ No `any` types — TypeScript strict mode enabled
- ❌ No custom CSS — Tailwind utilities only
- ❌ No queries without `enabled` condition — prevents unnecessary requests

## Implementation Examples

**Fetch & display products**:
```typescript
const { data, isLoading, error } = useSearchProducts(query, category);
if (isLoading) return <Spinner />;
if (error) return <ErrorMessage msg={error.message} />;
return (data || []).map(p => <ProductCard key={p.id} {...p} />);
```

**Add to cart** (auto-clears if different supplier):
```typescript
const { addItem } = useCart();
addItem({ product, quantity, supplierId });
```

**Place order**:
```typescript
const mutation = usePlaceOrder();
mutation.mutate({ supplierId, items: [...] });
```

**API defensive pattern**:
```typescript
const response = await apiClient.get('/endpoint');
// Handle both wrapped and direct response formats
if (response.data?.success && Array.isArray(response.data?.data)) return response.data.data;
if (Array.isArray(response.data)) return response.data;
throw new Error('Invalid response format');
```
