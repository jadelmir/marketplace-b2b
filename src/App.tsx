import { QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { BuyerLayout } from './components/buyer/BuyerLayout';
import { queryClient } from './config/queryClient';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { CartPage } from './pages/buyer/CartPage';
import { OrdersPage } from './pages/buyer/OrdersPage';
import { SearchPage } from './pages/buyer/SearchPage';
import { SupplierDetailPage } from './pages/buyer/SupplierDetailPage';
import { LoginPage } from './pages/LoginPage';
import AddProductPage from './pages/supplier/AddProductPage';
import SupplierDashboardPage from './pages/supplier/DashboardPage';
import DiscountsPage from './pages/supplier/DiscountsPage';
import OrdersPageSupplier from './pages/supplier/OrdersPage';
import ProductsPage from './pages/supplier/ProductsPage';
import ProfilePage from './pages/supplier/ProfilePage';

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <CartProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<Navigate to="/login" replace />} />
            
            {/* Buyer Routes */}
            <Route element={<BuyerLayout />}>
              <Route path="/buyer/search" element={<SearchPage />} />
              <Route path="/buyer/supplier/:id" element={<SupplierDetailPage />} />
              <Route path="/buyer/cart" element={<CartPage />} />
              <Route path="/buyer/orders" element={<OrdersPage />} />
            </Route>

            {/* Supplier Routes */}
            <Route path="/supplier/dashboard" element={<SupplierDashboardPage />} />
            <Route path="/supplier/products" element={<ProductsPage />} />
            <Route path="/supplier/products/add" element={<AddProductPage />} />
            <Route path="/supplier/orders" element={<OrdersPageSupplier />} />
            <Route path="/supplier/discounts" element={<DiscountsPage />} />
            <Route path="/supplier/profile" element={<ProfilePage />} />

            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
          </CartProvider>
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
};

export default App;
