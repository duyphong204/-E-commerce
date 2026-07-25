import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import UserLayout from '@/components/Layout/UserLayout';
import AdminLayout from '@/components/Layout/AdminLayout';
import { ProtectedRoute } from './ProtectedRoute';
import { Loading } from '@/shared/components/feedback/Loading';

// Static Import (Primary Home Entry Page)
import Home from '@/pages/Home';

// Lazy Loaded Pages - User
const Login = lazy(() => import('@/pages/Login'));
const Register = lazy(() => import('@/pages/Register'));
const Profile = lazy(() => import('@/pages/Profile'));
const CollectionPage = lazy(() => import('@/pages/CollectionPage'));
const ProductDetail = lazy(() => import('@/components/Products/ProductDetail'));
const Checkout = lazy(() => import('@/components/Cart/Checkout'));
const OrderConfirmationPage = lazy(() => import('@/pages/OrderConfirmationPage'));
const OrderDetailsPage = lazy(() => import('@/pages/OrderDetailsPage'));
const MyOrdersPage = lazy(() => import('@/pages/MyOrdersPage'));
const About = lazy(() => import('@/pages/About'));

// Lazy Loaded Pages - Admin
const AdminHomePage = lazy(() => import('@/pages/AdminHomePage'));
const UserManagement = lazy(() => import('@/features/accounts/components/UserManagementContainer'));
const ProductManagement = lazy(() => import('@/features/products/components/AdminProductManagementContainer'));
const CouponManagement = lazy(() => import('@/features/coupons/components/CouponManagementContainer'));
const EditProductPage = lazy(() => import('@/features/products/components/EditProductPage'));
const CreateProductPage = lazy(() => import('@/features/products/components/CreateProductPage'));
const OrderManagement = lazy(() => import('@/features/orders/components/AdminOrderManagementContainer'));
const BannerManagement = lazy(() => import('@/features/banners/components/BannerManagementContainer'));

export function AppRoutes() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        {/* User Routes */}
        <Route path="/" element={<UserLayout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="profile" element={<Profile />} />
          <Route path="collections/:collection" element={<CollectionPage />} />
          <Route path="product/:id" element={<ProductDetail />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="order-confirmation" element={<OrderConfirmationPage />} />
          <Route path="order/:id" element={<OrderDetailsPage />} />
          <Route path="my-orders" element={<MyOrdersPage />} />
          <Route path="about" element={<About />} />
        </Route>

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminHomePage />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="products" element={<ProductManagement />} />
          <Route path="banners" element={<BannerManagement />} />
          <Route path="coupon" element={<CouponManagement />} />
          <Route path="products/:id/edit" element={<EditProductPage />} />
          <Route path="products/create" element={<CreateProductPage />} />
          <Route path="orders" element={<OrderManagement />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
