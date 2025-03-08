
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
import UserDashboard from "./pages/UserDashboard";
import Login from "./pages/Login";
import { CartProvider } from "./contexts/CartContext";
import { AuthProvider } from "./contexts/AuthContext";
import { useAuth } from "./contexts/AuthContext";

// Protected Route for Doctors
const DoctorRoute = ({ children }) => {
  const { isAuthenticated, isDoctor } = useAuth();
  
  if (!isAuthenticated || !isDoctor) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// Protected Route for Users
const UserRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
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
            <Route 
              path="/doctor/dashboard" 
              element={
                <DoctorRoute>
                  <DoctorDashboard />
                </DoctorRoute>
              } 
            />
            <Route 
              path="/user/dashboard" 
              element={
                <UserRoute>
                  <UserDashboard />
                </UserRoute>
              } 
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
          <SonnerToaster position="top-center" />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
