import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ToastProvider } from './context/ToastContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'

// Pages
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import CustomerOrders from './pages/CustomerOrders'
import OrderDetail from './pages/OrderDetail'
import FarmerDashboard from './pages/FarmerDashboard'
import FarmerProducts from './pages/FarmerProducts'
import FarmerOrders from './pages/FarmerOrders'

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <Navbar />
          <main>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:id" element={<ProductDetail />} />

              {/* Customer routes */}
              <Route path="/cart" element={<Cart />} />
              <Route
                path="/orders"
                element={
                  <ProtectedRoute role="CUSTOMER">
                    <CustomerOrders />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/orders/:id"
                element={
                  <ProtectedRoute>
                    <OrderDetail />
                  </ProtectedRoute>
                }
              />

              {/* Farmer routes */}
              <Route
                path="/farmer/dashboard"
                element={
                  <ProtectedRoute role="FARMER">
                    <FarmerDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/farmer/products"
                element={
                  <ProtectedRoute role="FARMER">
                    <FarmerProducts />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/farmer/orders"
                element={
                  <ProtectedRoute role="FARMER">
                    <FarmerOrders />
                  </ProtectedRoute>
                }
              />

              {/* 404 Fallback */}
              <Route
                path="*"
                element={
                  <div className="not-found-page">
                    <div className="not-found-content">
                      <div className="not-found-icon">🌾</div>
                      <h1>404</h1>
                      <h2>Page Not Found</h2>
                      <p>Looks like this page wandered off into the fields.</p>
                      <a href="/" className="btn btn-primary">← Back to Home</a>
                    </div>
                  </div>
                }
              />
            </Routes>
          </main>
          <Footer />
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  )
}
