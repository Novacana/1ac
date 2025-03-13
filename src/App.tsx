
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { ThemeProvider } from './components/ThemeProvider';
import './index.css';

// Pages
import Index from './pages/Index';
import DoctorLanding from './pages/DoctorLanding';
import PharmacyLanding from './pages/PharmacyLanding';
import Login from './pages/Login';
import Register from './pages/Register';
import Products from './pages/Products';
import Product from './pages/Product';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import NotFound from './pages/NotFound';
import DoctorDashboard from './pages/DoctorDashboard';
import DoctorProfile from './pages/DoctorProfile';
import PharmacyProfile from './pages/PharmacyProfile';
import PharmacyManagement from './pages/PharmacyManagement';
import Documentation from './pages/Documentation';
import UserDashboard from './pages/UserDashboard';
import Settings from './pages/Settings';
import PrivacyPolicy from './pages/PrivacyPolicy';
import AdminConfig from './pages/AdminConfig';

// Providers
import { CartProvider } from './contexts/CartContext';
import AuthProvider from './contexts/AuthContext';

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <AuthProvider>
          <CartProvider>
            <Toaster position="top-center" />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/doctor" element={<DoctorLanding />} />
              <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
              <Route path="/doctor/profile" element={<DoctorProfile />} />
              <Route path="/pharmacy" element={<PharmacyLanding />} />
              <Route path="/pharmacy/management" element={<PharmacyManagement />} />
              <Route path="/pharmacy/profile" element={<PharmacyProfile />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/products" element={<Products />} />
              <Route path="/product/:id" element={<Product />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/dashboard" element={<UserDashboard />} />
              <Route path="/dashboard/:section" element={<UserDashboard />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/documentation" element={<Documentation />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/admin/config" element={<AdminConfig />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
