
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { Toaster } from "./components/ui/toaster";
import { Toaster as SonnerToaster } from "sonner";
import Index from "./pages/Index";
import Products from "./pages/Products";
import Product from "./pages/Product";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import NotFound from "./pages/NotFound";
import AdminConfig from "./pages/AdminConfig";
import DoctorDashboard from "./pages/DoctorDashboard";
import DoctorLanding from "./pages/DoctorLanding";
import PharmacyLanding from "./pages/PharmacyLanding"; 
import Login from "./pages/Login";
import Register from "./pages/Register";
import Settings from "./pages/Settings";
import UserDashboard from "./pages/UserDashboard";
import PharmacyManagement from "./pages/PharmacyManagement";
import PharmacyProfile from "./pages/PharmacyProfile";
import Documentation from "./pages/Documentation";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import { CartProvider } from "./contexts/CartContext";
import AuthProvider, { useAuth } from "./contexts/AuthContext";
import GDPRCookieConsent from "./components/GDPRCookieConsent";

// Protected Route Component for Doctor
const DoctorRoute = ({ children }) => {
  const { isAuthenticated, isDoctor } = useAuth();
  
  if (!isAuthenticated || !isDoctor) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// Protected Route Component for Authenticated Users
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// Protected Route Component for Pharmacy Users
const PharmacyRoute = ({ children }) => {
  const { isAuthenticated, isPharmacy } = useAuth();
  
  if (!isAuthenticated || !isPharmacy) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/products" element={<Products />} />
            <Route path="/product/:id" element={<Product />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/admin/config" element={<AdminConfig />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/documentation" element={<Documentation />} />
            <Route path="/datenschutz" element={<PrivacyPolicy />} />
            <Route path="/doctor/landing" element={<DoctorLanding />} />
            <Route path="/pharmacy/landing" element={<PharmacyLanding />} />
            <Route 
              path="/settings" 
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/doctor/dashboard" 
              element={
                <DoctorRoute>
                  <DoctorDashboard />
                </DoctorRoute>
              } 
            />
            <Route 
              path="/pharmacy/management" 
              element={
                <PharmacyRoute>
                  <PharmacyManagement />
                </PharmacyRoute>
              } 
            />
            <Route 
              path="/pharmacy/profile" 
              element={
                <PharmacyRoute>
                  <PharmacyProfile />
                </PharmacyRoute>
              } 
            />
            <Route 
              path="/dashboard/*" 
              element={
                <ProtectedRoute>
                  <UserDashboard />
                </ProtectedRoute>
              } 
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
          <SonnerToaster position="top-center" />
          <GDPRCookieConsent />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
