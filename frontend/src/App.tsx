import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { Provider } from 'react-redux';
import store from './redux/store';
import ProtectedRoute from './components/Common/ProtectedRoute';
import Loading from './components/Common/Loading';
import ErrorBoundary from './components/Common/ErrorBoundary';
import 'react-toastify/dist/ReactToastify.css';

// Static Import (Primary Layout & Entry Page)
import UserLayout from './components/Layout/UserLayout';
import Home from './pages/Home';

// Lazy Loaded Pages - User
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Profile = lazy(() => import('./pages/Profile'));
const CollectionPage = lazy(() => import('./pages/CollectionPage'));
const ProductDetail = lazy(() => import('./components/Products/ProductDetail'));
const Checkout = lazy(() => import('./components/Cart/Checkout'));
const OrderConfirmationPage = lazy(() => import('./pages/OrderConfirmationPage'));
const OrderDetailsPage = lazy(() => import('./pages/OrderDetailsPage'));
const MyOrdersPage = lazy(() => import('./pages/MyOrdersPage'));
const About = lazy(() => import('./pages/About'));

// Lazy Loaded Pages - Admin
const AdminLayout = lazy(() => import('./components/Admin/AdminLayout'));
const AdminHomePage = lazy(() => import('./pages/AdminHomePage'));
const UserManagement = lazy(() => import('./components/Admin/User/UserManagement'));
const ProductManagement = lazy(() => import('./components/Admin/Product/ProductManagement'));
const CouponManagement = lazy(() => import('./components/Admin/Coupon/CouponManagement'));
const EditProductPage = lazy(() => import('./components/Admin/Product/EditProductPage'));
const CreateProductPage = lazy(() => import('./components/Admin/Product/CreateProductPage'));
const OrderManagement = lazy(() => import('./components/Admin/Order/OrderManagement'));
const BannerManagement = lazy(() => import('./components/Admin/Banner/BannerManagement'));

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <BrowserRouter>
          <ToastContainer
            position="top-right"
            autoClose={2000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
            limit={2}
          />
          
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
        </BrowserRouter>
      </Provider>
    </ErrorBoundary>
  );
};

export default App;
