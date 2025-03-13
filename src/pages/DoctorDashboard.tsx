
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import { getPrescriptionRequests } from '@/data/prescriptionRequests';
import { PrescriptionRequest } from '@/types/prescription';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';
import { logGdprActivity } from '@/utils/fhir/activityLogging';
import DoctorSidebar from '@/components/doctor/DoctorSidebar';
import DashboardHeader from '@/components/doctor/dashboard/DashboardHeader';
import DashboardContent from '@/components/doctor/dashboard/DashboardContent';

const DoctorDashboard = () => {
  const { user, isDoctor } = useAuth();
  const navigate = useNavigate();
  const [requests, setRequests] = useState<PrescriptionRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('pending');
  const [mainSection, setMainSection] = useState<'prescriptions' | 'patients' | 'open_requests' | 'video' | 'calendar'>('prescriptions');
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Fix: Check if user is a doctor without calling isDoctor
    // isDoctor could be a boolean or a function, so we need to handle both cases
    const isDoctorUser = typeof isDoctor === 'boolean' ? isDoctor : (user && user.role === 'doctor');
    
    if (!isDoctorUser) {
      toast.error('Sie haben keinen Zugriff auf diese Seite.');
      navigate('/');
      return;
    }

    fetchRequests();
    
    // Log GDPR activity for dashboard access
    if (user.id) {
      logGdprActivity(
        user.id,
        'dashboard_access',
        'Doctor accessed prescription dashboard'
      );
    }
  }, [user, navigate, isDoctor]);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const data = await getPrescriptionRequests();
      setRequests(data);
    } catch (error) {
      console.error('Error fetching prescription requests:', error);
      toast.error('Fehler beim Laden der Anfragen');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestSelect = (requestId: string) => {
    setSelectedRequestId(requestId);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleSectionChange = (section: 'prescriptions' | 'patients' | 'open_requests' | 'video' | 'calendar') => {
    setMainSection(section);
  };

  const handleApprove = async (requestId: string) => {
    if (!user?.id) return;
    
    try {
      // Update request status in database would happen here
      // For demo purposes, we'll just update the local state
      const updatedRequests = requests.map(req => 
        req.id === requestId ? { ...req, status: 'approved' as const } : req
      );
      
      setRequests(updatedRequests);
      toast.success('Rezept wurde freigegeben');
      
      // Log GDPR activity for prescription approval
      await logGdprActivity(
        user.id,
        'prescription_approval',
        `Doctor approved prescription request ${requestId}`
      );
    } catch (error) {
      console.error('Error approving request:', error);
      toast.error('Fehler bei der Freigabe des Rezepts');
    }
  };

  const handleReject = async (requestId: string) => {
    if (!user?.id) return;
    
    try {
      // Update request status in database would happen here
      // For demo purposes, we'll just update the local state
      const updatedRequests = requests.map(req => 
        req.id === requestId ? { ...req, status: 'rejected' as const } : req
      );
      
      setRequests(updatedRequests);
      toast.success('Rezept wurde abgelehnt');
      
      // Log GDPR activity for prescription rejection
      await logGdprActivity(
        user.id,
        'prescription_rejection',
        `Doctor rejected prescription request ${requestId}`
      );
    } catch (error) {
      console.error('Error rejecting request:', error);
      toast.error('Fehler bei der Ablehnung des Rezepts');
    }
  };
  
  const handleRequestUpdate = (updatedRequest: PrescriptionRequest) => {
    const updatedRequests = requests.map(req => 
      req.id === updatedRequest.id ? updatedRequest : req
    );
    setRequests(updatedRequests);
  };
  
  const handleAssignDoctor = (requestId: string) => {
    if (!user?.id) return;
    
    const updatedRequests = requests.map(req => 
      req.id === requestId ? { ...req, assignedDoctorId: user.id } : req
    );
    setRequests(updatedRequests);
    toast.success('Sie wurden dieser Anfrage zugewiesen');
  };

  const filteredRequests = requests.filter(req => {
    if (activeTab === 'pending') {
      return req.status === 'pending';
    } else if (activeTab === 'approved') {
      return req.status === 'approved';
    } else if (activeTab === 'rejected') {
      return req.status === 'rejected';
    } else if (activeTab === 'needs_info') {
      return req.status === 'needs_more_info';
    }
    return true; // For 'all' tab
  });

  const selectedRequest = requests.find(req => req.id === selectedRequestId);

  return (
    <Layout>
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
    </Layout>
  );
};

export default DoctorDashboard;
