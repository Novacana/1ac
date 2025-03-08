
import React from 'react';
import { Routes, Route, useLocation, Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import UserSidebar from '@/components/user/UserSidebar';
import OrdersList from '@/components/user/OrdersList';
import ConsultationsList from '@/components/user/ConsultationsList';
import WishlistItems from '@/components/user/WishlistItems';
import UserSettings from '@/components/user/UserSettings';
import { ChevronRight, Home } from 'lucide-react';

const UserDashboard = () => {
  const { user } = useAuth();
  const location = useLocation();
  
  // Helper function to get the current page title
  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('/orders')) return 'Bestellungen';
    if (path.includes('/consultations')) return 'Beratungen';
    if (path.includes('/wishlist')) return 'Wunschliste';
    if (path.includes('/settings')) return 'Einstellungen';
    return 'Dashboard';
  };

  return (
    <Layout>
      <div className="container px-4 mx-auto py-8">
        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:underline flex items-center">
            <Home className="h-3.5 w-3.5 mr-1" />
            Home
          </Link>
          <ChevronRight className="h-3.5 w-3.5 mx-1" />
          <Link to="/dashboard" className="hover:underline">
            Dashboard
          </Link>
          {location.pathname !== '/dashboard' && (
            <>
              <ChevronRight className="h-3.5 w-3.5 mx-1" />
              <span className="text-foreground">{getPageTitle()}</span>
            </>
          )}
        </div>
        
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="md:w-1/4">
            <UserSidebar user={user} />
          </div>
          
          {/* Main content */}
          <div className="md:w-3/4">
            <Routes>
              <Route path="/" element={<OrdersList />} />
              <Route path="/orders" element={<OrdersList />} />
              <Route path="/consultations" element={<ConsultationsList />} />
              <Route path="/wishlist" element={<WishlistItems />} />
              <Route path="/settings" element={<UserSettings />} />
            </Routes>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UserDashboard;
