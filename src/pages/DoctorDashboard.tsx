
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import { getPrescriptionRequests } from '@/data/prescriptionRequests';
import { PrescriptionRequest } from '@/types/prescription';
import { toast } from 'sonner';
import DashboardHeader from '@/components/doctor/dashboard/DashboardHeader';
import DashboardContent from '@/components/doctor/dashboard/DashboardContent';
import { useIsMobile } from '@/hooks/use-mobile';
import { logGdprActivity } from '@/utils/fhir/activityLogging';

const DoctorDashboard = () => {
  const { user, isDoctor } = useAuth();
  const navigate = useNavigate();
  const [requests, setRequests] = useState<PrescriptionRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('open');
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!isDoctor(user)) {
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

  const handleApprove = async (requestId: string) => {
    if (!user?.id) return;
    
    try {
      // Update request status in database would happen here
      // For demo purposes, we'll just update the local state
      const updatedRequests = requests.map(req => 
        req.id === requestId ? { ...req, status: 'approved' } : req
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
        req.id === requestId ? { ...req, status: 'rejected' } : req
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

  const filteredRequests = requests.filter(req => {
    if (activeTab === 'open') {
      return req.status === 'pending';
    } else if (activeTab === 'approved') {
      return req.status === 'approved';
    } else if (activeTab === 'rejected') {
      return req.status === 'rejected';
    }
    return true;
  });

  const selectedRequest = requests.find(req => req.id === selectedRequestId);

  return (
    <Layout>
      <div className="flex flex-col h-full">
        <DashboardHeader 
          activeTab={activeTab} 
          onTabChange={handleTabChange} 
          openRequestsCount={requests.filter(req => req.status === 'pending').length}
        />
        
        <DashboardContent 
          requests={filteredRequests}
          selectedRequest={selectedRequest}
          onSelectRequest={handleRequestSelect}
          onApprove={handleApprove}
          onReject={handleReject}
          loading={loading}
          isMobile={isMobile}
        />
      </div>
    </Layout>
  );
};

export default DoctorDashboard;
