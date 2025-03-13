
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';
import { logGdprActivity } from '@/utils/fhir/activityLogging';
import DoctorSidebar from '@/components/doctor/DoctorSidebar';
import DashboardHeader from '@/components/doctor/dashboard/DashboardHeader';
import DashboardContent from '@/components/doctor/dashboard/DashboardContent';
import { usePrescriptionRequests } from '@/hooks/usePrescriptionRequests';
import { useDashboardNavigation } from '@/hooks/useDashboardNavigation';
import { TooltipProvider } from '@/components/ui/tooltip';

const DoctorDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  // Custom hooks for managing state and handlers
  const { 
    loading, 
    selectedRequestId, 
    activeTab, 
    selectedRequest, 
    filteredRequests,
    handleRequestSelect, 
    handleTabChange, 
    handleRequestUpdate, 
    handleAssignDoctor,
    fetchRequests
  } = usePrescriptionRequests(user?.id);
  
  const { mainSection, handleSectionChange } = useDashboardNavigation();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Check if user is a doctor
    const isDoctorUser = user?.role === 'doctor';
    
    if (!isDoctorUser) {
      toast.error('Sie haben keinen Zugriff auf diese Seite.');
      navigate('/');
      return;
    }

    // Log GDPR activity for dashboard access
    if (user.id) {
      logGdprActivity(
        user.id,
        'dashboard_access',
        'Doctor accessed prescription dashboard'
      );
    }
  }, [user, navigate]);

  return (
    <Layout>
      <TooltipProvider>
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {!isMobile && (
              <div className="lg:w-1/4">
                <DoctorSidebar 
                  user={user} 
                  onNavChange={handleSectionChange}
                  activeSection={mainSection}
                />
              </div>
            )}
            
            <div className="lg:w-3/4">
              <div className="flex flex-col h-full">
                <DashboardHeader
                  mainSection={mainSection}
                  onSectionChange={handleSectionChange}
                />
                
                <DashboardContent
                  user={user}
                  mainSection={mainSection}
                  activeTab={activeTab}
                  selectedRequest={selectedRequest}
                  filteredRequests={filteredRequests}
                  loading={loading}
                  selectedRequestId={selectedRequestId}
                  onSectionChange={handleSectionChange}
                  onTabChange={handleTabChange}
                  onSelectRequest={handleRequestSelect}
                  onRequestUpdate={handleRequestUpdate}
                  onAssignDoctor={handleAssignDoctor}
                />
              </div>
            </div>
          </div>
        </div>
      </TooltipProvider>
    </Layout>
  );
};

export default DoctorDashboard;
