
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import { getPrescriptionRequests } from '@/data/prescriptionRequests';
import { PrescriptionRequest } from '@/types/prescription';
import { toast } from 'sonner';
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

  useEffect(() => {
    if (!isDoctor) {
      navigate('/login');
      toast.error('Zugriff verweigert');
    }
  }, [isDoctor, navigate]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getPrescriptionRequests();
        setRequests(data);
      } catch (error) {
        toast.error('Fehler beim Laden der Rezeptanfragen');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const filteredRequests = requests.filter(req => {
    if (mainSection === 'open_requests') {
      return req.status === 'pending' && !req.assignedDoctorId;
    }
    
    if (activeTab === 'pending') return req.status === 'pending' && req.assignedDoctorId === user?.id;
    if (activeTab === 'approved') return req.status === 'approved' && req.assignedDoctorId === user?.id;
    if (activeTab === 'needs_info') return req.status === 'needs_more_info' && req.assignedDoctorId === user?.id;
    if (activeTab === 'rejected') return req.status === 'rejected' && req.assignedDoctorId === user?.id;
    return req.assignedDoctorId === user?.id;
  });

  const selectedRequest = requests.find(req => req.id === selectedRequestId);

  const handleRequestUpdate = (updatedRequest: PrescriptionRequest) => {
    setRequests(prevRequests => 
      prevRequests.map(req => 
        req.id === updatedRequest.id ? updatedRequest : req
      )
    );
    toast.success('Rezeptanfrage aktualisiert');
  };

  const handleAssignDoctor = (requestId: string) => {
    if (!user?.id) {
      toast.error('Fehler: Kein Arzt angemeldet');
      return;
    }
    
    setRequests(prevRequests => 
      prevRequests.map(req => 
        req.id === requestId 
          ? { ...req, assignedDoctorId: user.id } 
          : req
      )
    );
    
    setSelectedRequestId(requestId);
    setMainSection('prescriptions');
    setActiveTab('pending');
    toast.success('Patient übernommen');
  };

  return (
    <Layout>
      <div className="container px-4 mx-auto py-8">
        <div className="flex flex-col space-y-6">
          <DashboardHeader 
            mainSection={mainSection}
            onSectionChange={setMainSection}
          />
          
          <DashboardContent 
            user={user}
            mainSection={mainSection}
            activeTab={activeTab}
            selectedRequest={selectedRequest}
            filteredRequests={filteredRequests}
            loading={loading}
            selectedRequestId={selectedRequestId}
            onSectionChange={setMainSection}
            onTabChange={setActiveTab}
            onSelectRequest={setSelectedRequestId}
            onRequestUpdate={handleRequestUpdate}
            onAssignDoctor={handleAssignDoctor}
          />
        </div>
      </div>
    </Layout>
  );
};

export default DoctorDashboard;
